"use client";

import { useState, useCallback, useEffect } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { ImageComparison } from "@/components/tools/ImageComparison";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ToolSettingsRenderer, SettingGroup, SettingRow, ToggleRow, SelectRow } from "@/components/tools/ToolSettingsRenderer";

type CompressStrategy = "lossy" | "lossless" | "auto";
type ChromaSubsampling = "4:4:4" | "4:2:0" | "auto";

interface CompressSettings {
    quality: number;
    targetMode: boolean;
    targetSizeUnit: "KB" | "MB";
    targetSizeValue: string;
    outputFormat: string;
    strategy: CompressStrategy;
    preserveMetadata: boolean;
    chromaSubsampling: ChromaSubsampling;

    // Output stats
    originalSize: number;
    compressedSize: number;
    isCompressed: boolean;
    compressedUrl: string | null;
}

const DEFAULT_COMPRESS_SETTINGS: CompressSettings = {
    quality: 80,
    targetMode: false,
    targetSizeUnit: "MB",
    targetSizeValue: "",
    outputFormat: "original",
    strategy: "auto",
    preserveMetadata: true,
    chromaSubsampling: "auto",
    originalSize: 0,
    compressedSize: 0,
    isCompressed: false,
    compressedUrl: null
};

export default function CompressTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        clearAll,
        updateFileSettings,
        updateAllFileSettings,
        isBatchMode
    } = useFileUpload([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [applyToAll, setApplyToAll] = useState(false);

    const processSingleFile = useCallback(async (currentFile: any) => {
        try {
            const imageCompression = (await import("browser-image-compression")).default;
            const options: any = {
                useWebWorker: true,
                preserveExif: currentFile.settings.preserveMetadata,
            };

            if (currentFile.settings.targetMode && currentFile.settings.targetSizeValue) {
                const targetSize = parseFloat(currentFile.settings.targetSizeValue);
                if (!isNaN(targetSize) && targetSize > 0) {
                    options.maxSizeMB = currentFile.settings.targetSizeUnit === "KB" ? targetSize / 1024 : targetSize;
                }
            } else {
                // If not target mode, fallback to trying to compress using quality ratio.
                options.initialQuality = currentFile.settings.quality / 100;
                options.maxSizeMB = 50;
            }

            // Output format mapping
            if (currentFile.settings.outputFormat !== "original") {
                options.fileType = `image/${currentFile.settings.outputFormat}`;
            }

            const compressedFile = await imageCompression(currentFile.file, options);
            const compressedUrl = URL.createObjectURL(compressedFile);

            updateFileSettings(currentFile.id, {
                compressedSize: compressedFile.size,
                isCompressed: true,
                compressedUrl: compressedUrl
            });
            return true;
        } catch (e) {
            console.error(e);
            toast.error(`Error compressing ${currentFile.file.name}.`);
            return false;
        }
    }, [updateFileSettings]);

    // Track relevant settings for auto-preview
    const activeSettingsStr = activeFile ? JSON.stringify({
        q: activeFile.settings.quality,
        tm: activeFile.settings.targetMode,
        tsv: activeFile.settings.targetSizeValue,
        tsu: activeFile.settings.targetSizeUnit,
        f: activeFile.settings.outputFormat,
        s: activeFile.settings.strategy,
        pm: activeFile.settings.preserveMetadata,
        cs: activeFile.settings.chromaSubsampling
    }) : "";

    // Debounced auto-preview
    useEffect(() => {
        if (!activeFile) return;
        // Don't auto-run if it's already compressed (prevents infinite loop after successful compression)
        if (activeFile.settings.isCompressed) return;
        // Don't auto-run if target mode is enabled but no value is provided
        if (activeFile.settings.targetMode && !activeFile.settings.targetSizeValue) return;

        const timer = setTimeout(async () => {
            setIsProcessing(true);
            await processSingleFile(activeFile);
            setIsProcessing(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [activeSettingsStr, activeFile, processSingleFile]);

    const handleUpload = async (uploadedFiles: File[]) => {
        addFiles(uploadedFiles, { ...DEFAULT_COMPRESS_SETTINGS });
    };

    const handleSettingChange = (key: keyof CompressSettings, value: any) => {
        if (!activeFile) return;

        const updates = { [key]: value, isCompressed: false };
        if (applyToAll && isBatchMode) {
            updateAllFileSettings(updates);
        } else {
            updateFileSettings(activeFile.id, updates);
        }
    };

    const handleCompress = async () => {
        if (applyToAll && isBatchMode) {
            setIsProcessing(true);
            let successCount = 0;
            let failCount = 0;

            for (const file of files) {
                const success = await processSingleFile(file);
                if (success) successCount++;
                else failCount++;
            }

            setIsProcessing(false);
            if (failCount === 0) {
                toast.success(`Successfully compressed all ${successCount} images!`);
            } else {
                toast.warning(`Finished: ${successCount} successful, ${failCount} failed.`);
            }
        } else {
            if (!activeFile) return;
            setIsProcessing(true);
            const success = await processSingleFile(activeFile);
            setIsProcessing(false);
            if (success) {
                toast.success("Image compressed successfully!");
            }
        }
    };



    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const isAllCompressed = files.length > 0 && files.every(f => f.settings.isCompressed && f.settings.compressedUrl);
    const isCurrentCompressed = activeFile && activeFile.settings.isCompressed && activeFile.settings.compressedUrl;

    const handleDownload = async () => {
        try {
            if (applyToAll && isBatchMode && isAllCompressed) {
                toast.info("Preparing ZIP file...");
                const zip = new JSZip();

                for (const fileMeta of files) {
                    if (!fileMeta.settings.compressedUrl) continue;
                    const response = await fetch(fileMeta.settings.compressedUrl);
                    const blob = await response.blob();

                    const originalName = fileMeta.file.name.substring(0, fileMeta.file.name.lastIndexOf('.')) || fileMeta.file.name;
                    // Format extraction could be improved, but usually compressedUrl has correct mime/extension info. 
                    // Let's use the explicit target format or default to jpeg/png based on blob type.
                    let targetExt = "jpg";
                    if (fileMeta.settings.outputFormat === "original") {
                        targetExt = fileMeta.file.type.split('/')[1] === "png" ? "png" : "jpg";
                    } else if (fileMeta.settings.outputFormat !== "jpeg") {
                        targetExt = fileMeta.settings.outputFormat; // png, webp
                    }

                    zip.file(`${originalName}-compressed.${targetExt}`, blob);
                }

                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, "aurafile-compressed.zip");
                toast.success("Downloaded ZIP file!");
            } else if (activeFile && isCurrentCompressed) {
                const response = await fetch(activeFile.settings.compressedUrl!);
                const blob = await response.blob();

                let targetExt = "jpg";
                if (activeFile.settings.outputFormat === "original") {
                    targetExt = activeFile.file.type.split('/')[1] === "png" ? "png" : "jpg";
                } else if (activeFile.settings.outputFormat !== "jpeg") {
                    targetExt = activeFile.settings.outputFormat;
                }
                const originalName = activeFile.file.name.substring(0, activeFile.file.name.lastIndexOf('.')) || activeFile.file.name;

                saveAs(blob, `${originalName}-compressed.${targetExt}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to download compressed images.");
        }
    };

    const getPrimaryActionText = () => {
        if (isProcessing) return "Compressing...";
        if (applyToAll && isBatchMode) {
            return isAllCompressed ? `Download All (${files.length} Zipped)` : `Compress All (${files.length})`;
        }
        return isCurrentCompressed ? "Download Image" : "Compress Active Image";
    };

    const handlePrimaryAction = () => {
        if (applyToAll && isBatchMode && isAllCompressed) {
            handleDownload();
        } else if (!applyToAll && isCurrentCompressed) {
            handleDownload();
        } else {
            handleCompress();
        }
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-2xl border border-border bg-surface shadow-xl p-4 md:p-8 backdrop-blur-sm">
                        <ImageUploader onUpload={handleUpload} />
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                title="Compress Image"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        <Icon name={((applyToAll && isBatchMode && isAllCompressed) || (!applyToAll && isCurrentCompressed)) ? "download" : "shrink"} size={18} />
                        {getPrimaryActionText()}
                    </span>
                }
                isProcessing={isProcessing}
                customPreview={
                    activeFile?.settings.isCompressed && activeFile.settings.compressedUrl ? (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <ImageComparison
                                beforeImage={activeFile.previewUrl}
                                afterImage={activeFile.settings.compressedUrl}
                            />
                        </div>
                    ) : undefined
                }
            >
                {/* TOOL SPECIFIC SIDEBAR CONTENT */}
                {activeFile && (
                    <ToolSettingsRenderer
                        title="Compression Settings"
                        isBatchMode={isBatchMode}
                        applyToAll={applyToAll}
                        onApplyToAllChange={setApplyToAll}
                    >
                        {/* Summary Card */}
                        <div className="bg-[#E8ECEF] rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground mb-1">Original</span>
                                <span className="text-sm font-bold text-slate-800">
                                    {formatSize(activeFile.file.size)}
                                </span>
                            </div>
                            <div className="text-slate-400">
                                <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-medium text-muted-foreground mb-1">Compressed</span>
                                <span className="text-sm font-bold text-slate-800">
                                    {activeFile.settings.isCompressed ? formatSize(activeFile.settings.compressedSize) : "—"}
                                </span>
                            </div>
                        </div>

                        {/* Core Compression Group */}
                        <SettingGroup title="Quality & Sizing">
                            <ToggleRow
                                label="Target File Size"
                                description="Automatically adjust quality to hit target size"
                                checked={activeFile.settings.targetMode}
                                onChange={(val) => handleSettingChange("targetMode", val)}
                            />

                            {activeFile.settings.targetMode ? (
                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        type="number"
                                        placeholder="Target size"
                                        value={activeFile.settings.targetSizeValue}
                                        onChange={(e) => handleSettingChange("targetSizeValue", e.target.value)}
                                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm"
                                    />
                                    <select
                                        value={activeFile.settings.targetSizeUnit}
                                        onChange={(e) => handleSettingChange("targetSizeUnit", e.target.value)}
                                        className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm w-[80px]"
                                    >
                                        <option value="KB">KB</option>
                                        <option value="MB">MB</option>
                                    </select>
                                </div>
                            ) : (
                                <SettingRow label="Quality Level" value={`${activeFile.settings.quality}%`}>
                                    <div className="relative w-full h-2 rounded-full cursor-pointer bg-slate-200 mt-2 mb-1">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-[#0081C9] rounded-l-full pointer-events-none"
                                            style={{ width: `${activeFile.settings.quality}%` }}
                                        ></div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={activeFile.settings.quality}
                                            onChange={(e) => handleSettingChange("quality", parseInt(e.target.value))}
                                            className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-10 h-full"
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full border-[2px] border-[#0081C9] shadow-sm pointer-events-none z-0 mt-[1px]"
                                            style={{ left: `calc(${activeFile.settings.quality}% - 8px)` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wide">
                                        <span>Smaller file</span>
                                        <span>Higher quality</span>
                                    </div>
                                </SettingRow>
                            )}
                        </SettingGroup>

                        {/* Format & Ext */}
                        <SettingGroup title="Format & Strategy">
                            <SelectRow
                                label="Output Format"
                                value={activeFile.settings.outputFormat}
                                onChange={(val) => handleSettingChange("outputFormat", val)}
                                options={[
                                    { label: "Same as Original", value: "original" },
                                    { label: "Convert to JPG", value: "jpeg" },
                                    { label: "Convert to PNG", value: "png" },
                                    { label: "Convert to WebP", value: "webp" }
                                ]}
                            />

                            <SelectRow
                                label="Compression Strategy"
                                value={activeFile.settings.strategy}
                                onChange={(val) => handleSettingChange("strategy", val)}
                                options={[
                                    { label: "Auto (Recommended)", value: "auto" },
                                    { label: "Lossy", value: "lossy" },
                                    { label: "Lossless (PNG/WebP)", value: "lossless" }
                                ]}
                            />
                        </SettingGroup>

                        {/* Advanced Settings */}
                        <SettingGroup title="Advanced Options">
                            <SelectRow
                                label="Chroma Subsampling"
                                value={activeFile.settings.chromaSubsampling}
                                onChange={(val) => handleSettingChange("chromaSubsampling", val)}
                                options={[
                                    { label: "Auto", value: "auto" },
                                    { label: "4:4:4 (Highest Quality)", value: "4:4:4" },
                                    { label: "4:2:0 (Better Compression)", value: "4:2:0" }
                                ]}
                            />

                            <div className="h-px bg-slate-200/60 my-2 w-full"></div>

                            <ToggleRow
                                label="Preserve EXIF Metadata"
                                description="Keep camera info, location, date created, etc."
                                checked={activeFile.settings.preserveMetadata}
                                onChange={(val) => handleSettingChange("preserveMetadata", val)}
                            />
                        </SettingGroup>
                    </ToolSettingsRenderer>
                )}
            </ToolModal>
        </div>
    );
}
