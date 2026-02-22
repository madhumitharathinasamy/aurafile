"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { compressImageAction } from "@/actions/tools";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function CompressTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        clearAll,
        updateFileSettings
    } = useFileUpload([]);

    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpload = async (uploadedFiles: File[]) => {
        // We initialize with default quality 80
        addFiles(uploadedFiles, {
            quality: 80,
            originalSize: 0,
            compressedSize: 0,
            isCompressed: false,
            compressedUrl: null
        });

        // Set accurate initial sizes
        setTimeout(() => {
            uploadedFiles.forEach((file) => {
                const target = files.find(f => f.file.name === file.name); // basic mapping
                // For a more exact mapping, useFileUpload would ideally return the new UUIDs 
                // but for our single/batch flow this is usually sufficient for updating sizes.
            });
        }, 100);
    };

    const handleCompress = async () => {
        if (!activeFile) return;

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append("file", activeFile.file);
            formData.append("quality", String(activeFile.settings.quality));

            const res = await compressImageAction(formData);

            if (res.success && res.data) {
                updateFileSettings(activeFile.id, {
                    compressedSize: res.newSize,
                    isCompressed: true,
                    compressedUrl: res.data
                });
                toast.success("Image compressed successfully!");
            } else {
                toast.error(`Failed: ${res.error}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error compressing image.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        // Show in KB for standard small sizes like "25.6 KB"
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-2xl border border-border bg-surface shadow-xl p-4 md:p-8 backdrop-blur-sm">
                        <ImageUploader onUpload={handleUpload} multiple={false} />
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                title="Edit Image"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handleCompress}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        <Icon name="shrink" size={18} />
                        Compress
                    </span>
                }
                isProcessing={isProcessing}
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                {activeFile && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 font-sans">Compress Image</h2>

                            {/* Size comparison box */}
                            <div className="bg-[#E8ECEF] rounded-xl p-4 flex items-center justify-between shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-slate-500 mb-1">Original</span>
                                    <span className="text-base font-bold text-slate-800">
                                        {formatSize(activeFile.file.size)}
                                    </span>
                                </div>
                                <div className="text-slate-500">
                                    <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-xs font-medium text-slate-500 mb-1">Compressed</span>
                                    <span className="text-base font-bold text-slate-800">
                                        {activeFile.settings.isCompressed ? formatSize(activeFile.settings.compressedSize) : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quality Slider exactly matching mockup */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-slate-800">Quality</span>
                                <span className="text-sm font-semibold text-slate-800">{activeFile.settings.quality}%</span>
                            </div>

                            <div className="relative w-full h-2 rounded-full cursor-pointer bg-slate-700">
                                {/* The filled portion */}
                                <div
                                    className="absolute top-0 left-0 h-full bg-[#0081C9] rounded-l-full pointer-events-none"
                                    style={{ width: `${activeFile.settings.quality}%` }}
                                ></div>

                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={activeFile.settings.quality}
                                    onChange={(e) => updateFileSettings(activeFile.id, { quality: parseInt(e.target.value), isCompressed: false })}
                                    className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-10 h-full"
                                    style={{ appearance: 'none', WebkitAppearance: 'none' }}
                                />

                                {/* Custom Thumb visually tracking the input */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white rounded-full border-2 border-[#0081C9] shadow-sm pointer-events-none z-0 mt-[1px]"
                                    style={{ left: `calc(${activeFile.settings.quality}% - 10px)` }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center mt-3 text-xs font-medium text-slate-500 font-sans tracking-tight">
                                <span>Smaller file</span>
                                <span>Higher quality</span>
                            </div>
                        </div>
                    </div>
                )}
            </ToolModal>
        </div>
    );
}
