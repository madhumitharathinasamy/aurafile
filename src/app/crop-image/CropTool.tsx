"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop,
    convertToPercentCrop
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ImageUploader } from "@/components/tools/ImageUploader";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ToolSettingsRenderer, SettingGroup, SettingRow } from "@/components/tools/ToolSettingsRenderer";
import { saveAs } from "file-saver";

type AspectRatio = {
    label: string;
    value: number | undefined;
    icon?: string;
};

const ASPECT_RATIOS: AspectRatio[] = [
    { label: "Free", value: undefined, icon: "minimize" },
    { label: "Original", value: 0, icon: "image" },
    { label: "Square (1:1)", value: 1, icon: "square" },
    { label: "4:3", value: 4 / 3 },
    { label: "16:9", value: 16 / 9 },
    { label: "3:2", value: 3 / 2 },
    { label: "Story", value: 9 / 16 },
    { label: "Portrait", value: 4 / 5 },
];

export default function CropTool() {
    const {
        files,
        activeIndex,
        setActiveIndex,
        activeFile,
        addFiles,
        clearAll,
        updateFileSettings,
        updateAllFileSettings
    } = useFileUpload([]);

    const imgRef = useRef<HTMLImageElement>(null);

    // Crop State (Local to avoid lag during drag)
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    // Settings
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [selectedRatioLabel, setSelectedRatioLabel] = useState<string>("Free");
    const [scale, setScale] = useState({ x: 1, y: 1 });
    const [rotate, setRotate] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [isCircular, setIsCircular] = useState(false);
    const [showGrid, setShowGrid] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [applyToAll, setApplyToAll] = useState(false);
    const [croppedUrls, setCroppedUrls] = useState<{ [id: string]: string }>({});
    const [croppedBlobs, setCroppedBlobs] = useState<{ [id: string]: Blob }>({});

    // Local inputs mapping
    const [widthInput, setWidthInput] = useState("");
    const [heightInput, setHeightInput] = useState("");
    const [isInputActive, setIsInputActive] = useState(false);

    const croppedUrlsRef = useRef(croppedUrls);
    useEffect(() => {
        croppedUrlsRef.current = croppedUrls;
    }, [croppedUrls]);

    // Cleanup URLs
    useEffect(() => {
        return () => {
            Object.values(croppedUrlsRef.current).forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    // Synchronize settings when switching active files
    // If we wanted true per-file persistence of crop boxes, we'd load them from activeFile.settings here.
    // For simplicity and standard batch tool flow, we let the user manipulate the active one and choose to apply it globally or just export it.
    useEffect(() => {
        if (activeFile && imgRef.current) {
            // Re-trigger load to calculate default crop for this new active file
            // if we don't have a crop yet
            if (!crop) {
                const { width, height, naturalWidth, naturalHeight } = imgRef.current;
                if (width && height) {
                    const sX = naturalWidth / width;
                    const sY = naturalHeight / height;
                    setScale({ x: sX, y: sY });

                    const initialCrop = centerCrop(
                        makeAspectCrop(
                            { unit: 'px', width: width * 0.9 },
                            aspect || naturalWidth / naturalHeight,
                            width,
                            height
                        ),
                        width,
                        height
                    );
                    setCrop(initialCrop);
                    setCompletedCrop(initialCrop);
                }
            }
        }
    }, [activeIndex, activeFile, aspect, crop]);


    useEffect(() => {
        if (!isInputActive && completedCrop && scale.x > 0 && scale.y > 0) {
            setWidthInput(Math.round(completedCrop.width * scale.x).toString());
            setHeightInput(Math.round(completedCrop.height * scale.y).toString());
        }
    }, [completedCrop, scale, isInputActive]);

    const handleUpload = (uploadedFiles: File[]) => {
        setCroppedUrls(prev => {
            Object.values(prev).forEach(url => URL.revokeObjectURL(url));
            return {};
        });
        setCroppedBlobs({});

        const uniqueFiles = uploadedFiles.filter(newFile =>
            !files.some(existing => existing.file.name === newFile.name && existing.file.size === newFile.size)
        );

        // Ensure default settings are applied properly, including isCropped
        const enrichedFiles = uniqueFiles.map(file => ({
            file,
            settings: { isCropped: false }
        }));

        addFiles(uniqueFiles, { isCropped: false });

        // Reset crop settings on new generic upload if list was empty
        if (files.length === 0) {
            setCrop(undefined);
            setCompletedCrop(undefined);
            setRotate(0);
            setFlipH(false);
            setFlipV(false);
            setAspect(undefined);
            setSelectedRatioLabel("Free");
            setIsCircular(false);
        }
    };

    const handleSettingChange = (updates: any) => {
        if (!activeFile) return;

        setCroppedUrls(prev => {
            const newUrls = { ...prev };
            if (applyToAll && files.length > 1) {
                Object.values(newUrls).forEach(url => URL.revokeObjectURL(url));
                setCroppedBlobs({});
                return {};
            } else if (newUrls[activeFile.id]) {
                URL.revokeObjectURL(newUrls[activeFile.id]);
                delete newUrls[activeFile.id];
                setCroppedBlobs(b => { const nb = { ...b }; delete nb[activeFile.id]; return nb; });
            }
            return newUrls;
        });

        if (applyToAll && files.length > 1) {
            updateAllFileSettings({ ...updates, isCropped: false });
        } else {
            updateFileSettings(activeFile.id, { ...updates, isCropped: false });
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        handleSettingChange({}); // Triggers isCropped resetting
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
        const sX = naturalWidth / width;
        const sY = naturalHeight / height;
        setScale({ x: sX, y: sY });

        const initialCrop = centerCrop(
            makeAspectCrop(
                { unit: 'px', width: width * 0.9 },
                aspect || naturalWidth / naturalHeight,
                width,
                height
            ),
            width,
            height
        );
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    };

    const handleAspectRatioChange = (ratio: AspectRatio) => {
        handleSettingChange({});
        setSelectedRatioLabel(ratio.label);
        if (ratio.label === "Original" && imgRef.current) {
            const { width, height, naturalWidth, naturalHeight } = imgRef.current;
            const val = naturalWidth / naturalHeight;
            setAspect(val);
            const newCrop: Crop = { unit: 'px', x: 0, y: 0, width, height };
            setCrop(newCrop);
            setCompletedCrop(convertToPixelCrop(newCrop, width, height));
        } else {
            setAspect(ratio.value);
            if (ratio.value && imgRef.current && completedCrop) {
                const { width, height } = imgRef.current;
                const newCrop = centerCrop(
                    makeAspectCrop(
                        { unit: 'px', width: completedCrop.width || width * 0.9 },
                        ratio.value,
                        width,
                        height
                    ),
                    width,
                    height
                );
                setCrop(newCrop);
                setCompletedCrop(newCrop);
            }
        }
    };

    const handleDimensionChange = (type: 'width' | 'height', valueStr: string) => {
        handleSettingChange({});
        if (type === 'width') setWidthInput(valueStr);
        else setHeightInput(valueStr);

        const value = parseFloat(valueStr);
        if (isNaN(value) || !imgRef.current || !crop) return;

        const displayValue = type === 'width' ? value / scale.x : value / scale.y;
        const newCrop = { ...crop, unit: 'px' as const };

        if (type === 'width') {
            newCrop.width = displayValue;
            if (aspect) newCrop.height = newCrop.width / aspect;
        } else {
            newCrop.height = displayValue;
            if (aspect) newCrop.width = newCrop.height * aspect;
        }

        const { width: imgW, height: imgH } = imgRef.current;
        const currentCenter = { x: crop.x + crop.width / 2, y: crop.y + crop.height / 2 };

        newCrop.x = Math.max(0, Math.min(currentCenter.x - newCrop.width / 2, imgW - newCrop.width));
        newCrop.y = Math.max(0, Math.min(currentCenter.y - newCrop.height / 2, imgH - newCrop.height));

        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, imgW, imgH));
    };

    const canvasUtils = async (
        imageSource: HTMLImageElement | File,
        cropParams: { x: number, y: number, width: number, height: number, unit: 'px' | '%' },
        rotation = 0,
        flip = { horizontal: false, vertical: false },
        circular = false
    ): Promise<{ url: string, blob: Blob } | null> => {

        return new Promise((resolve, reject) => {
            const img = new Image();

            const handleDraw = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject("No context");
                    return;
                }

                const radians = (rotation * Math.PI) / 180;

                // Calculate absolute crop coordinates based on unit
                let absX = cropParams.x;
                let absY = cropParams.y;
                let absW = cropParams.width;
                let absH = cropParams.height;

                if (cropParams.unit === '%') {
                    absX = (cropParams.x / 100) * img.naturalWidth;
                    absY = (cropParams.y / 100) * img.naturalHeight;
                    absW = (cropParams.width / 100) * img.naturalWidth;
                    absH = (cropParams.height / 100) * img.naturalHeight;
                }

                canvas.width = Math.floor(absW);
                canvas.height = Math.floor(absH);

                ctx.imageSmoothingQuality = 'high';
                ctx.save();

                ctx.translate(-absX, -absY);
                ctx.translate(img.naturalWidth / 2, img.naturalHeight / 2);
                ctx.rotate(radians);
                ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
                ctx.translate(-img.naturalWidth / 2, -img.naturalHeight / 2);
                ctx.drawImage(img, 0, 0);
                ctx.restore();

                if (circular) {
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tCtx = tempCanvas.getContext('2d');

                    if (tCtx) {
                        tCtx.drawImage(canvas, 0, 0);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.beginPath();
                        ctx.ellipse(
                            canvas.width / 2, canvas.height / 2,
                            canvas.width / 2, canvas.height / 2,
                            0, 0, 2 * Math.PI
                        );
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(tempCanvas, 0, 0);
                    }
                }

                // Output format logic
                let outFormat = 'image/jpeg';
                if (imageSource instanceof File) {
                    if (imageSource.type === 'image/png' || imageSource.type === 'image/webp') {
                        outFormat = imageSource.type;
                    }
                }

                if (circular) {
                    outFormat = 'image/png';
                }

                canvas.toBlob((blob) => {
                    if (!blob) resolve(null);
                    else resolve({ url: URL.createObjectURL(blob), blob });
                }, outFormat, 0.95);
            };

            if (imageSource instanceof File) {
                const url = URL.createObjectURL(imageSource);
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    handleDraw();
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject("Image load error");
                }
                img.src = url;
            } else {
                img.src = imageSource.src;
                handleDraw();
            }
        });
    };

    const performCrop = async () => {
        if (!completedCrop || !imgRef.current || !activeFile) return;
        setIsProcessing(true);

        // Clear previous urls
        setCroppedUrls(prev => {
            Object.values(prev).forEach(url => URL.revokeObjectURL(url));
            return {};
        });

        try {
            const newUrls: { [id: string]: string } = {};
            const newBlobs: { [id: string]: Blob } = {};

            // To apply to all files of varying sizes, we must convert the current pixel crop to a percentage crop
            const percentCrop = convertToPercentCrop(completedCrop, imgRef.current.width, imgRef.current.height);

            const filesToProcess = applyToAll ? files : [activeFile];

            for (const fileMeta of filesToProcess) {
                // Determine whether to use absolute pixels (exact same bounding box) or percentage.
                // Percentage is vastly safer for batching images of different sizes.
                const cropParams = applyToAll
                    ? { ...percentCrop, unit: '%' as const }
                    : { ...completedCrop, unit: 'px' as const };

                // If single file processing, we can use imgRef directly to save a reload.
                // But for safety and consistency, we'll re-load if it's not the active one.
                const source = (fileMeta.id === activeFile.id) ? imgRef.current : fileMeta.file;

                const result = await canvasUtils(source, cropParams, rotate, { horizontal: flipH, vertical: flipV }, isCircular);

                if (result) {
                    newUrls[fileMeta.id] = result.url;
                    newBlobs[fileMeta.id] = result.blob;
                    updateFileSettings(fileMeta.id, { isCropped: true });
                } else {
                }
            }

            setCroppedUrls(prev => ({ ...prev, ...newUrls }));
            setCroppedBlobs(prev => ({ ...prev, ...newBlobs }));
            toast.success("Crop applied successfully! Ready to download.");

        } catch (error) {
            toast.error("Failed to crop image.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        try {
            if (applyToAll && files.length > 1) {
                const JSZip = (await import("jszip")).default;
                const zip = new JSZip();
                const promises = files.map(async (fileMeta) => {
                    if (!fileMeta.settings?.isCropped || !croppedBlobs[fileMeta.id]) return;
                    const blob = croppedBlobs[fileMeta.id];

                    const originalName = fileMeta.file.name.substring(0, fileMeta.file.name.lastIndexOf('.')) || fileMeta.file.name;
                    const ext = fileMeta.file.type.split('/')[1] || "jpg";
                    zip.file(`${originalName}-cropped.${ext}`, blob);
                });

                await Promise.all(promises);
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, "aurafile-cropped.zip");
                toast.success("Downloaded ZIP file!");
            } else if (activeFile && activeFile.settings?.isCropped && croppedBlobs[activeFile.id]) {
                const blob = croppedBlobs[activeFile.id];

                const originalName = activeFile.file.name.substring(0, activeFile.file.name.lastIndexOf('.')) || activeFile.file.name;
                const ext = activeFile.file.type.split('/')[1] || "jpg";
                saveAs(blob, `${originalName}-cropped.${ext}`);
            }
        } catch (error) {
            toast.error("Failed to download images.");
        }
    };

    const isAllReady = applyToAll && files.length > 0 && files.every(f => croppedUrls[f.id]);
    const isCurrentReady = !applyToAll && activeFile && croppedUrls[activeFile.id];

    const handlePrimaryAction = () => {
        if (isAllReady || isCurrentReady) {
            handleDownload();
        } else {
            performCrop();
        }
    };

    const getPrimaryActionText = () => {
        if (isProcessing) return "Processing...";
        if (isAllReady) return `Download All (${files.length} Zipped)`;
        if (isCurrentReady) return "Download Image";
        return applyToAll && files.length > 1 ? `Crop All (${files.length})` : "Apply Crop";
    };

    // Override the custom Left Stage preview to use ReactCrop directly
    const customPreview = activeFile ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            {croppedUrls[activeFile.id] ? (
                <div className="relative flex items-center justify-center max-w-full max-h-[60vh] md:max-h-[80%] shadow-md drop-shadow-sm border border-slate-200 bg-[linear-gradient(45deg,#f8f9fa_25%,transparent_25%,transparent_75%,#f8f9fa_75%,#f8f9fa),linear-gradient(45deg,#f8f9fa_25%,transparent_25%,transparent_75%,#f8f9fa_75%,#f8f9fa)] bg-white bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                    <img
                        src={croppedUrls[activeFile.id]}
                        alt="Cropped Result"
                        loading="lazy"
                        className="max-h-[60vh] md:max-h-[80%] pointer-events-none"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            ) : (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => {
                        handleSettingChange({}); // Triggers isCropped resetting
                        setCrop(percentCrop);
                    }}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    circularCrop={isCircular}
                    ruleOfThirds={showGrid}
                    className="max-h-[60vh] md:max-h-[80%]"
                >
                    <img
                        ref={imgRef}
                        key={activeFile.id} // Ensure it rerenders cleanly on switch
                        src={activeFile.previewUrl}
                        alt="Edit"
                        loading="lazy"
                        onLoad={onImageLoad}
                        style={{
                            transform: `rotate(${rotate}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                            maxWidth: '100%',
                            maxHeight: '60vh',
                            transition: 'transform 0.3s ease',
                            objectFit: 'contain'
                        }}
                        className="drop-shadow-sm pointer-events-none"
                    />
                </ReactCrop>
            )}

            {/* Quick Stats Overlay & Download Status */}
            <div className={`absolute bottom-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-xs font-semibold flex items-center gap-3 z-10 transition-all ${croppedUrls[activeFile.id] ? 'text-green-600' : 'text-slate-700'}`}>
                {croppedUrls[activeFile.id] ? (
                    <><Icon name="check-circle" size={14} className="inline mr-1" /> Cropped Successfully</>
                ) : (
                    <>
                        <span>{completedCrop && scale.x > 0 ? `${Math.round(completedCrop.width * scale.x)} x ${Math.round(completedCrop.height * scale.y)} px` : ''}</span>
                        <span className="w-px h-3 bg-slate-300" />
                        <span><Icon name="rotate-cw" size={12} className="inline mr-1" />{rotate}°</span>
                        <span className="w-px h-3 bg-slate-300" />
                        <button onClick={() => setShowGrid(!showGrid)} className={`hover:text-[#0081C9] transition-colors ${showGrid ? 'text-[#0081C9]' : ''}`} title="Toggle Grid">
                            <Icon name="grid" size={14} />
                        </button>
                    </>
                )}
            </div>
        </div>
    ) : null;

    return (
        <div className="w-full space-y-8">
            {files.length === 0 && (
                <div className="mt-6 w-full max-w-7xl mx-auto">
                    <div className="rounded-xl border border-border bg-white shadow-xl p-4 md:p-8">
                        <ImageUploader onUpload={handleUpload} />
                    </div>
                </div>
            )}

            <ToolModal
                isOpen={files.length > 0}
                onClose={clearAll}
                title="Crop Image"
                files={files}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onPrimaryAction={handlePrimaryAction}
                primaryActionText={
                    <span className="flex items-center justify-center gap-2">
                        <Icon name={(isAllReady || isCurrentReady) ? "download" : "crop"} size={18} />
                        {getPrimaryActionText()}
                    </span>
                }
                isProcessing={isProcessing}
                customPreview={customPreview}
            >
                {activeFile && (
                    <ToolSettingsRenderer
                        title="Crop Settings"
                        isBatchMode={files.length > 1}
                        applyToAll={applyToAll}
                        onApplyToAllChange={setApplyToAll}
                    >
                        <div className="flex items-center justify-end mb-2">
                            <button onClick={() => { setRotate(0); setFlipH(false); setFlipV(false); setAspect(undefined); setSelectedRatioLabel("Free"); setIsCircular(false); if (imgRef.current) onImageLoad({ currentTarget: imgRef.current } as any); }} className="text-xs font-semibold text-[#0081C9] hover:underline">
                                Reset Changes
                            </button>
                        </div>

                        <SettingGroup title="Dimensions">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Exact Pixels</label>
                                <button
                                    onClick={() => {
                                        if (aspect) { setAspect(undefined); setSelectedRatioLabel("Free"); }
                                        else if (completedCrop && completedCrop.height > 0) { setAspect(completedCrop.width / completedCrop.height); setSelectedRatioLabel("Custom"); }
                                    }}
                                    className={`text-xs flex items-center gap-1 transition-colors ${aspect ? "text-[#0081C9] font-medium" : "text-muted-foreground"}`}
                                >
                                    <Icon name={aspect ? "lock" : "unlock"} size={12} />
                                    {aspect ? "Locked" : "Unlocked"}
                                </button>
                            </div>
                            <div className="flex items-center gap-2 w-full pt-1">
                                <div className="flex-1 space-y-1.5 flex flex-col">
                                    <input
                                        type="number"
                                        value={widthInput}
                                        onFocus={() => setIsInputActive(true)}
                                        onBlur={() => setIsInputActive(false)}
                                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-[#0081C9]"
                                        placeholder="Width"
                                    />
                                </div>
                                <div className="text-slate-300 px-1">
                                    <Icon name="x" size={12} />
                                </div>
                                <div className="flex-1 space-y-1.5 flex flex-col">
                                    <input
                                        type="number"
                                        value={heightInput}
                                        onFocus={() => setIsInputActive(true)}
                                        onBlur={() => setIsInputActive(false)}
                                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-[#0081C9]"
                                        placeholder="Height"
                                    />
                                </div>
                            </div>
                        </SettingGroup>

                        <SettingGroup title="Aspect Ratio">
                            <div className="grid grid-cols-4 gap-2">
                                {ASPECT_RATIOS.map((ratio) => (
                                    <button
                                        key={ratio.label}
                                        onClick={() => handleAspectRatioChange(ratio)}
                                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all gap-1 h-14 ${selectedRatioLabel === ratio.label
                                            ? "bg-[#0081C9]/5 border-[#0081C9] text-[#0081C9] ring-1 ring-[#0081C9]/20 shadow-sm"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="opacity-70 mt-0.5">
                                            {ratio.icon === 'square' && <div className="w-3.5 h-3.5 border-2 border-current rounded-sm" />}
                                            {ratio.icon === 'minimize' && <Icon name="minimize" size={14} />}
                                            {ratio.icon === 'image' && <Icon name="image" size={14} />}
                                            {!ratio.icon && (
                                                <div
                                                    className="border-2 border-current rounded-sm"
                                                    style={{
                                                        width: ratio.value && ratio.value > 1 ? '16px' : '10px',
                                                        height: ratio.value && ratio.value > 1 ? '10px' : '16px'
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <span className="text-[9px] font-semibold truncate w-full text-center tracking-tight">{ratio.label}</span>
                                    </button>
                                ))}
                            </div>
                        </SettingGroup>

                        <SettingGroup title="Rotation & Align">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-3">
                                <span>Straighten</span>
                                <span className="text-[#0081C9]">{rotate}°</span>
                            </div>

                            <div className="relative w-full h-2 rounded-full cursor-pointer bg-slate-200 mb-6">
                                <div
                                    className="absolute top-0 left-1/2 h-full bg-[#0081C9] pointer-events-none"
                                    style={{
                                        width: `${Math.abs(rotate / 45 * 50)}%`,
                                        transform: rotate < 0 ? 'translateX(-100%)' : 'none',
                                        borderRadius: rotate < 0 ? '9999px 0 0 9999px' : '0 9999px 9999px 0'
                                    }}
                                ></div>
                                <input
                                    type="range"
                                    min="-45"
                                    max="45"
                                    value={rotate > 45 || rotate < -45 ? 0 : rotate}
                                    onChange={(e) => setRotate(Number(e.target.value))}
                                    className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-10 h-full"
                                />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/50 z-0"></div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setRotate(r => r - 90)} className="h-10 flex-1 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors" title="Rotate Left">
                                    <Icon name="rotate-ccw" size={16} />
                                </button>
                                <button onClick={() => setRotate(r => r + 90)} className="h-10 flex-1 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors" title="Rotate Right">
                                    <Icon name="rotate-cw" size={16} />
                                </button>
                                <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
                                <button
                                    onClick={() => setFlipH(!flipH)}
                                    className={`h-10 flex-1 flex items-center justify-center rounded-lg border transition-colors ${flipH ? "bg-[#0081C9]/5 border-[#0081C9]/50 text-[#0081C9]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                >
                                    <Icon name="flip-horizontal" size={16} />
                                </button>
                                <button
                                    onClick={() => setFlipV(!flipV)}
                                    className={`h-10 flex-1 flex items-center justify-center rounded-lg border transition-colors ${flipV ? "bg-[#0081C9]/5 border-[#0081C9]/50 text-[#0081C9]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                >
                                    <Icon name="flip-vertical" size={16} />
                                </button>
                            </div>
                        </SettingGroup>

                        <SettingGroup title="Shape Mask">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setIsCircular(false); setAspect(undefined); setSelectedRatioLabel("Free"); }}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border transition-all ${!isCircular ? "bg-[#0081C9]/5 border-[#0081C9]/50 text-[#0081C9] ring-1 ring-[#0081C9]/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                >
                                    <div className="w-3 h-3 border-2 border-current rounded-[2px]" />
                                    <span className="text-sm font-semibold">Rectangle</span>
                                </button>
                                <button
                                    onClick={() => setIsCircular(true)}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border transition-all ${isCircular ? "bg-[#0081C9]/5 border-[#0081C9]/50 text-[#0081C9] ring-1 ring-[#0081C9]/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                >
                                    <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />
                                    <span className="text-sm font-semibold">Oval</span>
                                </button>
                            </div>
                        </SettingGroup>

                    </ToolSettingsRenderer>
                )}
            </ToolModal>
        </div>
    );
}
