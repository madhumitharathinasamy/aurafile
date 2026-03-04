"use client";

import { useState, useEffect } from "react";
import { PdfUploader } from "@/components/tools/PdfUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { PDFDocument } from "@cantoo/pdf-lib";
import { useFileUpload } from "@/hooks/useFileUpload";
import { generatePdfPreview } from "@/lib/pdf-processing/pdf-preview";

export default function CompressPdfTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        clearAll,
        updateFileSettings,
        updatePreviewUrl
    } = useFileUpload([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [compressProgress, setCompressProgress] = useState({ current: 0, total: 0 });
    const [compressionLevel, setCompressionLevel] = useState<'extreme' | 'recommended' | 'less'>('recommended');
    const [viewMode, setViewMode] = useState<'before' | 'after'>('after');

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

    const handleUpload = (uploadedFiles: File[]) => {
        // Allow up to the UPLOAD_LIMITS.MAX_FILES (which is 20 by default in PdfUploader)

        // Initialize files with default settings
        addFiles(uploadedFiles, {
            compressedUrl: null,
            compressedSize: 0,
            compressionDone: false,
            savings: 0
        });
    };

    const handleCompress = async () => {
        // Compress all files that are not yet done
        const filesToCompress = files.filter(f => !f.settings?.compressionDone);
        if (filesToCompress.length === 0) return;

        const totalToCompress = filesToCompress.length;
        setCompressProgress({ current: 0, total: totalToCompress });
        setIsProcessing(true);

        try {
            // Process sequentially to avoid OOM errors on large multiple PDFs
            for (let i = 0; i < totalToCompress; i++) {
                const fileToProcess = filesToCompress[i];

                // Allow UI to update progress
                setCompressProgress({ current: i + 1, total: totalToCompress });
                await new Promise(resolve => setTimeout(resolve, 50));
                // Determine the compression level for this specific file, falling back to the global state
                const currentLevel = fileToProcess.settings?.compressionLevel || compressionLevel;

                const arrayBuffer = await fileToProcess.file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

                let finalPdfBytes: Uint8Array | null = null;

                // Attempt deep image compression via rasterization for Recommended / Extreme
                if (currentLevel === 'extreme' || currentLevel === 'recommended') {
                    try {
                        const pdfjsLib = await import("pdfjs-dist");
                        if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
                        }

                        const scale = currentLevel === 'extreme' ? 1.0 : 1.5; // ~72 DPI vs ~108 DPI
                        const quality = currentLevel === 'extreme' ? 0.6 : 0.8;

                        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
                        const pdf = await loadingTask.promise;
                        const numPages = pdf.numPages;

                        const rasterizedPdf = await PDFDocument.create();

                        for (let i = 1; i <= numPages; i++) {
                            const page = await pdf.getPage(i);
                            const viewport = page.getViewport({ scale });

                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");

                            if (context) {
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                await page.render({ canvasContext: context, viewport } as any).promise;

                                const imgDataUrl = canvas.toDataURL("image/jpeg", quality);

                                const res = await fetch(imgDataUrl);
                                const imgBytes = await res.arrayBuffer();
                                const pdfImage = await rasterizedPdf.embedJpg(imgBytes);

                                const originalWidth = viewport.width / scale;
                                const originalHeight = viewport.height / scale;

                                const newPage = rasterizedPdf.addPage([originalWidth, originalHeight]);
                                newPage.drawImage(pdfImage, {
                                    x: 0,
                                    y: 0,
                                    width: originalWidth,
                                    height: originalHeight,
                                });
                            }
                        }

                        const rasterizedBytes = await rasterizedPdf.save({ useObjectStreams: true });

                        // Only use it if it actually compressed the file
                        if (rasterizedBytes.byteLength < fileToProcess.size) {
                            finalPdfBytes = rasterizedBytes;
                        }
                    } catch (e) {
                        console.error("Rasterization failed, falling back to structural compression", e);
                    }
                }

                // Fallback to structural compression if rasterization was skipped or increased the size
                if (!finalPdfBytes) {
                    let outputPdf: PDFDocument;

                    if (currentLevel === 'less') {
                        // Just save the original with object streams (basic structural compression)
                        outputPdf = pdfDoc;
                        outputPdf.setTitle('');
                        outputPdf.setAuthor('');
                        outputPdf.setSubject('');
                        outputPdf.setKeywords([]);
                        outputPdf.setProducer('');
                        outputPdf.setCreator('');
                    } else {
                        // Recommended & Extreme structural fallback
                        outputPdf = await PDFDocument.create();
                        const pages = await outputPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                        pages.forEach((page) => outputPdf.addPage(page));

                        if (currentLevel === 'extreme') {
                            outputPdf.setCreator('AuraFile Optimizer');
                        }
                    }

                    finalPdfBytes = await outputPdf.save({ useObjectStreams: true });
                }

                let settingsUpdate = {
                    compressedUrl: null as string | null,
                    compressedSize: finalPdfBytes.byteLength,
                    compressionDone: true,
                    savings: 0,
                    compressionLevel: currentLevel // Save the level used
                };

                const blob = new Blob([finalPdfBytes as any], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                settingsUpdate.compressedUrl = url;

                if (finalPdfBytes.byteLength >= fileToProcess.size) {
                    toast.info(`${fileToProcess.file.name} is already optimized.`, {
                        description: "We couldn't reduce the file size further without losing quality."
                    });
                } else {
                    const savings = ((fileToProcess.size - finalPdfBytes.byteLength) / fileToProcess.size * 100).toFixed(1);
                    settingsUpdate.savings = Number(savings);
                    // Don't show toast for every successfully compressed file in a batch to avoid spam
                }

                updateFileSettings(fileToProcess.id, settingsUpdate);
            }

            if (filesToCompress.length > 1) {
                toast.success(`Successfully compressed ${filesToCompress.length} PDFs!`);
            } else {
                toast.success('PDF successfully compressed!');
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to compress PDFs. One or more files might be corrupted or password protected.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadFile = async () => {
        // Find how many files are done
        const completedFiles = files.filter(f => f.settings?.compressionDone && f.settings?.compressedUrl);

        if (completedFiles.length === 0) return;

        try {
            // Trigger download sequentially
            for (const file of completedFiles) {
                const response = await fetch(file.settings.compressedUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                const extensionStr = ".pdf";
                const baseName = file.file.name.endsWith(extensionStr)
                    ? file.file.name.slice(0, -4)
                    : file.file.name;

                link.download = `compressed_${baseName}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);

                // Slight delay to ensure browser registers multiple downloads gracefully
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download compressed PDFs safely.");
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Update individual file's compression level
    const isDone = files.length > 0 && files.every(f => f.settings?.compressionDone);

    const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
    const totalCompressedSize = files.reduce((acc, f) => {
        if (f.settings?.compressionDone) return acc + (f.settings?.compressedSize || f.size);
        return acc + f.size;
    }, 0);
    const totalSavings = totalOriginalSize > 0 && totalOriginalSize > totalCompressedSize
        ? Number(((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1))
        : 0;

    // Update individual file's compression level
    const updateLocalCompressionLevel = (level: 'extreme' | 'recommended' | 'less') => {
        if (activeFile) {
            updateFileSettings(activeFile.id, { compressionLevel: level });
        }
        // Also update the global fallback so next uploaded file uses it
        setCompressionLevel(level);
    };

    // The current level to show in the UI for the active file
    const currentActiveLevel = activeFile?.settings?.compressionLevel || compressionLevel;

    const handlePrimaryAction = () => {
        if (isDone) {
            downloadFile();
        } else {
            handleCompress();
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
                                <strong>Secure Processing:</strong> Your PDF is processed entirely in your web browser. It is never uploaded to any server.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                hidePreviewPane={false}
                title="Compress PDF"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        {isProcessing ? (
                            <>
                                {files.length > 1 ? `Compressing (${compressProgress.current}/${compressProgress.total})...` : 'Compressing PDF...'}
                            </>
                        ) : isDone ? (
                            <>
                                <Icon name="download" size={18} />
                                {files.length > 1 ? `Download All (${files.length})` : 'Download Compressed PDF'}
                            </>
                        ) : (
                            <>
                                <Icon name="minimize" size={18} />
                                {files.length > 1 ? `Compress ${files.length} PDFs` : 'Compress PDF'}
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
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-slate-800 font-sans">Optimization</h2>
                                {isDone && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        <Icon name="check-circle" size={14} />
                                        Complete
                                    </span>
                                )}
                            </div>

                            {/* File Info Block */}
                            <div className="bg-[#E8ECEF] rounded-xl p-4 flex flex-col gap-3 shadow-sm border border-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Icon name="file-text" size={24} className="text-[#0081C9]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-800 truncate" title={activeFile.file.name}>
                                            {activeFile.file.name}
                                        </p>
                                        <p className="text-muted-foreground mt-0.5 flex gap-2">
                                            <span>Original: {files.length > 1 ? formatSize(totalOriginalSize) : formatSize(activeFile.size)}</span>
                                            {files.length > 1 && <span className="opacity-50">({files.length} files)</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings / Results Data */}
                        {!isDone ? (
                            <div className="space-y-4">
                                <h3 className="text-slate-800">Compression Level</h3>

                                <div className="flex flex-col gap-3">
                                    {/* Extreme */}
                                    <button
                                        onClick={() => updateLocalCompressionLevel('extreme')}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-start ${currentActiveLevel === 'extreme' ? 'bg-[#0081C9]/5 border-[#0081C9] ring-1 ring-[#0081C9]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className={`text-sm font-bold ${currentActiveLevel === 'extreme' ? 'text-[#0081C9]' : 'text-slate-800'}`}>Extreme</span>
                                            {currentActiveLevel === 'extreme' && <Icon name="check-circle" size={16} className="text-[#0081C9]" />}
                                        </div>
                                        <p className="text-[12px] text-muted-foreground text-left">Smallest file size, minor quality loss.</p>
                                    </button>

                                    {/* Recommended */}
                                    <button
                                        onClick={() => updateLocalCompressionLevel('recommended')}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-start ${currentActiveLevel === 'recommended' ? 'bg-[#0081C9]/5 border-[#0081C9] ring-1 ring-[#0081C9]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className={`text-sm font-bold ${currentActiveLevel === 'recommended' ? 'text-[#0081C9]' : 'text-slate-800'}`}>Recommended</span>
                                            {currentActiveLevel === 'recommended' && <Icon name="check-circle" size={16} className="text-[#0081C9]" />}
                                        </div>
                                        <p className="text-[12px] text-muted-foreground text-left">Good compression, perfect quality.</p>
                                    </button>

                                    {/* Less */}
                                    <button
                                        onClick={() => updateLocalCompressionLevel('less')}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-start ${currentActiveLevel === 'less' ? 'bg-[#0081C9]/5 border-[#0081C9] ring-1 ring-[#0081C9]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className={`text-sm font-bold ${currentActiveLevel === 'less' ? 'text-[#0081C9]' : 'text-slate-800'}`}>Less</span>
                                            {currentActiveLevel === 'less' && <Icon name="check-circle" size={16} className="text-[#0081C9]" />}
                                        </div>
                                        <p className="text-[12px] text-muted-foreground text-left">High quality, bigger file size.</p>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex bg-slate-100 p-1 rounded-xl w-full">
                                    <button
                                        onClick={() => setViewMode('before')}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === 'before' ? 'bg-white shadow border border-slate-200 text-slate-800' : 'text-muted-foreground hover:text-slate-700'}`}
                                    >
                                        Before
                                    </button>
                                    <button
                                        onClick={() => setViewMode('after')}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === 'after' ? 'bg-[#0081C9] shadow border border-[#0081C9]/80 text-white' : 'text-muted-foreground hover:text-slate-700'}`}
                                    >
                                        After
                                    </button>
                                </div>

                                <div className="flex flex-col items-center justify-center p-6 bg-[#0081C9]/5 rounded-xl border border-[#0081C9]/20 relative overflow-hidden">
                                    <Icon name="zap" size={100} className="absolute -right-4 -bottom-4 text-[#0081C9]/5 rotate-12" />
                                    <div className="text-4xl md:text-5xl font-black text-[#0081C9] mb-1 drop-shadow-sm tracking-tighter w-full text-center truncate">
                                        {files.length > 1
                                            ? `${totalSavings > 0 ? `-${totalSavings}%` : '0%'}`
                                            : `${activeFile.settings?.savings > 0 ? `-${activeFile.settings.savings}%` : '0%'}`
                                        }
                                    </div>
                                    <p className="text-[#0081C9]/70 uppercase tracking-widest mt-1">
                                        {files.length > 1 ? 'Total Reduction' : 'Reduction'}
                                    </p>

                                    <div className="mt-6 text-sm font-bold text-slate-700 flex flex-col md:flex-row items-center gap-2 bg-white p-2 md:px-5 md:py-2.5 rounded-2xl md:rounded-full shadow-sm border border-slate-200 z-10 w-full min-w-0">
                                        <span className="truncate">
                                            {viewMode === 'before'
                                                ? (files.length > 1 ? formatSize(totalOriginalSize) : formatSize(activeFile.size))
                                                : (files.length > 1 ? formatSize(totalCompressedSize) : formatSize(activeFile.settings?.compressedSize || 0))
                                            }
                                        </span>
                                        <div className="md:hidden border-t w-full opacity-50 my-1"></div>
                                        <span className="text-slate-400 text-[10px] md:text-xs font-semibold md:px-2 md:border-l border-slate-200 text-center truncate w-full md:w-auto">
                                            {viewMode === 'before' ? (files.length > 1 ? `Original (${files.length} files)` : 'Original') : (files.length > 1 ? `Compressed (${files.length} files)` : 'Compressed File')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Badge inline */}
                        <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-medium">
                            <Icon name="shield-check" size={14} />
                            <span>100% Private - Processed entirely in browser</span>
                        </div>
                    </div>
                )}
            </ToolModal>
        </div>
    );
}
