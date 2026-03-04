"use client";

import { useDropzone } from "react-dropzone";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { UPLOAD_LIMITS } from "@/config/limits";

interface PdfUploaderProps {
    onUpload: (files: File[]) => void;
    maxFiles?: number;
}

export function PdfUploader({ onUpload, maxFiles = UPLOAD_LIMITS.MAX_FILES }: PdfUploaderProps) {
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
                        loadingTask.onPassword = (updatePassword: any, reason: number) => {
                            // Reason 1 = NEED_PASSWORD
                            if (reason === 1) {
                                throw new Error("PasswordProtected");
                            }
                        };

                        await loadingTask.promise;
                        validFiles.push(file);
                    } catch (error: any) {
                        if (error.message === "PasswordProtected" || error.name === "PasswordException") {
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
        <div
            {...getRootProps()}
            className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ease-in-out ${isDragActive
                ? "border-primary bg-primary/5"
                : "border-border bg-surface hover:border-primary/50 hover:bg-background"
                }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
                <div className="mb-2 rounded-full bg-primary/10 p-4 shadow-sm dark:bg-primary/20">
                    <Icon name="file-text" size={48} className="text-primary" />
                </div>
                <p className="text-foreground">
                    {isDragActive
                        ? "Drop the PDF here..."
                        : "Drag & drop PDF files here, or click to select"}
                </p>
                <p className="text-muted-foreground">Supports up to {maxFiles} PDFs (Max {UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB)</p>
            </div>
        </div>
    );
}
