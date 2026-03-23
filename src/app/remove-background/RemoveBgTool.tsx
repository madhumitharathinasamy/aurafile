"use client";

import { useState, useEffect, useRef } from "react";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";

import { useFileUpload } from "@/hooks/useFileUpload";
import { ToolSettingsRenderer, SettingGroup, ToggleRow, SelectRow, SettingRow } from "@/components/tools/ToolSettingsRenderer";
import { ImageComparison } from "@/components/tools/ImageComparison";

interface RemoveBgSettings {
    model: "small" | "medium" | "large";
    bgType: "transparent" | "color" | "blur";
    bgColor: string;
    blurAmount: number;
    format: "image/png" | "image/jpeg";
    edgeFeathering: boolean;
}

const DEFAULT_SETTINGS: RemoveBgSettings = {
    model: "medium",
    bgType: "transparent",
    bgColor: "#FFFFFF",
    blurAmount: 10,
    format: "image/png",
    edgeFeathering: true
};

export default function RemoveBgTool() {
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
    const [progress, setProgress] = useState<string>("");
    const [longLoading, setLongLoading] = useState(false);

    // Store original blobs and transparent cutout blobs
    const [cutoutBlobs, setCutoutBlobs] = useState<{ [id: string]: Blob }>({});
    const [finalUrls, setFinalUrls] = useState<{ [id: string]: string }>({});

    // Timeout for long loading message
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isProcessing) {
            setLongLoading(false);
            timer = setTimeout(() => {
                setLongLoading(true);
            }, 20000);
        }
        return () => clearTimeout(timer);
    }, [isProcessing]);

    // Re-render final image whenever settings change, IF we have a cutout
    useEffect(() => {
        if (!activeFile) return;
        const cutout = cutoutBlobs[activeFile.id];
        if (cutout && activeFile.settings.isDone) {
            applyPostProcessing(activeFile.file, cutout, activeFile.settings, activeFile.id);
        }
    }, [activeFile?.settings, cutoutBlobs]);

    // Cleanup URLs
    useEffect(() => {
        return () => {
            Object.values(finalUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const handleUpload = (uploadedFiles: File[]) => {
        if (files.length > 0) {
            toast.error("Background tool only supports one image at a time.");
            return;
        }
        addFiles([uploadedFiles[0]], {
            ...DEFAULT_SETTINGS,
            isDone: false
        });
    };

    const handleSettingChange = (key: keyof RemoveBgSettings, value: any) => {
        if (!activeFile) return;

        const updates = { [key]: value };
        if (key === 'bgType' && value === 'transparent') {
            updates.format = 'image/png';
        } else if (key === 'bgType' && value === 'color' && activeFile.settings.format === 'image/png') {
            updates.format = 'image/jpeg';
        }

        updateFileSettings(activeFile.id, updates);
    };

    const applyPostProcessing = async (originalFile: File, cutoutBlob: Blob, settings: any, fileId: string) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const origImg = new Image();
        const cutoutImg = new Image();

        const loadImg = (img: HTMLImageElement, src: string) => new Promise((resolve) => {
            img.onload = resolve;
            img.src = src;
        });

        const origUrl = URL.createObjectURL(originalFile);
        const cutoutUrl = URL.createObjectURL(cutoutBlob);

        await Promise.all([
            loadImg(origImg, origUrl),
            loadImg(cutoutImg, cutoutUrl)
        ]);

        URL.revokeObjectURL(origUrl);
        URL.revokeObjectURL(cutoutUrl);

        canvas.width = origImg.width;
        canvas.height = origImg.height;

        if (settings.bgType === "color") {
            ctx.fillStyle = settings.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (settings.bgType === "blur") {
            ctx.filter = `blur(${settings.blurAmount}px)`;
            ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
            ctx.filter = "none";
        }

        ctx.drawImage(cutoutImg, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((finalBlob) => {
            if (finalBlob) {
                const url = URL.createObjectURL(finalBlob);
                setFinalUrls(prev => {
                    const old = prev[fileId];
                    if (old) URL.revokeObjectURL(old);
                    return { ...prev, [fileId]: url };
                });
            }
        }, settings.format, 0.95);
    };

    const handleProcess = async () => {
        if (!activeFile || activeFile.settings.isDone) return;

        setIsProcessing(true);
        setProgress("Loading AI model…");

        try {
            const { removeBackground } = await import("@imgly/background-removal");

            // Track downloaded bytes to show model download progress
            const downloadedBytes: { [key: string]: number } = {};
            const totalBytes: { [key: string]: number } = {};

            const config = {
                model: activeFile.settings.model as any,
                progress: (key: string, current: number, total: number) => {
                    if (key.startsWith("fetch:")) {
                        // Model download progress — show MB downloaded
                        downloadedBytes[key] = current;
                        totalBytes[key] = total;
                        const totalDl = Object.values(downloadedBytes).reduce((a, b) => a + b, 0);
                        const totalAll = Object.values(totalBytes).reduce((a, b) => a + b, 0);
                        if (totalAll > 0) {
                            const pct = Math.round((totalDl / totalAll) * 100);
                            const mb = (totalDl / 1024 / 1024).toFixed(1);
                            const totalMb = (totalAll / 1024 / 1024).toFixed(1);
                            setProgress(`Downloading AI model… ${mb} / ${totalMb} MB (${pct}%)`);
                        } else {
                            setProgress("Downloading AI model… (cached)");
                        }
                    } else if (key === "compute:inference") {
                        const percent = Math.round((current / total) * 100);
                        setProgress(`Removing background… ${percent}%`);
                    }
                },
                debug: false
            };

            const blob = await removeBackground(activeFile.file, config);

            // Store the pure transparent cutout
            setCutoutBlobs(prev => ({ ...prev, [activeFile.id]: blob }));

            updateFileSettings(activeFile.id, {
                isDone: true
            });

            setProgress("Applying final touches…");
            await applyPostProcessing(activeFile.file, blob, activeFile.settings, activeFile.id);

            toast.success("Background removed successfully!");
        } catch (error) {
            toast.error("Failed to remove background. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress("");
            setLongLoading(false);
        }
    };

    const handleDownload = () => {
        const urlToDownload = finalUrls[activeFile?.id || ""];
        if (!urlToDownload || !activeFile) return;

        const link = document.createElement("a");
        link.href = urlToDownload;
        const baseName = activeFile.file.name.substring(0, activeFile.file.name.lastIndexOf('.')) || activeFile.file.name;
        const ext = activeFile.settings.format === "image/png" ? "png" : "jpg";
        link.download = `nobg_${baseName}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isDone = activeFile?.settings?.isDone;
    const finalUrl = activeFile ? finalUrls[activeFile.id] : undefined;

    const customPreview = activeFile ? (
        <div className="w-full h-full p-4 md:p-8 flex items-center justify-center relative bg-[linear-gradient(45deg,#f8f9fa_25%,transparent_25%,transparent_75%,#f8f9fa_75%,#f8f9fa),linear-gradient(45deg,#f8f9fa_25%,transparent_25%,transparent_75%,#f8f9fa_75%,#f8f9fa)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-white">
            {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md z-50 text-center p-6 gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0081C9] border-t-transparent" />
                    <div>
                        <p className="text-slate-800 font-semibold text-sm">{progress || "Preparing…"}</p>
                        {progress.includes("Downloading") && (
                            <p className="text-muted-foreground text-xs mt-1">The AI model is cached after the first download.</p>
                        )}
                        {progress.includes("Removing") && (
                            <p className="text-muted-foreground text-xs mt-1">Analysing edges and subject…</p>
                        )}
                        {!progress.includes("Downloading") && !progress.includes("Removing") && (
                            <p className="text-muted-foreground text-xs mt-1">This may take up to 20 seconds on first use.</p>
                        )}
                    </div>
                </div>
            )}

            {isDone && finalUrl ? (
                <ImageComparison
                    beforeImage={activeFile.previewUrl}
                    afterImage={finalUrl}
                />
            ) : (
                <img
                    src={activeFile.previewUrl}
                    alt="Preview"
                    loading="lazy"
                    className="max-w-full max-h-full object-contain drop-shadow-sm pointer-events-none"
                    style={{ opacity: isProcessing ? 0.3 : 1 }}
                />
            )}
        </div>
    ) : null;

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-xl border border-border bg-white shadow-xl p-4 md:p-8">
                        <ImageUploader onUpload={handleUpload} />
                        <div className="mt-8 rounded-xl bg-[#0081C9]/5 p-4 text-sm text-[#0081C9] border border-[#0081C9]/20 flex gap-3 mx-auto max-w-2xl">
                            <Icon name="wand-2" size={20} className="flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>100% Client-Side Privacy:</strong> Backgrounds are removed securely on your device. Images are never uploaded to a cloud server.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                title="Remove Background"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={isDone ? handleDownload : handleProcess}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        <Icon name={isDone ? "download" : "wand-2"} size={18} />
                        {isDone ? "Download Image" : "Remove Background"}
                    </span>
                }
                isProcessing={isProcessing}
                customPreview={customPreview}
            >
                {activeFile && (
                    <ToolSettingsRenderer
                        title="Background Options"
                        isBatchMode={false}
                    >
                        {/* Status Check */}
                        <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors mb-6 shadow-sm ${isDone ? 'bg-green-50 border-green-200' : 'bg-[#E8ECEF] border-transparent'}`}>
                            <div className={`p-2 rounded-full ${isDone ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-muted-foreground'}`}>
                                <Icon name={isDone ? "check" : "image"} size={20} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${isDone ? 'text-green-800' : 'text-slate-800'}`}>
                                    {isDone ? "Foreground Isolated!" : "Ready for Processing"}
                                </h3>
                                <p className="text-muted-foreground mt-0.5">
                                    {isDone ? "Tweak the background or download." : "Configure settings and click Remove."}
                                </p>
                            </div>
                        </div>

                        <SettingGroup title="AI Model Setup">
                            <SelectRow
                                label="AI Model Detail"
                                value={activeFile.settings?.model}
                                onChange={(val) => handleSettingChange("model", val)}
                                disabled={isDone}
                                options={[
                                    { label: "Medium (Recommended)", value: "medium" },
                                    { label: "Small (Faster, Less detail)", value: "small" },
                                    { label: "Large (Slower, Highest detail)", value: "large" }
                                ]}
                            />
                            <p className="text-muted-foreground mt-1">If the result misses small details like hair, try Large mode and re-process.</p>

                            {isDone && (
                                <button
                                    onClick={() => updateFileSettings(activeFile.id, { isDone: false })}
                                    className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-200"
                                >
                                    Re-Run AI Model
                                </button>
                            )}
                        </SettingGroup>

                        <SettingGroup title="Output Background">
                            <SelectRow
                                label="Background Type"
                                value={activeFile.settings?.bgType}
                                onChange={(val) => handleSettingChange("bgType", val)}
                                options={[
                                    { label: "Transparent", value: "transparent" },
                                    { label: "Solid Color", value: "color" },
                                    { label: "Blur Original", value: "blur" }
                                ]}
                            />

                            {activeFile.settings?.bgType === "color" && (
                                <div className="flex items-center gap-3 w-full text-sm pt-2">
                                    <label className="font-medium text-slate-700 flex-1">
                                        Color Value
                                    </label>
                                    <input
                                        type="color"
                                        value={activeFile.settings?.bgColor}
                                        onChange={(e) => handleSettingChange("bgColor", e.target.value)}
                                        className="h-8 w-12 cursor-pointer border-none bg-transparent rounded-lg"
                                    />
                                </div>
                            )}

                            {activeFile.settings?.bgType === "blur" && (
                                <SettingRow label="Blur Intensity" value={`${activeFile.settings?.blurAmount}px`}>
                                    <input
                                        type="range"
                                        min="2"
                                        max="50"
                                        value={activeFile.settings?.blurAmount}
                                        onChange={(e) => handleSettingChange("blurAmount", parseInt(e.target.value))}
                                        className="w-full accent-[#0081C9]"
                                    />
                                </SettingRow>
                            )}
                        </SettingGroup>

                        <SettingGroup title="Export Format">
                            <SelectRow
                                label="Format"
                                value={activeFile.settings?.format}
                                onChange={(val) => handleSettingChange("format", val)}
                                disabled={activeFile.settings?.bgType === "transparent"} // Force PNG if transparent
                                options={[
                                    { label: "PNG Image", value: "image/png" },
                                    { label: "JPG Image", value: "image/jpeg" }
                                ]}
                            />
                            {activeFile.settings?.bgType === "transparent" && (
                                <p className="text-[10px] uppercase text-muted-foreground mt-1">Locked to PNG to preserve transparency</p>
                            )}

                            <div className="pt-2">
                                <ToggleRow
                                    label="Edge Feathering"
                                    description="Smooth hard edges slightly"
                                    checked={activeFile.settings?.edgeFeathering}
                                    onChange={(val) => handleSettingChange("edgeFeathering", val)}
                                />
                            </div>
                        </SettingGroup>

                    </ToolSettingsRenderer>
                )}
            </ToolModal>
        </div>
    );
}
