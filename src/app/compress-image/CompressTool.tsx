"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { ImageComparison } from "@/components/tools/ImageComparison";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { useFileUpload, type IntegratedFile } from "@/hooks/useFileUpload";

import { ToolSettingsRenderer, SettingGroup, SettingRow, ToggleRow, SelectRow } from "@/components/tools/ToolSettingsRenderer";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { isMobileBrowser, isIOS } from "@/lib/mobile-detection";

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
    compressedBlob: Blob | null;
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
    compressedUrl: null,
    compressedBlob: null
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

    const [applyToAll, setApplyToAll] = useState(false);

    const { status, processFiles, clearMemory, createSafeObjectURL } = useFileProcessor<{ success: number, fail: number, batch: boolean }>({
        processFn: async (targetFiles, onProgress) => {
            return new Promise(async (resolve, reject) => {
                let successCount = 0;
                let failCount = 0;
                const batch = targetFiles.length > 1 || (applyToAll && isBatchMode);

                // Use the outer `files` reference to locate IntegratedFiles corresponding to passed targetFiles
                const processingFiles = batch ? files : (activeFile ? [activeFile] : []);

                // Mobile-specific optimizations
                const isMobile = isMobileBrowser();
                const isIosDevice = isIOS();
                
                // Reduce concurrent processing on mobile to prevent memory issues
                const maxConcurrent = isMobile ? 1 : 3;
                
                for (let i = 0; i < processingFiles.length; i++) {
                    const currentFile = processingFiles[i];
                    
                    // For mobile, process files sequentially with delays to manage memory
                    if (isMobile && i > 0) {
                        // Wait a bit between files to let memory settle
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    
                    try {
                        const imageCompression = (await import("browser-image-compression")).default;
                        
                        // Mobile-specific options
                        const options: any = {
                            useWebWorker: !isIosDevice, // Disable web workers on iOS due to known issues
                            preserveExif: currentFile.settings.preserveMetadata,
                        };

                        // More conservative settings for mobile
                        if (isMobile) {
                            // Reduce quality slightly for better performance on mobile
                            if (!currentFile.settings.targetMode) {
                                options.initialQuality = Math.min(currentFile.settings.quality / 100, 0.8);
                            }
                            
                            // Lower max size for mobile to prevent memory issues
                            options.maxSizeMB = Math.min(
                                currentFile.settings.targetMode && currentFile.settings.targetSizeValue 
                                    ? (parseFloat(currentFile.settings.targetSizeValue) / 1024) 
                                    : 25, // Default to 25MB instead of 50MB
                                25
                            );
                            
                            // Additional mobile optimizations
                            options.alwaysKeepWidth = false;
                            options.alwaysKeepHeight = false;
                        } else {
                            // Desktop settings
                            if (currentFile.settings.targetMode && currentFile.settings.targetSizeValue) {
                                const targetSize = parseFloat(currentFile.settings.targetSizeValue);
                                if (!isNaN(targetSize) && targetSize > 0) {
                                    options.maxSizeMB = currentFile.settings.targetSizeUnit === "KB" ? targetSize / 1024 : targetSize;
                                }
                            } else {
                                options.initialQuality = currentFile.settings.quality / 100;
                                options.maxSizeMB = 50;
                            }
                        }

                        if (currentFile.settings.outputFormat !== "original") {
                            options.fileType = `image/${currentFile.settings.outputFormat}`;
                        }

                        // Additional fallback for canvas issues on mobile
                        try {
                            const compressedFile = await imageCompression(currentFile.file, options);
                            const compressedUrl = createSafeObjectURL(compressedFile); // Leverage memory safe urls

                            updateFileSettings(currentFile.id, {
                                compressedSize: compressedFile.size,
                                isCompressed: true,
                                compressedUrl: compressedUrl,
                                compressedBlob: compressedFile
                            });
                            successCount++;
                        } catch (canvasError) {
                            // Fallback to canvas-based compression if library fails
                            if (isMobile) {
                                try {
                                    const fallbackBlob = await mobileCanvasFallback(currentFile.file, {
                                        quality: currentFile.settings.quality / 100,
                                        maxSizeMB: options.maxSizeMB || 25,
                                        fileType: currentFile.settings.outputFormat !== "original" 
                                            ? `image/${currentFile.settings.outputFormat}` 
                                            : undefined
                                    });
                                    
                                    const fallbackUrl = createSafeObjectURL(fallbackBlob);
                                    
                                    updateFileSettings(currentFile.id, {
                                        compressedSize: fallbackBlob.size,
                                        isCompressed: true,
                                        compressedUrl: fallbackUrl,
                                        compressedBlob: fallbackBlob
                                    });
                                    successCount++;
                                    continue; // Skip the normal error handling
                                } catch (fallbackError) {
                                    console.warn('Mobile fallback failed:', fallbackError);
                                    // Fall through to normal error handling
                                }
                            }
                            throw canvasError; // Re-throw if not mobile or fallback also failed
                        }
                    } catch (e) {
                        console.error(`Compression failed for ${currentFile.file.name}:`, e);
                        toast.error(`Error compressing ${currentFile.file.name}.`);
                        failCount++;
                    }
                    
                    onProgress(((i + 1) / processingFiles.length) * 100);
                }

                resolve({ success: successCount, fail: failCount, batch });
            });
        }
    });

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
        if (activeFile.settings.isCompressed) return;
        if (activeFile.settings.targetMode && !activeFile.settings.targetSizeValue) return;

        const timer = setTimeout(() => {
            // trigger process without batch checking automatically
            processFiles([activeFile.file]);
        }, 600);

        return () => clearTimeout(timer);
    }, [activeSettingsStr, activeFile, processFiles]);

    const handleUpload = async (uploadedFiles: File[]) => {
        addFiles(uploadedFiles, { ...DEFAULT_COMPRESS_SETTINGS });
    };

    const handleClearAll = () => {
        clearAll();
        clearMemory();
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
            processFiles(files.map(f => f.file));
        } else {
            if (!activeFile) return;
            processFiles([activeFile.file]);
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

// Mobile canvas fallback for when browser-image-compression fails
const mobileCanvasFallback = async (file: File, options: any): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Calculate dimensions with mobile-friendly limits
      let { width, height } = img;
      const MAX_DIMENSION = 2048; // Limit canvas size for mobile
      
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width *= ratio;
        height *= ratio;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Fill with white background for JPG conversion
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with mobile-friendly quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob failed'));
            return;
          }
          resolve(blob);
        },
        options.fileType || 'image/jpeg',
        Math.max(options.quality || 0.8, 0.5) // Ensure minimum quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };
    
    img.src = url;
  });
};

    const handleDownload = async () => {
        try {
            if (applyToAll && isBatchMode && isAllCompressed) {
                toast.info("Preparing ZIP file...");
                const [{ default: JSZip }, { saveAs }] = await Promise.all([
                    import("jszip"),
                    import("file-saver")
                ]);
                const zip = new JSZip();

                for (const fileMeta of files) {
                    if (!fileMeta.settings.compressedBlob) continue;
                    const blob = fileMeta.settings.compressedBlob;

                    const originalName = fileMeta.file.name.substring(0, fileMeta.file.name.lastIndexOf('.')) || fileMeta.file.name;
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
            } else if (activeFile && isCurrentCompressed && activeFile.settings.compressedBlob) {
                const blob = activeFile.settings.compressedBlob;

                let targetExt = "jpg";
                if (activeFile.settings.outputFormat === "original") {
                    targetExt = activeFile.file.type.split('/')[1] === "png" ? "png" : "jpg";
                } else if (activeFile.settings.outputFormat !== "jpeg") {
                    targetExt = activeFile.settings.outputFormat;
                }
                const originalName = activeFile.file.name.substring(0, activeFile.file.name.lastIndexOf('.')) || activeFile.file.name;

                const { saveAs } = await import("file-saver");
                saveAs(blob, `${originalName}-compressed.${targetExt}`);
            }
        } catch (error) {
            toast.error("Failed to download compressed images.");
        }
    };

    const getPrimaryActionText = () => {
        if (status === 'processing') return "Compressing...";
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
                onClose={handleClearAll}
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
                isProcessing={status === 'processing'}
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
