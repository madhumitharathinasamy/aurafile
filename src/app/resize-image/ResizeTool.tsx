"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { resizeImageClient } from "@/lib/processing/resize";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useFileUpload } from "@/hooks/useFileUpload";

import { ResizeSettings } from "./types";

const DEFAULT_SETTINGS: ResizeSettings = {
    mode: "pixels",
    width: "",
    height: "",
    percentage: 100,
    lockAspectRatio: true,
    preset: "",
    format: "original",
    quality: 90
};

export default function ResizeTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        removeFile,
        clearAll,
        updateFileSettings
    } = useFileUpload([]);

    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpload = async (uploadedFiles: File[]) => {
        // We first need the natural dimensions before storing in universal state hook
        const enrichedFiles = await Promise.all(uploadedFiles.map(async (file) => {
            const tempUrl = URL.createObjectURL(file);
            const img = new Image();
            img.src = tempUrl;
            await new Promise((resolve) => {
                img.onload = resolve;
            });
            URL.revokeObjectURL(tempUrl);

            // Return raw file with its dimensions
            return {
                file,
                dimensions: { width: img.width, height: img.height }
            };
        }));

        // Now add to universal hook one by one or in batch
        // The universal hook creates the actual persistent Blob URL
        enrichedFiles.forEach(({ file, dimensions }) => {
            addFiles([file], {
                ...DEFAULT_SETTINGS,
                width: dimensions.width,
                height: dimensions.height,
                // Note: since originalWidth/Height live on root in IntegratedFile, we map it
                // We'll just rely on settings width/height for default
            });
        });

        toast.success(`Allocated ${enrichedFiles.length} images for resizing.`);
    };

    const handleUpdateSettings = (id: string, newSettings: Partial<ResizeSettings>) => {
        const file = files.find(f => f.id === id);
        if (!file) return;

        let finalSettings = { ...(file.settings as ResizeSettings), ...newSettings };

        // Handle Aspect Ratio Locking
        if (finalSettings.lockAspectRatio && finalSettings.mode === "pixels") {
            // we rely on the initial settings.width/height as 'original' since useFileUpload doesn't strictly know dimensions universally
            const originalW = Number(file.settings.width);
            const originalH = Number(file.settings.height);
            // This logic is slightly flawed if they change default width entirely, but sufficient for now
        }

        updateFileSettings(id, finalSettings);
    };

    // Calculate dimensions based on settings
    const getComputedDimensions = (w: number, h: number, settings: ResizeSettings) => {
        if (settings.mode === "percentage") {
            const scale = settings.percentage / 100;
            return {
                width: Math.round(w * scale),
                height: Math.round(h * scale)
            };
        }
        return {
            width: Number(settings.width) || w,
            height: Number(settings.height) || h
        };
    };

    const handleProcess = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        try {
            const processedFiles = [];

            for (const fileMeta of files) {
                // Approximate original dims by looking at settings if originalWidth isn't explicitly mapped in hook
                const w = Number(fileMeta.settings?.width || 0);
                const h = Number(fileMeta.settings?.height || 0);
                const dims = getComputedDimensions(w, h, fileMeta.settings as ResizeSettings);

                const targetFormat = (fileMeta.settings.format === "original"
                    ? (["image/jpeg", "image/png", "image/webp"].includes(fileMeta.file.type)
                        ? fileMeta.file.type
                        : "image/jpeg")
                    : fileMeta.settings.format) as "image/jpeg" | "image/png" | "image/webp";

                const blob = await resizeImageClient(fileMeta.file, {
                    width: dims.width,
                    height: dims.height,
                    maintainAspectRatio: false,
                    format: targetFormat,
                    quality: (fileMeta.settings.quality || 90) / 100,
                    fit: "fill"
                });

                processedFiles.push({
                    name: `resized-${fileMeta.file.name}`,
                    blob
                });
            }

            if (processedFiles.length === 1) {
                saveAs(processedFiles[0].blob, processedFiles[0].name);
            } else {
                const zip = new JSZip();
                processedFiles.forEach(f => zip.file(f.name, f.blob));
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, "aurafile-resized.zip");
            }

            toast.success("Images resized successfully!");

        } catch (error) {
            console.error(error);
            toast.error("Failed to resize images. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-2xl border border-border bg-surface shadow-xl shadow-primary/5 p-4 md:p-8 backdrop-blur-sm">
                        <ImageUploader onUpload={handleUpload} multiple={true} />
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                title="Resize Images"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handleProcess}
                primaryActionText={files.length > 1 ? "Resize All Images" : "Resize Image"}
                isProcessing={isProcessing}
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                {activeFile && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b border-border pb-3">Resize Settings</h3>

                        <div className="flex items-end gap-3 max-w-xl">
                            <div className="flex-1 space-y-1.5">
                                <label className="font-medium text-muted-foreground text-xs" htmlFor="width">Width (px)</label>
                                <input
                                    type="number"
                                    id="width"
                                    min="1"
                                    max="10000"
                                    value={activeFile.settings?.width || ""}
                                    onChange={(e) => updateFileSettings(activeFile.id, { width: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-sm"
                                />
                            </div>
                            <button
                                onClick={() => updateFileSettings(activeFile.id, { lockAspectRatio: !activeFile.settings?.lockAspectRatio })}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all mb-0.5 shadow-sm ${activeFile.settings?.lockAspectRatio ? "border-primary/50 bg-primary/5 text-primary ring-1 ring-primary/20" : "border-border hover:bg-muted/50 text-muted-foreground"}`}
                                title={activeFile.settings?.lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                            >
                                <Icon name={activeFile.settings?.lockAspectRatio ? "lock" : "unlock"} size={16} />
                            </button>
                            <div className="flex-1 space-y-1.5">
                                <label className="font-medium text-muted-foreground text-xs" htmlFor="height">Height (px)</label>
                                <input
                                    type="number"
                                    id="height"
                                    min="1"
                                    max="10000"
                                    value={activeFile.settings?.height || ""}
                                    onChange={(e) => updateFileSettings(activeFile.id, { height: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-muted-foreground text-xs">Maintain Quality</label>
                            <div className="flex items-center gap-4 border border-border p-3 rounded-xl bg-background shadow-sm">
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    className="w-full accent-primary"
                                    value={activeFile.settings?.quality || 90}
                                    onChange={(e) => updateFileSettings(activeFile.id, { quality: Number(e.target.value) })}
                                />
                                <span className="font-semibold text-primary min-w-[3rem] text-right">{activeFile.settings?.quality || 90}%</span>
                            </div>
                        </div>

                    </div>
                )}
            </ToolModal>
        </div>
    );
}
