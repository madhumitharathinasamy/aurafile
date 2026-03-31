"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { ImageComparison } from "@/components/tools/ImageComparison";
import { useFileUpload, type IntegratedFile } from "@/hooks/useFileUpload";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { ToolSettingsRenderer, SettingGroup, SelectRow, SettingRow, ToggleRow } from "@/components/tools/ToolSettingsRenderer";
import { isMobileBrowser, isIOS } from "@/lib/mobile-detection";

interface ConvertSettings {
    targetFormat: string;
    quality: number; // For JPG, WEBP, AVIF, TIFF
    backgroundColor: string; // For JPG or transparency replacement
    preserveMetadata: boolean;
    lossless: boolean; // For WEBP, AVIF
}

const DEFAULT_SETTINGS: ConvertSettings = {
    targetFormat: "jpg",
    quality: 90,
    backgroundColor: "transparent", // Only used if format doesn't support transparency and not "transparent"
    preserveMetadata: true,
    lossless: false
};

const ACCEPTED_EXTENSIONS = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/gif": [".gif"],
    "image/tiff": [".tiff", ".tif"],
    "image/avif": [".avif"],
    "image/bmp": [".bmp"],
    "image/x-icon": [".ico"],
    "image/heic": [".heic", ".heif"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Mobile canvas fallback for when browser-image-compression fails
const mobileCanvasFallback = async (file: File, options: any, fileMeta?: IntegratedFile): Promise<Blob> => {
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
            
            // Handle background color for formats that don't support transparency
            const formatNeedsBackground = ['jpeg', 'jpg'].includes(options.fileType?.split('/')[1] || '');
            
            if (formatNeedsBackground) {
                // Use fileMeta background color if available, otherwise default to white
                const backgroundColor = fileMeta?.settings?.backgroundColor !== 'transparent' && fileMeta?.settings?.backgroundColor 
                  ? fileMeta.settings.backgroundColor 
                  : '#FFFFFF';
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with mobile-friendly quality
            let targetType = options.fileType || 'image/jpeg';
            // Fallback for tricky formats on mobile canvas which might silently fail or return null
            if (['image/webp', 'image/avif', 'image/tiff'].includes(targetType) && !document.createElement('canvas').toDataURL(targetType).startsWith(`data:${targetType}`)) {
                targetType = 'image/jpeg'; // safest fallback
            }

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob failed. Format might be unsupported by device.'));
                        return;
                    }
                    resolve(blob);
                },
                targetType,
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

export default function ConvertTool() {
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

    const { status, processFiles, clearMemory, createSafeObjectURL } = useFileProcessor<number>({
        processFn: async (targetFiles: File[], onProgress: (progress: number) => void) => {
            return new Promise(async (resolve, reject) => {
                let successCount = 0;
                let errorCount = 0;

                const batchMeta = targetFiles.map(f => files.find(meta => meta.file === f)).filter(Boolean) as IntegratedFile[];

                const totalBytes = batchMeta.reduce((acc, f) => acc + f.file.size, 0);
                const isHeavyBatch = totalBytes > 1024 * 1024 * 1024; // > 1GB

                // Mobile-specific optimizations
                const isMobile = isMobileBrowser();
                const isIosDevice = isIOS();
                
                // Reduce concurrent processing on mobile to prevent memory issues
                const maxConcurrent = isMobile ? 1 : 3;

                for (let i = 0; i < batchMeta.length; i++) {
                    if (isHeavyBatch && batchMeta.length > 1) {
                        await new Promise(r => setTimeout(r, 100));
                    }

                    // For mobile, process files sequentially with delays to manage memory
                    if (isMobile && i > 0) {
                        // Wait a bit between files to let memory settle
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    const fileMeta = batchMeta[i];
                    
                    try {
                        const conversionFormat = fileMeta.settings.targetFormat.toLowerCase();
                        const mimeType = `image/${conversionFormat === 'jpg' ? 'jpeg' : conversionFormat}`;
                        
                        let fileToProcess = fileMeta.file;
                        // Pre-process HEIC files since compression libraries native canvas APIs rarely support them
                        if (fileToProcess.type === 'image/heic' || fileToProcess.type === 'image/heif' || fileToProcess.name.toLowerCase().endsWith('.heic') || fileToProcess.name.toLowerCase().endsWith('.heif')) {
                            try {
                                const heic2any = (await import("heic2any")).default;
                                const heicBlob = await heic2any({
                                    blob: fileToProcess,
                                    toType: "image/jpeg",
                                    quality: 0.9
                                });
                                fileToProcess = new File([Array.isArray(heicBlob) ? heicBlob[0] : heicBlob], fileToProcess.name.replace(/\.hei(c|f)$/i, '.jpeg'), {
                                    type: "image/jpeg"
                                });
                            } catch (heicError) {
                                console.warn("HEIC pre-conversion failed, falling back to basic handler", heicError);
                            }
                        }

                        // Mobile-specific options
                        const options: any = {
                            useWebWorker: !isIosDevice, // Disable web workers on iOS due to known issues
                            maxSizeMB: isMobile ? 25 : 50, // Reduce max size for mobile
                            initialQuality: isMobile 
                                ? Math.min(fileMeta.settings.quality / 100, 0.8) // Reduce quality for better performance
                                : fileMeta.settings.quality / 100,
                            fileType: mimeType
                        };

                        // Additional mobile fallbacks
                        try {
                            const imageCompression = (await import("browser-image-compression")).default;
                            const resultBlob = await imageCompression(fileToProcess, options);
                            const convertedUrl = createSafeObjectURL(resultBlob);

                            updateFileSettings(fileMeta.id, {
                                convertedUrl,
                                convertedBlob: resultBlob
                            });
                            successCount++;
                        } catch (libError) {
                            let fallbackSuccess = false;
                            
                            // Fallback to canvas-based conversion for mobile
                            if (isMobile) {
                                try {
                                    const fallbackBlob = await mobileCanvasFallback(fileToProcess, {
                                        quality: fileMeta.settings.quality / 100,
                                        maxSizeMB: options.maxSizeMB,
                                        fileType: mimeType
                                    }, fileMeta); // Pass fileMeta for background color
                                    
                                    const fallbackUrl = createSafeObjectURL(fallbackBlob);
                                    
                                    updateFileSettings(fileMeta.id, {
                                        convertedUrl: fallbackUrl,
                                        convertedBlob: fallbackBlob
                                    });
                                    successCount++;
                                    fallbackSuccess = true;
                                } catch (fallbackError) {
                                    console.warn('Mobile fallback failed:', fallbackError);
                                }
                            }
                            
                            if (!fallbackSuccess) {
                                throw libError; // Re-throw if not mobile or fallback also failed
                            }
                        }
                    } catch (e: any) {
                        console.error(`Conversion failed for ${fileMeta.file.name}:`, e);
                        toast.error(`Error converting ${fileMeta.file.name}`);
                        errorCount++;
                    }

                    onProgress(((i + 1) / batchMeta.length) * 100);
                }

                if (successCount === 0 && batchMeta.length > 0) {
                    toast.error("Failed to convert files. Please try again.");
                } else if (errorCount > 0) {
                    toast.warning(`Converted ${successCount} files. ${errorCount} failed.`);
                } else if (batchMeta.length > 1) {
                    toast.success(`Successfully converted ${successCount} files!`);
                } else {
                    toast.success('Successfully converted!');
                }

                resolve(successCount);
            });
        }
    });

    const handleUpload = (newFiles: File[]) => {
        const uniqueFiles = newFiles.filter(newFile =>
            !files.some(existing => existing.file.name === newFile.name && existing.file.size === newFile.size)
        );

        const MAX_FILES = 20;
        const remainingSlots = MAX_FILES - files.length;

        if (remainingSlots <= 0) {
            toast.error("Maximum 20 files limit reached.");
            return;
        }

        const filesToAdd = uniqueFiles.slice(0, remainingSlots);
        const skippedCount = uniqueFiles.length - filesToAdd.length;

        if (filesToAdd.length > 0) {
            addFiles(filesToAdd, { ...DEFAULT_SETTINGS });
            if (skippedCount > 0) {
                toast.warning(`Added ${filesToAdd.length} files. Skipped ${skippedCount} (Limit 20).`);
            }
        } else if (uniqueFiles.length < newFiles.length && skippedCount === 0) {
            toast.info("Duplicate files were skipped.");
        }
    };

    const handleSettingChange = (key: keyof ConvertSettings, value: string | number | boolean) => {
        if (!activeFile) return;

        const finalUpdates: any = { [key]: value };

        // Auto-fix background color if moving to JPG and currently transparent
        if (key === "targetFormat" && value === "jpg" && activeFile.settings.backgroundColor === "transparent") {
            finalUpdates.backgroundColor = "#FFFFFF";
        }

        // Wipe converted results since settings changed
        if (applyToAll && isBatchMode) {
            updateAllFileSettings({ ...finalUpdates, convertedUrl: null, convertedBlob: null });
        } else {
            updateFileSettings(activeFile.id, { ...finalUpdates, convertedUrl: null, convertedBlob: null });
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        const filesToProcess = applyToAll && isBatchMode ? files : activeFile ? [activeFile] : [];
        
        // Reset old blobs before starting via settings
        filesToProcess.forEach(f => {
            updateFileSettings(f.id, { convertedUrl: null, convertedBlob: null });
        });

        processFiles(filesToProcess.map(f => f.file));
    };

    const getDownloadExt = (format: string) => format === "jpeg" ? "jpg" : format;

    const downloadFile = async (fileName: string, fileBlob: Blob, format: string) => {
        try {
            const blobUrl = createSafeObjectURL(fileBlob);

            const link = document.createElement("a");
            link.style.display = "none";
            link.href = blobUrl;
            const originalName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
            link.download = `${originalName}.${getDownloadExt(format)}`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
        } catch (error) {
            toast.error("Failed to download image safely.");
        }
    };

    const downloadAll = async () => {
        try {
            const JSZip = (await import("jszip")).default;
            const zip = new JSZip();
            const usedNames = new Set<string>();

            const promises = files.map(async ({ file, settings }) => {
                const fileUrl = settings.convertedUrl;
                if (!fileUrl) return;

                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const ext = getDownloadExt(settings.targetFormat);

                let fileName = `${originalName}.${ext}`;
                let counter = 1;
                while (usedNames.has(fileName)) {
                    fileName = `${originalName} (${counter}).${ext}`;
                    counter++;
                }
                usedNames.add(fileName);

                const fileBlob = settings.convertedBlob;
                if (!fileBlob) throw new Error(`Failed to retrieve ${fileName}`);
                zip.file(fileName, fileBlob);
            });

            await Promise.all(promises);

            const content = await zip.generateAsync({ type: "blob" });
            const url = createSafeObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = `converted_images_${new Date().getTime()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error("Failed to download zip file. Please try again.");
        }
    };

    const isCurrentFileConverted = activeFile && activeFile.settings?.convertedUrl;
    const isAllConverted = files.length > 0 && files.every(f => f.settings?.convertedUrl);

    const handlePrimaryAction = () => {
        if (applyToAll && isBatchMode) {
            if (isAllConverted) downloadAll();
            else handleConvert();
        } else {
            if (isCurrentFileConverted && activeFile && activeFile.settings?.convertedBlob) {
                downloadFile(activeFile.file.name, activeFile.settings.convertedBlob, activeFile.settings.targetFormat);
            } else {
                handleConvert();
            }
        }
    };

    const getPrimaryActionText = () => {
        if (status === 'processing') return "Converting...";
        if (applyToAll && isBatchMode) {
            return isAllConverted ? `Download All (${files.length})` : `Convert All (${files.length})`;
        }
        return isCurrentFileConverted ? "Download Image" : "Convert Active File";
    };

    const handleClearAll = () => {
        clearAll();
        clearMemory();
    };

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-xl border border-border bg-white shadow-xl p-4 md:p-8">
                        <ImageUploader onUpload={handleUpload} accept={ACCEPTED_EXTENSIONS} />
                    </div>
                </div>
            )}
            
            <ToolModal
                isOpen={files.length > 0}
                onClose={handleClearAll}
                title="Image Converter"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        <Icon name={(applyToAll && isAllConverted) || (!applyToAll && isCurrentFileConverted) ? "download" : "arrow-right"} size={18} />
                        {getPrimaryActionText()}
                    </span>
                }
                isProcessing={status === 'processing'}
                isSuccess={(applyToAll && isBatchMode) ? isAllConverted : isCurrentFileConverted}
                onDownload={() => {
                    if (applyToAll && isBatchMode) downloadAll();
                    else if (activeFile && activeFile.settings?.convertedBlob) {
                        downloadFile(activeFile.file.name, activeFile.settings.convertedBlob, activeFile.settings.targetFormat);
                    }
                }}
                onStartOver={handleClearAll}
                onWipeMemory={clearMemory}
                customPreview={
                    isCurrentFileConverted ? (
                        <div className="w-full h-full p-4 md:p-8 flex items-center justify-center relative">
                            <img
                                src={activeFile.settings.convertedUrl}
                                alt="Converted Preview"
                                loading="lazy"
                                className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-sm border border-slate-200"
                                style={{ backgroundColor: activeFile.settings?.backgroundColor !== 'transparent' ? activeFile.settings?.backgroundColor : 'transparent' }}
                            />
                            <div className="absolute bottom-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider text-[#0081C9] flex items-center gap-1.5 z-10">
                                <Icon name="check-circle" size={14} /> Converted to {activeFile.settings?.targetFormat.toUpperCase()}
                            </div>
                        </div>
                    ) : undefined
                }
            >
                {activeFile && (
                    <ToolSettingsRenderer
                        title="Convert Settings"
                        isBatchMode={isBatchMode}
                        applyToAll={applyToAll}
                        onApplyToAllChange={setApplyToAll}
                    >
                        <div className="bg-[#E8ECEF] rounded-xl p-4 flex flex-col gap-3 shadow-sm mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <Icon name="file-type-2" size={24} className="text-[#0081C9]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-800 truncate">
                                        Source: {activeFile.file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5">
                                        Size: {(activeFile.file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <SettingGroup title="Output Format">
                            <SelectRow
                                label="Target Format"
                                value={activeFile.settings?.targetFormat}
                                onChange={(val) => handleSettingChange("targetFormat", val)}
                                options={[
                                    { label: "JPG - JPEG Image", value: "jpg" },
                                    { label: "PNG - Portable Network Graphics", value: "png" },
                                    { label: "WebP - Modern Web Image", value: "webp" },
                                    { label: "AVIF - AV1 Image File", value: "avif" },
                                    { label: "TIFF - Tagged Image File", value: "tiff" },
                                    { label: "GIF - Static Action", value: "gif" },
                                    { label: "BMP - Bitmap Image", value: "bmp" },
                                    { label: "ICO - Icon File", value: "ico" }
                                ]}
                            />

                            {/* Format-specific Settings */}
                            {["webp", "avif"].includes(activeFile.settings?.targetFormat) && (
                                <ToggleRow
                                    label="Lossless Encoding"
                                    description="Perfect quality but larger file size"
                                    checked={activeFile.settings?.lossless}
                                    onChange={(val) => handleSettingChange("lossless", val)}
                                />
                            )}

                            {["jpg", "webp", "avif", "tiff"].includes(activeFile.settings?.targetFormat) && !activeFile.settings?.lossless && (
                                <SettingRow label="Quality Range" value={`${activeFile.settings?.quality}%`}>
                                    <div className="relative w-full h-2 rounded-full cursor-pointer bg-slate-200 mt-2">
                                        <div className="absolute top-0 left-0 h-full bg-[#0081C9] rounded-l-full pointer-events-none" style={{ width: `${activeFile.settings?.quality}%` }}></div>
                                        <input
                                            type="range" min="1" max="100"
                                            value={activeFile.settings?.quality}
                                            onChange={(e) => handleSettingChange("quality", parseInt(e.target.value))}
                                            className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-10 h-full"
                                        />
                                        <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full border-[2px] border-[#0081C9] shadow-sm pointer-events-none z-0 mt-[1px]" style={{ left: `calc(${activeFile.settings?.quality}% - 8px)` }}></div>
                                    </div>
                                </SettingRow>
                            )}
                        </SettingGroup>

                        <SettingGroup title="Transparency & Metadata">
                            <div className="flex items-center gap-3 w-full text-sm">
                                <label className="font-medium text-slate-700 flex-1">
                                    Background Fill Color
                                </label>
                                <input
                                    type="color"
                                    value={(!activeFile.settings?.backgroundColor || activeFile.settings?.backgroundColor === 'transparent') ? '#ffffff' : activeFile.settings.backgroundColor}
                                    onChange={(e) => handleSettingChange("backgroundColor", e.target.value)}
                                    disabled={!activeFile.settings?.backgroundColor || activeFile.settings?.backgroundColor === 'transparent'}
                                    className={`h-8 w-12 cursor-pointer border-none bg-transparent rounded-lg ${(!activeFile.settings?.backgroundColor || activeFile.settings?.backgroundColor === 'transparent') ? 'opacity-30' : ''}`}
                                />
                                {["png", "webp", "gif"].includes(activeFile.settings?.targetFormat) && (
                                    <button
                                        onClick={() => handleSettingChange("backgroundColor", (!activeFile.settings?.backgroundColor || activeFile.settings?.backgroundColor === "transparent") ? "#FFFFFF" : "transparent")}
                                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${(!activeFile.settings?.backgroundColor || activeFile.settings?.backgroundColor === "transparent") ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlNWU1IiAvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlNWU1IiAvPgogICAgPC9zdmc+')] bg-repeat text-[#0081C9] border border-[#0081C9]/30 ring-2 ring-[#0081C9] ring-offset-1" : "bg-slate-100 text-muted-foreground hover:bg-slate-200"}`}
                                    >
                                        <span className={(!activeFile.settings?.backgroundColor || activeFile.settings?.backgroundColor === "transparent") ? "bg-white/80 px-1 rounded-sm" : ""}>Transparent</span>
                                    </button>
                                )}
                            </div>
                            <p className="text-muted-foreground mt-1">Replaces transparent pixels with this color.</p>

                            <div className="h-px bg-slate-200/60 my-2 w-full"></div>

                            <ToggleRow
                                label="Preserve Metadata"
                                description="Keep original EXIF data if target format supports it"
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