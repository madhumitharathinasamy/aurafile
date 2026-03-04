"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface ImageComparisonProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export function ImageComparison({
    beforeImage,
    afterImage,
    beforeLabel = "Original",
    afterLabel = "Result",
    className = "",
}: ImageComparisonProps) {
    const [showOriginal, setShowOriginal] = useState(false);

    return (
        <div className={`relative w-full h-full max-w-full overflow-hidden rounded-xl border border-border bg-surface select-none flex flex-col items-center justify-center ${className}`}>

            {/* The Image */}
            <div className="w-full h-full flex items-center justify-center p-4">
                <img
                    src={showOriginal ? beforeImage : afterImage}
                    alt={showOriginal ? beforeLabel : afterLabel}
                    className="max-w-full max-h-full object-contain drop-shadow-sm transition-opacity duration-200"
                    draggable={false}
                />
            </div>

            {/* Premium Toggle Button Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-lg border border-slate-200/50 flex items-center gap-1 z-20">
                <button
                    onClick={() => setShowOriginal(true)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${showOriginal
                        ? "bg-slate-800 text-white shadow-md"
                        : "text-muted-foreground hover:text-slate-800 hover:bg-slate-100"
                        }`}
                >
                    {beforeLabel}
                </button>
                <button
                    onClick={() => setShowOriginal(false)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${!showOriginal
                        ? "bg-[#0081C9] text-white shadow-md shadow-[#0081C9]/20"
                        : "text-muted-foreground hover:text-[#0081C9] hover:bg-[#0081C9]/10"
                        }`}
                >
                    {afterLabel}
                </button>
            </div>

        </div>
    );
}
