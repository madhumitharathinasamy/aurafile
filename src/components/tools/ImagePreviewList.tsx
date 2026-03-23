"use client";

import { Icon } from "@/components/ui/Icon";
import { FileWithMeta, ResizeSettings } from "@/app/resize-image/types";

interface ImagePreviewListProps {
    files: FileWithMeta[];
    onClear: () => void;
    onRemove: (id: string) => void;
    onGetDimensions: (w: number, h: number, settings: ResizeSettings) => { width: number; height: number };
    activeFileId?: string | null;
    onSelect?: (id: string) => void;
}

export function ImagePreviewList({
    files,
    onClear,
    onRemove,
    onGetDimensions,
    activeFileId,
    onSelect,
}: ImagePreviewListProps) {
    return (
        <div className="w-full">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
                {files.map((item) => {
                    const newDims = onGetDimensions(item.originalWidth, item.originalHeight, item.settings);
                    const isActive = activeFileId === item.id;

                    const hasDimChange = newDims.width !== item.originalWidth || newDims.height !== item.originalHeight;
                    const hasFormatChange = item.settings.format !== "original";
                    const hasQualityChange = item.settings.quality !== 90;
                    const isItemModified = hasDimChange || hasFormatChange || hasQualityChange;

                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelect?.(item.id)}
                            className={`
                                relative flex-shrink-0 cursor-pointer rounded-xl border transition-all snap-start overflow-hidden group
                                ${isActive
                                    ? "border-primary ring-1 ring-primary shadow-md bg-primary/5"
                                    : "border-border hover:border-primary/50 opacity-80 hover:opacity-100 bg-surface"
                                }
                            `}
                            style={{ width: '160px' }}
                        >
                            <div className="flex gap-3 p-2 relative z-0">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted/50">
                                    <img
                                        src={item.previewUrl}
                                        alt={item.file.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 flex flex-col justify-center">
                                    <p className="truncate mb-1" title={item.file.name}>
                                        {item.file.name}
                                    </p>
                                    <div className="flex flex-col text-[10px] text-muted-foreground leading-tight">
                                        <span>{item.originalWidth} x {item.originalHeight}</span>
                                        {isItemModified ? (
                                            <span className="text-primary font-semibold flex items-center gap-1">
                                                <Icon name="arrow-right" size={8} />
                                                {newDims.width} x {newDims.height}
                                            </span>
                                        ) : (
                                            <span className="text-muted/50 font-mono">
                                                ---
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Remove button (top right) */}
                            <button
                                aria-label="Remove image"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(item.id);
                                }}
                                className="absolute top-1 right-1 z-10 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                            >
                                <Icon name="x" size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground px-1">
                <span>{files.length} image{files.length !== 1 ? 's' : ''} selected</span>
            </div>
        </div>
    );
}
