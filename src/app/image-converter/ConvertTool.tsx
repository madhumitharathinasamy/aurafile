"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { ImageComparison } from "@/components/tools/ImageComparison";
import { useFileUpload, type IntegratedFile } from "@/hooks/useFileUpload";
import { ToolSettingsRenderer, SettingGroup, SelectRow, SettingRow, ToggleRow } from "@/components/tools/ToolSettingsRenderer";


const ACCEPTED_EXTENSIONS = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/gif": [".gif"],
    "image/tiff": [".tiff", ".tif"],
    "image/avif": [".avif"],
    "image/bmp": [".bmp"],
    "image/x-icon": [".ico"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB



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

    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [convertedFiles, setConvertedFiles] = useState<{ [key: string]: string }>({});
    const [convertedBlobs, setConvertedBlobs] = useState<{ [key: string]: Blob }>({});
    const [applyToAll, setApplyToAll] = useState(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setConvertedFiles(prev => {
                Object.values(prev).forEach(url => URL.revokeObjectURL(url));
                return {};
            });
        };
    }, []);

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
        if (Object.keys(convertedFiles).length > 0) {
            Object.values(convertedFiles).forEach(url => URL.revokeObjectURL(url));
            setConvertedFiles({});
            setConvertedBlobs({});
        }

        if (applyToAll && isBatchMode) {
            updateAllFileSettings(finalUpdates);
        } else {
            updateFileSettings(activeFile.id, finalUpdates);
        }
    };

    const processSingleFile = async (integratedFile: IntegratedFile) => {
        try {
            // Setup target options
            const conversionFormat = integratedFile.settings.targetFormat.toLowerCase();
            const mimeType = `image/${conversionFormat === 'jpg' ? 'jpeg' : conversionFormat}`;

            let sourceFile: File | Blob = integratedFile.file;

            // Note: browser-image-compression is primarily for compression, 
            // but we can use it for fileType conversion between web-safe formats
            const options = {
                useWebWorker: true,
                maxSizeMB: 50, // Don't significantly compress
                initialQuality: integratedFile.settings.quality / 100, // Still apply their requested quality
                fileType: mimeType
            };

            const imageCompression = (await import("browser-image-compression")).default;
            const resultFile = await imageCompression(integratedFile.file, options);

            const convertedUrl = URL.createObjectURL(resultFile);

            setConvertedFiles(prev => ({
                ...prev,
                [integratedFile.id]: convertedUrl
            }));
            setConvertedBlobs(prev => ({
                ...prev,
                [integratedFile.id]: resultFile
            }));
            return true;
        } catch (e: any) {
            console.error("Conversion Error:", e);
            toast.error(`Error converting ${integratedFile.file.name}: ${e?.message || e?.toString() || "Unknown error"}`);
            return false;
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setIsConverting(true);
        // Clean up previous URLs
        Object.values(convertedFiles).forEach(url => URL.revokeObjectURL(url));
        setConvertedFiles({});
        setConvertedBlobs({});

        let successCount = 0;
        let errorCount = 0;

        if (applyToAll && isBatchMode) {

            // Phase 3 Memory Monitor: Fallback to Sequential Processing
            const totalBytes = files.reduce((acc, f) => acc + f.file.size, 0);
            const isHeavyBatch = totalBytes > 1024 * 1024 * 1024; // > 1GB

            if (isHeavyBatch) {
                toast.warning(`Large batch detected (${(totalBytes / 1024 / 1024).toFixed(0)}MB). Using deep sequential processing to save memory...`);
            } else {
                toast.info(`Starting conversion of ${files.length} files...`);
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (isHeavyBatch) {
                    toast.info(`Processing ${i + 1}/${files.length}...`);
                    // Extra tick for garbage collection on heavy batches
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                const success = await processSingleFile(file);
                if (success) successCount++;
                else errorCount++;
            }
        } else {
            if (!activeFile) return;
            toast.info(`Converting ${activeFile.file.name}...`);
            const success = await processSingleFile(activeFile);
            if (success) successCount++;
            else errorCount++;
        }

        setIsConverting(false);

        if (successCount === 0) {
            toast.error("Failed to convert files. Please try again.");
        } else if (errorCount > 0) {
            toast.warning(`Converted ${successCount} files. ${errorCount} failed.`);
        } else {
            toast.success(`Successfully converted ${successCount} files!`);
        }
    };

    const getDownloadExt = (format: string) => format === "jpeg" ? "jpg" : format;

    const downloadFile = async (fileName: string, fileBlob: Blob, format: string) => {
        try {
            const blobUrl = URL.createObjectURL(fileBlob);

            const link = document.createElement("a");
            link.style.display = "none";
            link.href = blobUrl;
            const originalName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
            link.download = `${originalName}.${getDownloadExt(format)}`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
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

            const promises = files.map(async ({ id, file, settings }) => {
                const fileUrl = convertedFiles[id];
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

                const fileBlob = convertedBlobs[id];
                if (!fileBlob) throw new Error(`Failed to retrieve ${fileName}`);
                zip.file(fileName, fileBlob);
            });

            await Promise.all(promises);

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = `converted_images_${new Date().getTime()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to download zip file. Please try again.");
        }
    };

    const isCurrentFileConverted = activeFile && convertedFiles[activeFile.id];
    const isAllConverted = files.length > 0 && files.every(f => convertedFiles[f.id]);

    const handlePrimaryAction = () => {
        if (applyToAll && isBatchMode) {
            if (isAllConverted) downloadAll();
            else handleConvert();
        } else {
            if (isCurrentFileConverted && activeFile && convertedBlobs[activeFile.id]) {
                downloadFile(activeFile.file.name, convertedBlobs[activeFile.id], activeFile.settings.targetFormat);
            } else {
                handleConvert();
            }
        }
    };

    const getPrimaryActionText = () => {
        if (isConverting) return "Converting...";
        if (applyToAll && isBatchMode) {
            return isAllConverted ? `Download All (${files.length})` : `Convert All (${files.length})`;
        }
        return isCurrentFileConverted ? "Download Image" : "Convert Active File";
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
                onClose={clearAll}
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
                isProcessing={isConverting}
                customPreview={
                    isCurrentFileConverted ? (
                        <div className="w-full h-full p-4 md:p-8 flex items-center justify-center relative">
                            <img
                                src={convertedFiles[activeFile.id]}
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
                                    value={activeFile.settings?.backgroundColor === 'transparent' ? '#ffffff' : activeFile.settings?.backgroundColor}
                                    onChange={(e) => handleSettingChange("backgroundColor", e.target.value)}
                                    disabled={activeFile.settings?.backgroundColor === 'transparent'}
                                    className="h-8 w-12 cursor-pointer border-none bg-transparent rounded-lg"
                                />
                                {["png", "webp", "gif"].includes(activeFile.settings?.targetFormat) && (
                                    <button
                                        onClick={() => handleSettingChange("backgroundColor", activeFile.settings?.backgroundColor === "transparent" ? "#FFFFFF" : "transparent")}
                                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${activeFile.settings?.backgroundColor === "transparent" ? "bg-[#0081C9]/10 text-[#0081C9]" : "bg-slate-100 text-muted-foreground hover:bg-slate-200"}`}
                                    >
                                        Transparent
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
