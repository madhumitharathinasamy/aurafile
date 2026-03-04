"use client";

interface QualitySliderProps {
    quality: number;
    onChange: (value: number) => void;
}

export function QualitySlider({ quality, onChange }: QualitySliderProps) {
    const getQualityLabel = (val: number) => {
        if (val >= 90) return "High Quality (Low Compression)";
        if (val >= 60) return "Balanced";
        if (val >= 30) return "High Compression";
        return "Extreme Compression (Low Quality)";
    };

    return (
        <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
                <label className="text-base font-medium text-foreground">Compression Level</label>
                <span className="text-lg font-bold text-primary">{quality}%</span>
            </div>

            <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="mb-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            />

            <p className="mt-2 text-center text-text-secondary">
                {getQualityLabel(quality)}
            </p>
        </div>
    );
}
