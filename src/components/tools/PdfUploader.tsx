"use client";

import { useDropzone } from "react-dropzone";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { UPLOAD_LIMITS } from "@/config/limits";

interface PdfUploaderProps {
    onUpload: (files: File[]) => void;
    maxFiles?: number;
    allowProtected?: boolean;
}

export function PdfUploader({ onUpload, maxFiles = UPLOAD_LIMITS.MAX_FILES, allowProtected = false }: PdfUploaderProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles?.length > 0) {
                let filesToProcess = acceptedFiles;
                if (acceptedFiles.length > maxFiles) {
                    toast.warning(`Only the first ${maxFiles} files were added. Limit reached.`);
                    filesToProcess = acceptedFiles.slice(0, maxFiles);
                }

                // Check for password protection
                const validFiles: File[] = [];
                for (const file of filesToProcess) {
                    try {
                        const arrayBuffer = await file.arrayBuffer();
                        const pdfjsLib = await import("pdfjs-dist");
                        if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
                        }

                        const loadingTask = pdfjsLib.getDocument(arrayBuffer);

                        try {
                            await new Promise((resolve, reject) => {
                                loadingTask.onPassword = (updatePassword: any, reason: number) => {
                                    // Immediate abort: destroy the worker to prevent an infinite hang
                                    // since we are never going to provide the password to pdfjs-dist.
                                    loadingTask.destroy().catch(() => { });

                                    if (allowProtected) {
                                        reject(new Error("AllowedProtected"));
                                    } else {
                                        reject(new Error("PasswordProtected"));
                                    }
                                };

                                loadingTask.promise.then(resolve).catch(reject);
                            });

                            // If it resolves cleanly, it is a valid, unprotected PDF
                            validFiles.push(file);
                        } catch (loadError: any) {
                            if (loadError.message === "AllowedProtected") {
                                // We expect this because the tool allows protected files
                                validFiles.push(file);
                            } else {
                                // Let the outer catch handle "PasswordProtected" or broken PDF errors
                                throw loadError;
                            }
                        }

                    } catch (error: any) {
                        if (error.message === "PasswordProtected") {
                            toast.error(`"${file.name}" is password protected and cannot be processed.`);
                        } else {
                            toast.error(`"${file.name}" appears to be an invalid or broken PDF.`);
                        }
                    }
                }

                if (validFiles.length > 0) {
                    onUpload(validFiles);
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

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div
                {...getRootProps()}
                className={`relative flex flex-col items-center justify-center gap-4 p-10 md:p-14 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragActive
                    ? "border-[#00B4D8] bg-[#00B4D8]/5 shadow-[inset_0_0_30px_rgba(0,180,216,0.05)] scale-[1.01]"
                    : "border-slate-300 hover:border-[#00B4D8] hover:bg-[#00B4D8]/10 bg-slate-50 shadow-inner"
                    }`}
            >
                <input {...getInputProps()} data-testid="dropzone-file-input" />
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-sm ${isDragActive ? 'bg-[#00B4D8] text-white animate-pulse' : 'bg-white text-[#00B4D8]'}`}>
                    <Icon name="file-text" size={28} />
                </div>
                <div className="text-center">
                    <p className="text-slate-600 font-bold text-lg md:text-xl tracking-tight">Drag & drop your PDF{maxFiles > 1 ? "s" : ""} here</p>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        or <span className="text-[#00B4D8] font-medium px-1 rounded hover:bg-[#00B4D8]/10 transition-colors">click to browse</span> files
                    </p>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">
                    Supports up to {maxFiles} PDF{maxFiles > 1 ? "s" : ""} • Max {UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB
                </p>

                {/* Trust Seals */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mt-6 pt-6 border-t border-slate-200/60 w-full max-w-sm">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Icon name="shield-check" size={16} className="text-emerald-500" />
                        100% Private
                    </div>
                    <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Icon name="cpu" size={16} className="text-[#00B4D8]" />
                        Powered by WebAssembly
                    </div>
                </div>
            </div>
        </div>
    );
}
