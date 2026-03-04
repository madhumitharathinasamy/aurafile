"use client";

import { useState, useEffect } from "react";
import { PdfUploader } from "@/components/tools/PdfUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDropzone } from "react-dropzone";
import { UPLOAD_LIMITS } from "@/config/limits";
import { generatePdfPreview } from "@/lib/pdf-processing/pdf-preview";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { PdfPageGallery, PdfPageThumb } from "@/components/tools/PdfPageGallery";
import { PdfMergeSeo } from "@/components/seo/SeoContentBlocks";

export default function MergePdfTool() {
    const {
        files,
        setFiles,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        removeFile,
        clearAll,
        updatePreviewUrl,
        updateFileSettings
    } = useFileUpload([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [mergedUrl, setMergedUrl] = useState<string | null>(null);
    const [pageMetadata, setPageMetadata] = useState<PdfPageThumb[]>([]);

    useEffect(() => {
        files.forEach(async (fileObj) => {
            if (fileObj.previewUrl && fileObj.previewUrl.startsWith('blob:') && fileObj.format === 'pdf') {
                const preview = await generatePdfPreview(fileObj.file);
                if (preview) {
                    updatePreviewUrl(fileObj.id, preview.url);
                    updateFileSettings(fileObj.id, { pageCount: preview.pageCount });
                }
            }
        });
    }, [files, updatePreviewUrl]);

    const handleUpload = (newFiles: File[]) => {
        addFiles(newFiles);
        setMergedUrl(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles?.length > 0) {
                if (files.length + acceptedFiles.length > UPLOAD_LIMITS.MAX_FILES) {
                    toast.warning(`Limit reached. Maximum ${UPLOAD_LIMITS.MAX_FILES} files allowed.`);
                    handleUpload(acceptedFiles.slice(0, UPLOAD_LIMITS.MAX_FILES - files.length));
                } else {
                    handleUpload(acceptedFiles);
                }
            }
        },
        accept: {
            "application/pdf": [".pdf"],
        },
        maxSize: UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES,
        onDropRejected: (rejectedFiles) => {
            const error = rejectedFiles[0]?.errors[0];
            if (error?.code === "file-too-large") {
                toast.error(`File is too large. Max size is ${UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB.`);
            } else if (error?.code === "file-invalid-type") {
                toast.error("Invalid file type. Please upload a PDF file.");
            } else {
                toast.error(`Error: ${error?.message || "File rejected"}`);
            }
        }
    });

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === files.length - 1)
        ) return;

        setFiles(prev => {
            const newFiles = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
            return newFiles;
        });
        setMergedUrl(null);
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !!mergedUrl) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        setFiles(prev => {
            const newFiles = [...prev];
            const [movedFile] = newFiles.splice(sourceIndex, 1);
            newFiles.splice(destinationIndex, 0, movedFile);
            return newFiles;
        });
        setMergedUrl(null);
        setActiveIndex(destinationIndex);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            toast.error("Please select at least 2 PDF files to merge.");
            return;
        }

        setIsProcessing(true);
        try {
            const payloadFiles = [];
            for (const fileState of files) {
                const arrayBuffer = await fileState.file.arrayBuffer();
                const filePages = pageMetadata.filter(p => p.fileId === fileState.id && !p.deleted);

                const allPages = pageMetadata.length === 0;

                // Ensure original document order
                filePages.sort((a, b) => a.pageNum - b.pageNum);

                payloadFiles.push({
                    buffer: arrayBuffer,
                    allPages,
                    pages: filePages.map(p => ({ pageNum: p.pageNum, rotation: p.rotation }))
                });
            }

            const worker = new Worker(new URL('../../workers/pdf.worker.ts', import.meta.url));

            worker.onmessage = (e) => {
                if (e.data.type === 'SUCCESS') {
                    const blob = new Blob([e.data.payload.buffer], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    setMergedUrl(url);
                    toast.success("PDFs merged successfully!");
                } else if (e.data.type === 'ERROR') {
                    toast.error(e.data.payload.error);
                }
                setIsProcessing(false);
                worker.terminate();
            };

            worker.onerror = (error) => {
                console.error("Worker Error:", error);
                toast.error("Failed to initialize merge worker.");
                setIsProcessing(false);
                worker.terminate();
            };

            worker.postMessage({
                type: 'MERGE',
                payload: { files: payloadFiles }
            });

        } catch (error) {
            console.error(error);
            toast.error("Failed to prepare PDFs for merging.");
            setIsProcessing(false);
        }
    };

    const downloadFile = async () => {
        if (!mergedUrl) return;

        try {
            const response = await fetch(mergedUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `merged_document_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download merged PDF safely.");
        }
    };

    const handlePrimaryAction = () => {
        if (mergedUrl) {
            downloadFile();
        } else {
            handleMerge();
        }
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-xl border border-border bg-white shadow-xl p-4 md:p-8">
                        <PdfUploader onUpload={handleUpload} />

                        <div className="mt-8 rounded-xl bg-[#0081C9]/5 p-4 text-sm text-[#0081C9] border border-[#0081C9]/20 flex gap-3 mx-auto max-w-2xl">
                            <Icon name="shield" size={20} className="flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>Secure Processing:</strong> Your files are merged entirely in your web browser. They are never uploaded to any server.
                            </div>
                        </div>
                    </div>

                    <PdfMergeSeo />
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                hidePreviewPane={false}
                title="Merge PDF"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        {mergedUrl ? (
                            <>
                                <Icon name="download" size={18} />
                                Download Merged PDF
                            </>
                        ) : (
                            <>
                                <Icon name="files" size={18} />
                                Merge PDF Files
                            </>
                        )}
                    </span>
                }
                isProcessing={isProcessing}
                isPrimaryDisabled={files.length < 2 && !mergedUrl}
                customPreview={<PdfPageGallery files={files} onPageStateChange={setPageMetadata} />}
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-slate-800 font-sans">Document Order</h2>
                            {mergedUrl && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    <Icon name="check-circle" size={14} />
                                    Combined
                                </span>
                            )}
                        </div>

                        {/* Stats Info Box */}
                        <div className="bg-[#E8ECEF] rounded-xl p-4 flex flex-col gap-3 shadow-sm mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <Icon name="layers" size={24} className="text-[#0081C9]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-800 truncate">
                                        {files.length} Document{files.length !== 1 ? 's' : ''} Uploaded
                                    </p>
                                    <p className="text-muted-foreground mt-0.5">
                                        Use the arrows below to order them.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {files.length === 1 && !mergedUrl && (
                            <div className="bg-amber-50 text-amber-700 border border-amber-200/50 rounded-xl p-3 text-sm font-medium flex items-center gap-2 mb-6">
                                <Icon name="alert-circle" size={16} className="text-amber-500 shrink-0" />
                                Please add at least one more PDF to merge.
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-slate-800">Files to Merge</h3>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="merge-file-list">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar pb-4"
                                    >
                                        {files.map((fileState, index) => (
                                            <Draggable key={fileState.id} draggableId={fileState.id} index={index} isDragDisabled={!!mergedUrl}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`flex items-center justify-between p-3 bg-white border rounded-xl transition-all ${snapshot.isDragging ? 'shadow-lg border-[#0081C9] ring-1 ring-[#0081C9] z-50 scale-[1.02]' : 'border-slate-200 shadow-sm hover:border-[#0081C9]/50'}`}
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="bg-[#E8ECEF] p-2 rounded-lg text-slate-600 flex-shrink-0 relative group">
                                                                <Icon name="grip-vertical" size={18} className="opacity-50 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
                                                                {index === activeIndex && !snapshot.isDragging && (
                                                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0081C9] rounded-full border-2 border-white"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="truncate text-xs font-semibold text-slate-700" title={fileState.file.name}>
                                                                    {fileState.file.name}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-medium">
                                                                    {(fileState.size / 1024).toFixed(1)} KB
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-0.5 bg-[#E8ECEF] rounded-lg p-0.5 flex-shrink-0">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeFile(fileState.id); }}
                                                                disabled={!!mergedUrl}
                                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
                                                                title="Remove File"
                                                            >
                                                                <Icon name="x" size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {!mergedUrl && files.length < UPLOAD_LIMITS.MAX_FILES && (
                            <div
                                {...getRootProps()}
                                className={`mt-4 w-full rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-2 ${isDragActive
                                    ? "border-[#0081C9] bg-[#0081C9]/5"
                                    : "border-slate-300 bg-slate-50 hover:border-[#0081C9]/50 hover:bg-slate-100"
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="bg-white p-2 rounded-full shadow-sm text-[#0081C9]">
                                    <Icon name="plus" size={20} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">
                                    {isDragActive ? "Drop PDF here" : "Add More Files"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </ToolModal>
        </div>
    );
}
