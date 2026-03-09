"use client";

import { useState, useEffect } from "react";
import { PdfUploader } from "@/components/tools/PdfUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { PDFDocument } from "@cantoo/pdf-lib";
import { useFileUpload } from "@/hooks/useFileUpload";
import { generatePdfPreview } from "@/lib/pdf-processing/pdf-preview";
import { PdfSecuritySeo } from "@/components/seo/SeoContentBlocks";

export default function ProtectPdfTool() {
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

    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

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
        addFiles(uploadedFiles, {
            protectedUrl: null,
            protectedBlob: null as Blob | null,
            isProtected: false
        });
        setPassword("");
    };

    const handleProtect = async () => {
        if (!activeFile) return;
        if (!password) {
            toast.error("Please provide a strong password.");
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await activeFile.file.arrayBuffer();

            const worker = new Worker(new URL('../../workers/pdf.worker.ts', import.meta.url));

            worker.onmessage = (e) => {
                if (e.data.type === 'SUCCESS') {
                    const blob = new Blob([e.data.payload.buffer], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);

                    updateFileSettings(activeFile.id, {
                        protectedUrl: url,
                        protectedBlob: blob,
                        isProtected: true
                    });

                    toast.success("PDF protected successfully!");
                } else if (e.data.type === 'ERROR') {
                    toast.error("Failed to protect PDF. The file might already be encrypted.");
                }

                setIsProcessing(false);
                worker.terminate();
            };

            worker.onerror = (error) => {
                toast.error("Failed to initialize security worker.");
                setIsProcessing(false);
                worker.terminate();
            };

            worker.postMessage({
                type: 'PROTECT',
                payload: { buffer: arrayBuffer, password }
            });

        } catch (error) {
            toast.error("Failed to process PDF.");
            setIsProcessing(false);
        }
    };

    const downloadFile = async () => {
        if (!activeFile?.settings?.protectedBlob) return;

        try {
            const blobUrl = URL.createObjectURL(activeFile.settings.protectedBlob);

            const link = document.createElement("a");
            link.style.display = "none";
            link.href = blobUrl;

            const extensionStr = ".pdf";
            const baseName = activeFile.file.name.endsWith(extensionStr)
                ? activeFile.file.name.slice(0, -4)
                : activeFile.file.name;

            link.download = `protected_${baseName}.pdf`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);
        } catch (error) {
            toast.error("Failed to download protected PDF safely.");
        }
    };

    const isProtected = activeFile?.settings?.isProtected;

    const handlePrimaryAction = () => {
        if (isProtected) {
            downloadFile();
        } else {
            handleProtect();
        }
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-xl border border-border bg-white shadow-xl p-4 md:p-8">
                        <PdfUploader onUpload={handleUpload} />

                        <div className="mt-8 rounded-xl bg-[#0081C9]/5 p-4 text-sm text-[#0081C9] border border-[#0081C9]/20 flex gap-3 mx-auto max-w-2xl">
                            <Icon name="shield-check" size={20} className="flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>Secure Processing:</strong> Your PDF is encrypted entirely in your web browser. The password never leaves your device.
                            </div>
                        </div>
                    </div>

                    <PdfSecuritySeo />
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                hidePreviewPane={false}
                title="Protect PDF"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        {isProtected ? (
                            <>
                                <Icon name="download" size={18} />
                                Download Encrypted PDF
                            </>
                        ) : (
                            <>
                                <Icon name="lock" size={18} />
                                Encrypt Document
                            </>
                        )}
                    </span>
                }
                isProcessing={isProcessing}
                customPreview={
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#e3e7e9] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] relative overflow-hidden">
                        {activeFile?.previewUrl && (
                            <img
                                src={activeFile.previewUrl}
                                alt="PDF preview"
                                className={`max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-all duration-700 ${isProtected ? 'blur-md opacity-40 scale-95' : 'blur-0 opacity-100 scale-100'}`}
                            />
                        )}

                        {/* Locked State Overlay */}
                        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 z-10 ${isProtected ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-slate-200/50 flex flex-col items-center gap-4">
                                <div className="bg-red-50 text-red-500 w-24 h-24 rounded-2xl flex items-center justify-center animate-bounce-slight">
                                    <Icon name="lock" size={48} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-slate-800 font-sans tracking-tight">Document Secured</h3>
                                    <p className="text-muted-foreground mt-1 max-w-[200px]">Password protection has been successfully applied.</p>
                                </div>
                            </div>
                        </div>

                        {/* Unlocked State Badge */}
                        <div className={`absolute top-6 right-6 transition-all duration-500 z-10 ${!isProtected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-green-200 flex items-center gap-2">
                                <Icon name="unlock" size={16} /> Unlocked
                            </div>
                        </div>
                    </div>
                }
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                {activeFile && (
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-slate-800 font-sans">Security Lock</h2>
                                {isProtected && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        <Icon name="check-circle" size={14} />
                                        Locked
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
                                            <span>Ready for encryption</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings / Results Data */}
                        {!isProtected ? (
                            <div className="space-y-4">
                                <h3 className="text-slate-800">Set Password</h3>

                                <div className="bg-[#E8ECEF] p-4 rounded-xl border border-transparent focus-within:border-[#0081C9] focus-within:bg-white transition-all space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">Document Password</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter strong password"
                                            disabled={isProcessing}
                                            className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground px-2">
                                    Make sure to remember this password. If lost, the document cannot be recovered.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-slate-800">Results</h3>

                                <div className="bg-[#0081C9]/5 border border-[#0081C9]/20 p-4 rounded-xl flex items-start gap-3">
                                    <Icon name="lock" size={18} className="text-[#0081C9] mt-0.5" />
                                    <div>
                                        <p className="text-[#0081C9]">Successfully Encrypted</p>
                                        <p className="text-muted-foreground mt-1">
                                            Your file is now protected with 128-bit RC4 encryption. It restricts modifying, copying, and annotating without the password.
                                        </p>

                                        <div className="mt-3 inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#0081C9]/20">
                                            <span className="text-xs text-muted-foreground font-medium">Password:</span>
                                            <span className="text-xs font-mono font-bold text-slate-800">{password}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Badge inline */}
                        <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-medium pt-4">
                            <Icon name="shield-check" size={14} />
                            <span>100% Private - Encrypted entirely in your browser</span>
                        </div>
                    </div>
                )}
            </ToolModal>
        </div>
    );
}
