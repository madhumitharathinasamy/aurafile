"use client";

import { useDropzone } from "react-dropzone";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { UPLOAD_LIMITS } from "@/config/limits";

interface ImageUploaderProps {
    onUpload: (files: File[]) => void;
    multiple?: boolean;
    title?: string;
    description?: string;
    subDescription?: string;
    maxSize?: number; // in bytes
    maxFiles?: number;
    accept?: Record<string, string[]>;
}

export function ImageUploader({
    onUpload,
    multiple = true,
    title = "Drag & drop images here, or click to select",
    description = "Supports JPG, PNG, WEBP, GIF, TIFF, AVIF, BMP",
    subDescription = `(Max ${UPLOAD_LIMITS.MAX_FILES} files, ${UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB)`,
    maxSize = UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES,
    maxFiles = UPLOAD_LIMITS.MAX_FILES,
    accept = {
        "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".tiff", ".avif", ".bmp"],
    }
}: ImageUploaderProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles?.length > 0) {
                const limit = multiple ? maxFiles : 1;
                const filesToProcess = acceptedFiles.slice(0, limit);

                if (acceptedFiles.length > limit) {
                    toast.warning(`Only the first ${limit} files were added. Limit reached.`);
                }

                // Pre-validate for broken images
                const validFiles: File[] = [];
                for (const file of filesToProcess) {
                    // Skip native preview validation for formats browsers can't natively render in <img> tags
                    const fileName = file.name.toLowerCase();
                    const isUnsupportedPreviewFormat = fileName.endsWith('.tiff') || fileName.endsWith('.tif') || fileName.endsWith('.avif');

                    if (isUnsupportedPreviewFormat) {
                        validFiles.push(file);
                        continue;
                    }

                    try {
                        const url = URL.createObjectURL(file);
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = () => resolve(true);
                            img.onerror = () => reject();
                            img.src = url;
                        });
                        URL.revokeObjectURL(url);
                        validFiles.push(file);
                    } catch (e) {
                        toast.error(`"${file.name}" appears to be broken or unsupported.`);
                    }
                }

                if (validFiles.length > 0) {
                    onUpload(validFiles);
                }
            }
        },
        accept,
        maxSize,
        onDropRejected: (rejectedFiles) => {
            const error = rejectedFiles[0]?.errors[0];
            if (error?.code === "file-too-large") {
                toast.error(`File is too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
            } else if (error?.code === "file-invalid-type") {
                toast.error("Invalid file type. Please upload a supported image format.");
            } else if (error?.code === "too-many-files") {
                toast.error(multiple ? `You can only upload up to ${maxFiles} files at once.` : "You can only upload 1 file.");
            } else {
                toast.error(`Combined Error: ${error?.message || "File rejected"}`);
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
                    <Icon name="upload" size={28} />
                </div>
                <div className="text-center">
                    <p className="text-slate-600 font-bold text-lg md:text-xl tracking-tight">Drag & drop your images here</p>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        or <span className="text-[#00B4D8] font-medium px-1 rounded hover:bg-[#00B4D8]/10 transition-colors">click to browse</span> files
                    </p>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">
                    Supports JPG, PNG, WEBP, GIF, TIFF, BMP • Max {Math.round(maxSize / (1024 * 1024))}MB • Up to {maxFiles} files
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
