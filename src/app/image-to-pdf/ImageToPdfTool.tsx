"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { useFileUpload } from "@/hooks/useFileUpload";

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

    const handleUpload = async (uploadedFiles: File[]) => {
        // Simple direct mapping
        addFiles(uploadedFiles, {
            // Optional default settings if required later
        });
    };

    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-2xl border border-border bg-surface shadow-xl p-4 md:p-8 backdrop-blur-sm">
                        <ImageUploader onUpload={handleUpload} multiple={true} />
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                title="Image to PDF"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handleProcess}
                primaryActionText="Generate PDF"
                isProcessing={isProcessing}
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                {activeFile && (
                    <div className="space-y-6">
                        <div className="bg-card w-full rounded-xl border border-border p-6 shadow-sm overflow-hidden flex flex-col items-center justify-center">
                            <Icon name="file-text" size={48} className="text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium">PDF Settings</h3>
                            <p className="text-muted-foreground mb-6 text-sm text-center mt-2">
                                You have uploaded {files.length} images. Adjust margins and page size below.
                            </p>
                        </div>

                        {/* Placeholder controls matching the mockup aesthetic */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Size</label>
                                <select className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none">
                                    <option>A4 (Portrait)</option>
                                    <option>A4 (Landscape)</option>
                                    <option>US Letter</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Margin</label>
                                <select className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none">
                                    <option>None</option>
                                    <option>Small</option>
                                    <option>Large</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </ToolModal>
        </div>
    );
}
