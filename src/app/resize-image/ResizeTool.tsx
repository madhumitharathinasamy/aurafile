"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { resizeImageClient } from "@/lib/processing/resize";
import { useFileUpload } from "@/hooks/useFileUpload";


import { ToolSettingsRenderer, SettingGroup, SettingRow, ToggleRow, SelectRow } from "@/components/tools/ToolSettingsRenderer";
import { ResizeSettings } from "./types";

const DEFAULT_SETTINGS: ResizeSettings = {
    mode: "pixels",
    width: "",
    height: "",
    percentage: 100,
    lockAspectRatio: true,
    preset: "",
    format: "original",
    quality: 90,
    resampling: "lanczos3",
    fillBackground: "#FFFFFF",
    anchor: "center",
    preserveMetadata: true
};

const SOCIAL_PRESETS = [
    { id: "ig-post", label: "IG Post (1080x1080)", width: 1080, height: 1080 },
    { id: "ig-story", label: "IG Story (1080x1920)", width: 1080, height: 1920 },
    { id: "fb-cover", label: "FB Cover (820x312)", width: 820, height: 312 },
    { id: "tw-header", label: "Twitter Header (1500x500)", width: 1500, height: 500 },
    { id: "yt-thumb", label: "YouTube Thumb (1280x720)", width: 1280, height: 720 },
    { id: "li-banner", label: "LinkedIn Banner (1584x396)", width: 1584, height: 396 }
];

