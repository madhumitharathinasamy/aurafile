"use client";

import { useState } from "react";
import { PdfUploader } from "@/components/tools/PdfUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { PDFDocument } from "@cantoo/pdf-lib";
import { useFileUpload } from "@/hooks/useFileUpload";
import { saveAs } from "file-saver";

export default function UnlockPdfTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        clearAll,
        updateFileSettings
    } = useFileUpload([]);

    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpload = (uploadedFiles: File[]) => {
        addFiles(uploadedFiles, {
            unlockedBlob: null,
            isUnlocked: false,
            needsPassword: true
        });
        setPassword("");
    };

    const handleUnlock = async () => {
        if (!activeFile) return;
        if (!password) {
            toast.error("Please enter the password to unlock the file.");
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await activeFile.file.arrayBuffer();

            // pdf-lib accepts password in load options to decrypt
            const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password } as any);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });

            updateFileSettings(activeFile.id, {
                unlockedBlob: blob,
                isUnlocked: true,
                needsPassword: false
            });

            toast.success("PDF unlocked successfully!");

        } catch (error: any) {
            if (error.message?.includes("password")) {
                toast.error("Incorrect password. Please try again.");
            } else {
                toast.error("Failed to unlock PDF. The file might be corrupted.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadFile = () => {
        console.log("Triggering downloadFile...");
        console.log("activeFile:", activeFile);
        console.log("activeFile.settings:", activeFile?.settings);
        console.log("activeFile.settings.unlockedBlob:", activeFile?.settings?.unlockedBlob);

        if (!activeFile?.settings?.unlockedBlob) {
            toast.error("Download failed: No decrypted file found in memory.");
            console.error("Missing unlockedBlob in settings object!");
            return;
        }

        try {
            const extensionStr = ".pdf";
            const lowerName = activeFile.file.name.toLowerCase();
            const baseName = lowerName.endsWith(extensionStr)
                ? activeFile.file.name.slice(0, -4)
                : activeFile.file.name;

            const finalName = `unlocked_${baseName}.pdf`;
            console.log("Target filename:", finalName);

            // Generate an ephemeral URL directly from the raw blob
            const url = URL.createObjectURL(activeFile.settings.unlockedBlob);
            console.log("Generated Object URL:", url);

            // Native anchor trigger 
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = finalName;

            console.log("Appending anchor to DOM and clicking...");
            document.body.appendChild(a);

            // Execute click
            a.click();
            console.log("Click executed.");

            // Secondary ultimate fallback: Just open the blob if click failed silently
            // Note: Most modern browsers block window.open in this context without explicit user trust, but it's a diagnostic fallback
            try {
                window.open(url, "_blank");
                console.log("Secondary window fallback triggered.");
            } catch (e) {
                console.error("Window fallback failed:", e);
            }

            // Clean up immediately
            setTimeout(() => {
                console.log("Running cleanup timer...");
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log("Cleanup finished.");
            }, 300);

        } catch (error) {
            console.error("Download error catch block triggered:", error);
            toast.error("Failed to download unlocked PDF.");
        }
    };

    const isUnlocked = activeFile?.settings?.isUnlocked;

    const handlePrimaryAction = () => {
        if (isUnlocked) {
            downloadFile();
        } else {
            handleUnlock();
        }
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-xl border border-border bg-white shadow-xl p-4 md:p-8">
                        <PdfUploader onUpload={handleUpload} allowProtected={true} />

                        <div className="mt-8 rounded-xl bg-[#0081C9]/5 p-4 text-sm text-[#0081C9] border border-[#0081C9]/20 flex gap-3 mx-auto max-w-2xl">
                            <Icon name="shield-check" size={20} className="flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>Secure Processing:</strong> Your password is only used locally to decrypt the file. It is never transmitted.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                hidePreviewPane={true}
                title="Unlock PDF"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        {isUnlocked ? (
                            <>
                                <Icon name="download" size={18} />
                                Download Unlocked PDF
                            </>
                        ) : (
                            <>
                                <Icon name="unlock" size={18} />
                                Unlock Document
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
                                <h2 className="text-slate-800 font-sans">Security Check</h2>
                                {isUnlocked && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        <Icon name="check-circle" size={14} />
                                        Unlocked
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
                                            <span>Ready for decryption</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings / Results Data */}
                        {!isUnlocked ? (
                            <div className="space-y-4">
                                <h3 className="text-slate-800">Enter Document Password</h3>

                                <div className="bg-[#E8ECEF] p-4 rounded-xl border border-transparent focus-within:border-[#0081C9] focus-within:bg-white transition-all space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">Passcode</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password to unlock"
                                            disabled={isProcessing}
                                            className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUnlock();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground px-2">
                                    You must have the correct password to unlock this file. We cannot recover lost passwords.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-slate-800">Results</h3>

                                <div className="bg-[#0081C9]/5 border border-[#0081C9]/20 p-4 rounded-xl flex items-start gap-3">
                                    <Icon name="unlock" size={18} className="text-[#0081C9] mt-0.5" />
                                    <div>
                                        <p className="text-[#0081C9]">Successfully Unlocked</p>
                                        <p className="text-muted-foreground mt-1">
                                            Your file has been completely decrypted. You can now download it and use it without entering a password.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Badge inline */}
                        <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-medium pt-4">
                            <Icon name="shield-check" size={14} />
                            <span>100% Private - Decrypted entirely in your browser</span>
                        </div>
                    </div>
                )}
            </ToolModal>
        </div>
    );
}
