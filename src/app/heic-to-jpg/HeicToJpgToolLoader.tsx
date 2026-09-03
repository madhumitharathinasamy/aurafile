"use client";

import dynamic from "next/dynamic";
import { Icon } from "@/components/ui/Icon";

const HeicToJpgTool = dynamic(() => import("./HeicToJpgTool"), {
    ssr: false,
    loading: () => (
        <div className="w-full flex items-center justify-center min-h-[400px] border-2 border-dashed border-border/50 rounded-2xl bg-slate-50">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Icon name="loader-2" size={32} className="animate-spin opacity-50" />
                <p className="font-medium animate-pulse">Loading HEIC Converter...</p>
            </div>
        </div>
    )
});

export default function HeicToJpgToolLoader() {
    return <HeicToJpgTool />;
}
