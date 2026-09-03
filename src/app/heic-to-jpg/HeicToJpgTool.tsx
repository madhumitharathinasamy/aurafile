"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { useFileUpload, type IntegratedFile } from "@/hooks/useFileUpload";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { ToolSettingsRenderer, SettingGroup, SettingRow } from "@/components/tools/ToolSettingsRenderer";
import JSZip from "jszip";
import heic2any from "heic2any";

interface HeicSettings {
    quality: number;
}

const DEFAULT_SETTINGS: HeicSettings = {
    quality: 90,
};

const ACCEPTED_EXTENSIONS = {
    "image/heic": [".heic", ".heif"],
};

// 50MB and 20 Files limit as requested
const MAX_FILE_SIZE = 50 * 1024 * 1024; 
const MAX_FILES = 20;

export default function HeicToJpgTool() {
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

                for (let i = 0; i < batchMeta.length; i++) {
                    const fileMeta = batchMeta[i];
                    
                    try {
                        let fileToProcess = fileMeta.file;
                        
                        // Explicitly convert File to a Blob with forced MIME type. 
                        // Windows often returns "" for file.type on .heic files, which crashes heic2any's worker.
                        const pureBlob = new Blob([fileMeta.file], { type: "image/heic" });

                        // Use exact ConvertTool.tsx syntax
                        const heicBlob = await heic2any({
                            blob: fileMeta.file,
                            toType: "image/jpeg",
                            quality: 0.9
                        });

                        // Handle potential array return (animations/bursts)
                        const finalBlob = Array.isArray(heicBlob) ? heicBlob[0] : heicBlob;
                        const convertedUrl = createSafeObjectURL(finalBlob as Blob);

                        updateFileSettings(fileMeta.id, {
                            convertedUrl,
                            convertedBlob: finalBlob
                        });
                        
                        successCount++;
                    } catch (e: any) {
                        console.error(`Conversion failed for ${fileMeta.file.name}:`, e);
                        
                        let errorMessage = "Unknown error occurred";
                        if (e instanceof Error) errorMessage = e.message;
                        else if (typeof e === 'string') errorMessage = e;
                        else if (e && e.message) errorMessage = e.message;

                        if (errorMessage.toLowerCase().includes("not a valid heif file") || errorMessage.toLowerCase().includes("unsupported")) {
                            toast.error(`"${fileMeta.file.name}" is not a valid HEIC file or is corrupted.`);
                        } else {
                            toast.error(`Error converting ${fileMeta.file.name}: ${errorMessage}`);
                        }
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

        const remainingSlots = MAX_FILES - files.length;

        if (remainingSlots <= 0) {
            toast.error(`Maximum ${MAX_FILES} files limit reached.`);
            return;
        }

        const filesToAdd = uniqueFiles.slice(0, remainingSlots);
        const skippedCount = uniqueFiles.length - filesToAdd.length;

        if (filesToAdd.length > 0) {
            addFiles(filesToAdd, { ...DEFAULT_SETTINGS });
            if (skippedCount > 0) {
                toast.warning(`Added ${filesToAdd.length} files. Skipped ${skippedCount} (Limit ${MAX_FILES}).`);
            }
        } else if (uniqueFiles.length < newFiles.length && skippedCount === 0) {
            toast.info("Duplicate files were skipped.");
        }

        if (files.length + filesToAdd.length > 1) {
            setApplyToAll(true);
        }
    };

    const handleApplyToAllChange = (checked: boolean) => {
        setApplyToAll(checked);
        if (checked && activeFile) {
            updateAllFileSettings({
                ...activeFile.settings,
                convertedUrl: null,
                convertedBlob: null
            });
        }
    };

    const handleSettingChange = (key: keyof HeicSettings, value: string | number | boolean) => {
        if (!activeFile) return;

        const finalUpdates: any = { [key]: value };

        if (applyToAll && isBatchMode) {
            updateAllFileSettings({ ...finalUpdates, convertedUrl: null, convertedBlob: null });
        } else {
            updateFileSettings(activeFile.id, { ...finalUpdates, convertedUrl: null, convertedBlob: null });
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        const filesToProcess = applyToAll && isBatchMode ? files : activeFile ? [activeFile] : [];
        
        filesToProcess.forEach(f => {
            updateFileSettings(f.id, { convertedUrl: null, convertedBlob: null });
        });

        processFiles(filesToProcess.map(f => f.file));
    };

    const downloadFile = async (fileName: string, fileBlob: Blob) => {
        try {
            const blobUrl = createSafeObjectURL(fileBlob);

            const link = document.createElement("a");
            link.style.display = "none";
            link.href = blobUrl;
            const originalName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
            link.download = `${originalName}.jpg`;
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
            const zip = new JSZip();
            const usedNames = new Set<string>();

            const promises = files.map(async ({ file, settings }) => {
                const fileUrl = settings.convertedUrl;
                if (!fileUrl) return;

                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const ext = "jpg";

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
                downloadFile(activeFile.file.name, activeFile.settings.convertedBlob);
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
        return isCurrentFileConverted ? "Download JPG" : "Convert to JPG";
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
                        <ImageUploader 
                            onUpload={handleUpload} 
                            accept={ACCEPTED_EXTENSIONS} 
                            maxSize={MAX_FILE_SIZE}
                            maxFiles={MAX_FILES}
                            title="Drag & drop HEIC images here"
                            description="Supports .HEIC and .HEIF formats from Apple devices"
                            subDescription={`(Max ${MAX_FILES} files, ${MAX_FILE_SIZE / 1024 / 1024}MB)`}
                        />
                    </div>
                </div>
            )}
            
            <ToolModal
                isOpen={files.length > 0}
                onClose={handleClearAll}
                title="HEIC to JPG Converter"
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
                        downloadFile(activeFile.file.name, activeFile.settings.convertedBlob);
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
                            />
                            <div className="absolute bottom-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider text-[#0081C9] flex items-center gap-1.5 z-10">
                                <Icon name="check-circle" size={14} /> Converted to JPG
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
                        onApplyToAllChange={handleApplyToAllChange}
                    >
                        <div className="bg-[#E8ECEF] rounded-xl p-4 flex flex-col gap-3 shadow-sm mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <Icon name="apple" size={24} className="text-[#0081C9]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-800 truncate">
                                        File: {activeFile.file.name}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5">
                                        Size: {(activeFile.file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <SettingGroup title="Output Quality">
                            <SettingRow label="JPG Quality" value={`${activeFile.settings?.quality}%`}>
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
                            <p className="text-muted-foreground mt-2 text-xs">
                                Adjusting quality controls the final file size of the JPG. 90% is highly recommended.
                            </p>
                        </SettingGroup>
                    </ToolSettingsRenderer>
                )}
            </ToolModal>
        </div>
    );
}
