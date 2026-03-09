"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDropzone } from "react-dropzone";
import { UPLOAD_LIMITS } from "@/config/limits";
import { toast } from "sonner";
import { generatePdfFromImages, PageSizeOption, MarginOption } from "@/lib/pdf-processing/image-to-pdf";
import { saveAs } from "file-saver";

export default function ImageToPdfTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        clearAll
    } = useFileUpload([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [pageSize, setPageSize] = useState<PageSizeOption>("a4-p");
    const [margin, setMargin] = useState<MarginOption>("none");
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

    const handleUpload = async (uploadedFiles: File[]) => {
        addFiles(uploadedFiles);
        // Reset done state on new upload
        if (isDone) {
            setIsDone(false);
            setPdfBlobUrl(null);
        }
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
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif", ".bmp"],
        },
        maxSize: UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES,
        onDropRejected: (rejectedFiles) => {
            const error = rejectedFiles[0]?.errors[0];
            if (error?.code === "file-too-large") {
                toast.error(`File is too large. Max size is ${UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB.`);
            } else if (error?.code === "file-invalid-type") {
                toast.error("Invalid file type. Please upload an image format.");
            } else {
                toast.error(`Error: ${error?.message || "File rejected"}`);
            }
        }
    });

    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

    const handleProcess = async () => {
        if (isDone && pdfBlob) {
            // Robust download trigger for existing generated blob
            try {
                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = `aurafile_merged_images.pdf`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            } catch (e) {
                toast.error("Failed to download PDF.");
            }
            return;
        }

        if (files.length === 0) return;

        setIsProcessing(true);
        try {
            const rawFiles = files.map(f => f.file);
            const blob = await generatePdfFromImages(rawFiles, {
                pageSize,
                margin,
            });

            setPdfBlob(blob);
            setIsDone(true);
            toast.success("PDF generated successfully!");

            // Auto download on first generation using the same robust method
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = `aurafile_merged_images.pdf`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

        } catch (error) {
            toast.error("Failed to generate PDF. Check console for details.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClear = () => {
        clearAll();
        setIsDone(false);
        if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-2xl border border-border bg-surface shadow-xl p-4 md:p-8 backdrop-blur-sm">
                        <ImageUploader onUpload={handleUpload} />
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={handleClear}
                title="Image to PDF"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handleProcess}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        {isDone ? (
                            <>
                                <Icon name="download" size={18} />
                                Download PDF
                            </>
                        ) : (
                            <>
                                <Icon name="file-plus" size={18} />
                                Generate PDF
                            </>
                        )}
                    </span>
                }
                isProcessing={isProcessing}
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                {activeFile && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-slate-800 mb-6 font-sans">Image to PDF</h2>

                            {/* Stats Info Box */}
                            <div className="bg-[#E8ECEF] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Icon name="file-text" size={24} className="text-[#0081C9]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-800 truncate">Batch of {files.length} Images</p>
                                        <p className="text-muted-foreground mt-0.5">
                                            {isDone ? "Converted Successfully" : "Ready for conversion"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PDF Settings */}
                        <div className="space-y-4">
                            <h3 className="text-slate-800">PDF Options</h3>

                            {/* Custom Select Formats mapped to the style */}
                            <div className="space-y-4">
                                <div className="bg-[#E8ECEF] p-3 rounded-xl border border-transparent focus-within:border-[#0081C9] focus-within:bg-white transition-all space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">Page Size</label>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                                        disabled={isDone || isProcessing}
                                    >
                                        <option value="a4-p">A4 (Portrait)</option>
                                        <option value="a4-l">A4 (Landscape)</option>
                                        <option value="us-letter">US Letter</option>
                                    </select>
                                </div>

                                <div className="bg-[#E8ECEF] p-3 rounded-xl border border-transparent focus-within:border-[#0081C9] focus-within:bg-white transition-all space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">Margin</label>
                                    <select
                                        value={margin}
                                        onChange={(e) => setMargin(e.target.value as MarginOption)}
                                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                                        disabled={isDone || isProcessing}
                                    >
                                        <option value="none">None (0px)</option>
                                        <option value="small">Small (10px)</option>
                                        <option value="large">Large (24px)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Add More Files Dropzone */}
                        {files.length < UPLOAD_LIMITS.MAX_FILES && !isDone && (
                            <div
                                {...getRootProps()}
                                className={`mt-8 w-full rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-2 ${isDragActive
                                    ? "border-[#0081C9] bg-[#0081C9]/5"
                                    : "border-slate-300 bg-slate-50 hover:border-[#0081C9]/50 hover:bg-slate-100"
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="bg-white p-2 rounded-full shadow-sm text-[#0081C9]">
                                    <Icon name="plus" size={20} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">
                                    {isDragActive ? "Drop Images here" : "Add More Images"}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </ToolModal>
        </div>
    );
}
