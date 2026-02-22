"use client";

import { useState } from "react";
import { PdfUploader } from "@/components/tools/PdfUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { analyzePdf } from "@/lib/pdf-processing/pdf-analyzer";
import { convertPdfToDocx } from "@/lib/pdf-processing/pdf-to-docx";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function PdfToWordTool() {
    // 1. Universal State Engine
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        clearAll,
        updateFileSettings
    } = useFileUpload([]);

    // 2. Local Processing State
    const [isConverting, setIsConverting] = useState(false);
    const [useOcr, setUseOcr] = useState(false);
    const [outputFormat, setOutputFormat] = useState<'docx' | 'txt'>('docx');

    const handleUpload = async (uploadedFiles: File[]) => {
        // Enforce maximum 5 files batch limit for PDF conversion
        if (files.length + uploadedFiles.length > 5) {
            toast.error("You can only convert up to 5 PDFs at a time.");
            return;
        }

        // Add to universal store first using default structure
        addFiles(uploadedFiles, {
            status: 'analyzing',
            progress: 0,
            pageCount: 0,
            isScanned: false,
            resultUrl: null,
            error: null
        });

        const latestBatch = [...files, ...uploadedFiles.map(f => ({ id: "tmp", file: f }))];
        // Note: the hook UUID mapped files asynchronously, so we find them by matching File ref or wait a tick.
        // For simplicity, we trigger analysis iteratively on the newly pushed raw files
        for (const rawFile of uploadedFiles) {
            try {
                const analysis = await analyzePdf(rawFile);

                // We use updateAllFileSettings globally, but limit it to matching file names for safety
                // In production we'd want to return UUIDs from `addFiles` directly.

                if (analysis.isScanned) {
                    setUseOcr(true);
                    toast("Scanned PDF detected. OCR enabled automatically.");
                }

                // Temporary hack: we just update all states for now
                files.forEach(f => {
                    if (f.file.name === rawFile.name) {
                        updateFileSettings(f.id, {
                            status: 'idle',
                            pageCount: analysis.pageCount,
                            isScanned: analysis.isScanned
                        });
                    }
                });

            } catch (error) {
                console.error("Analysis Failed", error);
            }
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) return;
        setIsConverting(true);

        const filesToProcess = files.filter(f => f.settings?.status === 'idle' || f.settings?.status === 'complete' || !f.settings?.status);

        for (const file of filesToProcess) {
            updateFileSettings(file.id, { status: 'converting', progress: 0 });

            try {
                const shouldOcr = useOcr || (file.settings?.isScanned ?? false);

                const blob = await convertPdfToDocx(file.file, {
                    useOcr: shouldOcr,
                    onProgress: (p) => updateFileSettings(file.id, { progress: p })
                });

                const url = URL.createObjectURL(blob);

                updateFileSettings(file.id, {
                    status: 'complete',
                    progress: 100,
                    resultUrl: url
                });

                toast.success(`Converted ${file.file.name}`);

            } catch (err: any) {
                console.error(err);
                updateFileSettings(file.id, { status: 'error', error: err.message || "Conversion failed" });
                toast.error(`Failed to convert ${file.file.name}`);
            }
        }

        setIsConverting(false);
    };

    // Helper for rendering status text safely
    const getStatusText = (settings: any) => {
        switch (settings?.status) {
            case 'analyzing': return 'Analyzing...';
            case 'converting': return `Converting... ${settings.progress || 0}%`;
            case 'complete': return 'Converted';
            case 'error': return 'Error';
            default: return 'Ready';
        }
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="bg-card rounded-2xl shadow-xl shadow-primary/5 border border-border/50 p-2 md:p-4">
                        <PdfUploader onUpload={handleUpload} maxFiles={5} />
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                title="Convert PDF to Word"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handleConvert}
                primaryActionText={files.length > 1 ? "Convert All PDFs" : "Convert to Word"}
                isProcessing={isConverting}
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                {activeFile && (
                    <div className="space-y-6">

                        {/* Active File Status Block */}
                        <div className="p-4 bg-muted/30 rounded-xl border border-border/50 space-y-3">
                            <div className="flex items-center gap-3">
                                <Icon name="file-text" size={24} className="text-primary" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate text-sm">{activeFile.file.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {(activeFile.file.size / 1024 / 1024).toFixed(2)} MB
                                        {activeFile.settings?.pageCount > 0 && ` • ${activeFile.settings.pageCount} Pages`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium pt-2 border-t border-border/50">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={
                                    activeFile.settings?.status === 'complete' ? 'text-green-600' :
                                        activeFile.settings?.status === 'error' ? 'text-red-600' :
                                            activeFile.settings?.status === 'converting' ? 'text-yellow-600 animate-pulse' :
                                                'text-primary'
                                }>
                                    {getStatusText(activeFile.settings)}
                                </span>
                            </div>

                            {activeFile.settings?.status === 'complete' && activeFile.settings?.resultUrl && (
                                <a href={activeFile.settings.resultUrl} download={`${activeFile.file.name.replace('.pdf', '')}.docx`}>
                                    <button className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm">
                                        <Icon name="download" size={16} /> Download DOCX
                                    </button>
                                </a>
                            )}
                        </div>

                        {/* Global Settings */}
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 pt-2">
                                <Icon name="settings" size={18} className="text-primary" />
                                Conversion Settings
                            </h3>

                            <div className="space-y-6">
                                {/* OCR Toggle */}
                                <div className="flex items-start justify-between gap-4 p-3 bg-card border border-border rounded-xl shadow-sm">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium text-foreground">OCR Mode</label>
                                        <p className="text-[11px] text-muted-foreground">Force text recognition for scanned PDFs</p>
                                    </div>
                                    <button
                                        onClick={() => setUseOcr(!useOcr)}
                                        type="button"
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useOcr ? 'bg-primary' : 'bg-input'}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${useOcr ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>

                                {/* Output Format */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground block uppercase tracking-wider">Output Format</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setOutputFormat('docx')}
                                            className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${outputFormat === 'docx'
                                                ? "bg-primary/10 text-primary border-primary shadow-sm"
                                                : "bg-surface border-border hover:border-primary/50"
                                                }`}
                                        >
                                            DOCX (Word)
                                        </button>
                                        <button
                                            onClick={() => setOutputFormat('txt')}
                                            disabled
                                            className="px-3 py-2.5 rounded-lg text-sm font-medium border border-border bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-70"
                                        >
                                            TXT (Soon)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </ToolModal>
        </div>
    );
}