export default function ResizeTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        removeFile,
        clearAll,
        updateFileSettings,
        updateAllFileSettings,
        isBatchMode
    } = useFileUpload([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [applyToAll, setApplyToAll] = useState(false);
    const [resizedUrls, setResizedUrls] = useState<{ [id: string]: string }>({});
    const [resizedBlobs, setResizedBlobs] = useState<{ [id: string]: Blob }>({});

    // Cleanup URLs on unmount or file reset
    useEffect(() => {
        return () => {
            Object.values(resizedUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const handleUpload = async (uploadedFiles: File[]) => {
        // Reset old URLs
        setResizedUrls(prev => {
            Object.values(prev).forEach(url => URL.revokeObjectURL(url));
            return {};
        });

        const enrichedFiles = await Promise.all(uploadedFiles.map(async (file) => {
            const tempUrl = URL.createObjectURL(file);
            const img = new Image();
            img.src = tempUrl;
            await new Promise((resolve) => {
                img.onload = resolve;
            });
            URL.revokeObjectURL(tempUrl);

            return {
                file,
                dimensions: { width: img.width, height: img.height }
            };
        }));

        enrichedFiles.forEach(({ file, dimensions }) => {
            addFiles([file], {
                ...DEFAULT_SETTINGS,
                width: dimensions.width,
                height: dimensions.height,
                isResized: false
            });
        });

        toast.success(`Loaded ${enrichedFiles.length} images for resizing.`);
    };

    const handleSettingChange = (key: keyof ResizeSettings, value: any) => {
        if (!activeFile) return;

        let finalUpdates: any = { [key]: value, isResized: false };

        if (key === "preset" && value !== "") {
            const preset = SOCIAL_PRESETS.find(p => p.id === value);
            if (preset) {
                finalUpdates.mode = "social" as any;
                finalUpdates.width = preset.width as any;
                finalUpdates.height = preset.height as any;
                finalUpdates.lockAspectRatio = false as any;
            }
        }

        // Maintain Aspect Ratio logic for Width/Height inputs
        if (activeFile.settings.mode === "pixels" && activeFile.settings.lockAspectRatio) {
            const originalRatio = activeFile.originalWidth && activeFile.originalHeight
                ? activeFile.originalWidth / activeFile.originalHeight
                : 1;

            if (key === "width" && value !== "") {
                const newWidth = parseInt(value) || 0;
                finalUpdates.height = Math.round(newWidth / originalRatio);
            } else if (key === "height" && value !== "") {
                const newHeight = parseInt(value) || 0;
                finalUpdates.width = Math.round(newHeight * originalRatio);
            }
        }

        if (applyToAll && isBatchMode) {
            // If applying to all, reset resizing state globally
            updateAllFileSettings(finalUpdates);
        } else {
            updateFileSettings(activeFile.id, finalUpdates);
        }
    };

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

        // Clear previous urls
        setResizedUrls(prev => {
            Object.values(prev).forEach(url => URL.revokeObjectURL(url));
            return {};
        });

        try {
            const newUrls: { [id: string]: string } = {};
            const newBlobs: { [id: string]: Blob } = {};
            const filesToProcess = applyToAll ? files : (activeFile ? [activeFile] : []);

            for (const fileMeta of filesToProcess) {
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
                    fit: "contain",
                    background: fileMeta.settings.fillBackground,
                    anchor: fileMeta.settings.anchor,
                    resampling: fileMeta.settings.resampling
                });

                newUrls[fileMeta.id] = URL.createObjectURL(blob);
                newBlobs[fileMeta.id] = blob;
                updateFileSettings(fileMeta.id, { isResized: true });
            }

            setResizedUrls(prev => ({ ...prev, ...newUrls }));
            setResizedBlobs(prev => ({ ...prev, ...newBlobs }));
            toast.success("Images resized successfully! Ready to download.");

        } catch (error) {
            toast.error("Failed to resize images. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        try {
            if (applyToAll && isBatchMode) {
                const [{ default: JSZip }, { saveAs }] = await Promise.all([
                    import("jszip"),
                    import("file-saver")
                ]);
                const zip = new JSZip();
                const promises = files.map(async (fileMeta) => {
                    if (!fileMeta.settings.isResized || !resizedBlobs[fileMeta.id]) return;
                    const blob = resizedBlobs[fileMeta.id];

                    const targetFormat = (fileMeta.settings.format === "original"
                        ? (fileMeta.file.type.split('/')[1] || "jpg")
                        : (fileMeta.settings.format.split('/')[1] || "jpg"));
                    const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;

                    const originalName = fileMeta.file.name.substring(0, fileMeta.file.name.lastIndexOf('.')) || fileMeta.file.name;
                    zip.file(`${originalName}-resized.${ext}`, blob);
                });

                await Promise.all(promises);
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, "aurafile-resized.zip");
                toast.success("Downloaded ZIP file!");
            } else if (activeFile && activeFile.settings.isResized && resizedBlobs[activeFile.id]) {
                const blob = resizedBlobs[activeFile.id];

                const targetFormat = (activeFile.settings.format === "original"
                    ? (activeFile.file.type.split('/')[1] || "jpg")
                    : (activeFile.settings.format.split('/')[1] || "jpg"));
                const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
                const originalName = activeFile.file.name.substring(0, activeFile.file.name.lastIndexOf('.')) || activeFile.file.name;
                const { saveAs } = await import("file-saver");
                saveAs(blob, `${originalName}-resized.${ext}`);
            }
        } catch (error) {
            toast.error("Failed to download images.");
        }
    };

    const isAllReady = applyToAll && files.length > 0 && files.every((f: any) => f.settings.isResized && resizedUrls[f.id]);
    const isCurrentReady = !applyToAll && activeFile && activeFile.settings.isResized && resizedUrls[activeFile.id];

    const handlePrimaryAction = () => {
        if (isAllReady || isCurrentReady) {
            handleDownload();
        } else {
            handleProcess();
        }
    };

    const getPrimaryActionText = () => {
        if (isProcessing) return "Processing...";
        if (isAllReady) return `Download All (${files.length} Zipped)`;
        if (isCurrentReady) return "Download Image";
        return applyToAll && files.length > 1 ? `Resize All (${files.length})` : "Resize Image";
    };

    const customPreview = activeFile ? (
        <div className="w-full h-full p-4 md:p-8 flex items-center justify-center relative">
            <div
                className="relative flex items-center justify-center max-w-full max-h-full shadow-md drop-shadow-sm border border-slate-200 bg-[linear-gradient(45deg,#f8f9fa_25%,transparent_25%,transparent_75%,#f8f9fa_75%,#f8f9fa),linear-gradient(45deg,#f8f9fa_25%,transparent_25%,transparent_75%,#f8f9fa_75%,#f8f9fa)] bg-white bg-[length:20px_20px] bg-[position:0_0,10px_10px]"
                style={{
                    aspectRatio: activeFile.settings?.width && activeFile.settings?.height
                        ? `${activeFile.settings.width} / ${activeFile.settings.height}`
                        : undefined
                }}
            >
                <img
                    src={resizedUrls[activeFile.id] || activeFile.previewUrl}
                    alt={resizedUrls[activeFile.id] ? "Resized Image" : "Live Preview"}
                    loading="lazy"
                    className="w-full h-full pointer-events-none"
                    style={{
                        objectFit: activeFile.settings?.width && activeFile.settings?.height ? 'fill' : 'contain'
                    }}
                />
            </div>

            <div className={`absolute bottom-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 z-10 ${resizedUrls[activeFile.id] ? 'text-green-600' : 'text-[#0081C9]'}`}>
                {resizedUrls[activeFile.id] ? (
                    <><Icon name="check-circle" size={14} /> Resized Successfully</>
                ) : (
                    <><Icon name="eye" size={14} /> Live Preview</>
                )}
            </div>
        </div>
    ) : null;

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-2xl border border-border bg-surface shadow-xl shadow-primary/5 p-4 md:p-8 backdrop-blur-sm">
                        <ImageUploader onUpload={handleUpload} />
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
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        <Icon name={(isAllReady || isCurrentReady) ? "download" : "expand"} size={18} />
                        {getPrimaryActionText()}
                    </span>
                }
                isProcessing={isProcessing}
                customPreview={customPreview}
            >
                {activeFile && (
                    <ToolSettingsRenderer
                        title="Resize Settings"
                        isBatchMode={isBatchMode}
                        applyToAll={applyToAll}
                        onApplyToAllChange={setApplyToAll}
                    >
                        <div className="bg-[#E8ECEF] rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground mb-1">Original</span>
                                <span className="text-sm font-bold text-slate-800">
                                    {activeFile.file ? `${activeFile.originalWidth || activeFile.settings?.width || '-'}x${activeFile.originalHeight || activeFile.settings?.height || '-'}` : "—"}
                                </span>
                            </div>
                            <div className="text-slate-400">
                                <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-medium text-muted-foreground mb-1">Resized</span>
                                <span className="text-sm font-bold text-slate-800">
                                    {`${activeFile.settings?.width || '-'}x${activeFile.settings?.height || '-'}`}
                                </span>
                            </div>
                        </div>

                        {/* Dimensions Setting Group */}
                        <SettingGroup title="Dimensions">
                            <SelectRow
                                label="Mode"
                                value={activeFile.settings?.mode}
                                onChange={(val) => handleSettingChange("mode", val)}
                                options={[
                                    { label: "Exact Pixels", value: "pixels" },
                                    { label: "Percentage Scale", value: "percentage" },
                                    { label: "Social Presets", value: "social" }
                                ]}
                            />

                            {activeFile.settings?.mode === "percentage" ? (
                                <div className="space-y-4 pt-2">
                                    <SettingRow label="Scale Percentage" value={`${activeFile.settings?.percentage}%`}>
                                        <div className="relative w-full h-2 rounded-full cursor-pointer bg-slate-200 mt-2">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-[#0081C9] rounded-l-full pointer-events-none"
                                                style={{ width: `${Math.min(100, (activeFile.settings?.percentage / 200) * 100)}%` }}
                                            ></div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="200"
                                                value={activeFile.settings?.percentage}
                                                onChange={(e) => handleSettingChange("percentage", parseInt(e.target.value))}
                                                className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-10 h-full"
                                            />
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full border-[2px] border-[#0081C9] shadow-sm pointer-events-none z-0 mt-[1px]"
                                                style={{ left: `calc(${Math.min(100, (activeFile.settings?.percentage / 200) * 100)}% - 8px)` }}
                                            ></div>
                                        </div>
                                    </SettingRow>
                                </div>
                            ) : activeFile.settings?.mode === "social" ? (
                                <div className="pt-2">
                                    <SelectRow
                                        label="Preset"
                                        value={activeFile.settings?.preset || ""}
                                        onChange={(val) => handleSettingChange("preset", val)}
                                        options={[
                                            { label: "Choose Preset...", value: "" },
                                            ...SOCIAL_PRESETS.map(p => ({ label: p.label, value: p.id }))
                                        ]}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-end gap-3 w-full pt-2">
                                    <div className="flex-1 space-y-1.5 flex flex-col">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Width (px)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={activeFile.settings?.width || ""}
                                            onChange={(e) => handleSettingChange("width", e.target.value)}
                                            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-[#0081C9]"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange("lockAspectRatio", !activeFile.settings?.lockAspectRatio)}
                                        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all shadow-sm shrink-0 ${activeFile.settings?.lockAspectRatio ? "border-[#0081C9]/50 bg-[#0081C9]/5 text-[#0081C9] ring-1 ring-[#0081C9]/20" : "border-slate-200 hover:bg-slate-50 text-slate-400"}`}
                                        title={activeFile.settings?.lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                                    >
                                        <Icon name={activeFile.settings?.lockAspectRatio ? "lock" : "unlock"} size={16} />
                                    </button>
                                    <div className="flex-1 space-y-1.5 flex flex-col">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Height (px)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={activeFile.settings?.height || ""}
                                            onChange={(e) => handleSettingChange("height", e.target.value)}
                                            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-[#0081C9]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Canvas Fit Advanced Options */}
                            <div className="h-px bg-slate-200/60 my-2 w-full"></div>

                            <SelectRow
                                label="Resampling Algorithm"
                                value={activeFile.settings?.resampling}
                                onChange={(val) => handleSettingChange("resampling", val)}
                                options={[
                                    { label: "Lanczos 3 (Best Quality)", value: "lanczos3" },
                                    { label: "Bicubic (Smooth)", value: "bicubic" },
                                    { label: "Bilinear (Fast)", value: "bilinear" },
                                    { label: "Nearest Neighbor (Pixel Art)", value: "nearest" }
                                ]}
                            />

                            <SelectRow
                                label="Canvas Anchor"
                                value={activeFile.settings?.anchor}
                                onChange={(val) => handleSettingChange("anchor", val)}
                                options={[
                                    { label: "Center", value: "center" },
                                    { label: "Top Left", value: "northwest" },
                                    { label: "Top Right", value: "northeast" },
                                    { label: "Bottom Left", value: "southwest" },
                                    { label: "Bottom Right", value: "southeast" }
                                ]}
                            />
                        </SettingGroup>

                        {/* Background Setting */}
                        <SettingGroup title="Background Fill">
                            <div className="flex items-center gap-3 w-full">
                                <label className="text-sm font-medium text-slate-700 flex-1">
                                    Fill Color (if stretched)
                                </label>
                                <input
                                    type="color"
                                    value={activeFile.settings?.fillBackground || "#FFFFFF"}
                                    onChange={(e) => handleSettingChange("fillBackground", e.target.value)}
                                    className="h-8 w-12 cursor-pointer border-none bg-transparent rounded-lg"
                                />
                                <button
                                    onClick={() => handleSettingChange("fillBackground", "transparent")}
                                    className="text-xs text-muted-foreground hover:text-slate-800 px-2 py-1 rounded"
                                >
                                    Transparent
                                </button>
                            </div>
                        </SettingGroup>

                        {/* Export Setting Group */}
                        <SettingGroup title="Output Options">
                            <SelectRow
                                label="Export Format"
                                value={activeFile.settings?.format}
                                onChange={(val) => handleSettingChange("format", val)}
                                options={[
                                    { label: "Same as Original", value: "original" },
                                    { label: "Save as JPG", value: "image/jpeg" },
                                    { label: "Save as PNG", value: "image/png" },
                                    { label: "Save as WebP", value: "image/webp" }
                                ]}
                            />

                            <SettingRow label="Quality" value={`${activeFile.settings?.quality}%`}>
                                <div className="relative w-full h-2 rounded-full cursor-pointer bg-slate-200 mt-2">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#0081C9] rounded-l-full pointer-events-none"
                                        style={{ width: `${activeFile.settings?.quality}%` }}
                                    ></div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={activeFile.settings?.quality}
                                        onChange={(e) => handleSettingChange("quality", parseInt(e.target.value))}
                                        className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-10 h-full"
                                    />
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full border-[2px] border-[#0081C9] shadow-sm pointer-events-none z-0 mt-[1px]"
                                        style={{ left: `calc(${activeFile.settings?.quality}% - 8px)` }}
                                    ></div>
                                </div>
                            </SettingRow>

                            <ToggleRow
                                label="Preserve Metadata"
                                description="Keep camera info and timestamp"
                                checked={activeFile.settings?.preserveMetadata}
                                onChange={(val) => handleSettingChange("preserveMetadata", val)}
                            />
                        </SettingGroup>
                    </ToolSettingsRenderer>
                )}
            </ToolModal>
        </div>
    );
}
