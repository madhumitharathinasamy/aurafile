"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { IntegratedFile } from "@/hooks/useFileUpload";

export interface PdfPageThumb {
    id: string; // `${fileId}-${pageNum}`
    fileId: string;
    fileName: string;
    pageNum: number;
    url: string;
    deleted: boolean;
    rotation: number;
}

interface PdfPageGalleryProps {
    files: IntegratedFile[];
    onPageStateChange: (pages: PdfPageThumb[]) => void;
}

export function PdfPageGallery({ files, onPageStateChange }: PdfPageGalleryProps) {
    const [pages, setPages] = useState<PdfPageThumb[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const generateAllPages = async () => {
            if (files.length === 0) {
                setPages([]);
                return;
            }

            setIsGenerating(true);
            const allPages: PdfPageThumb[] = [];

            try {
                // We use global pdfjsLib imported dynamically to ensure worker is ready
                const pdfjsLib = await import("pdfjs-dist");
                if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
                }

                for (const fileObj of files) {
                    const arrayBuffer = await fileObj.file.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);

                    const loadingTask = pdfjsLib.getDocument(uint8Array);
                    const pdf = await loadingTask.promise;

                    // Rasterize each page
                    for (let i = 1; i <= pdf.numPages; i++) {
                        // Check if we already have this in state to avoid re-rendering
                        const existingMatch = pages.find(p => p.fileId === fileObj.id && p.pageNum === i);
                        if (existingMatch) {
                            allPages.push(existingMatch);
                            continue;
                        }

                        const page = await pdf.getPage(i);
                        // Very low scale for gallery thumbnails to prevent memory crashes on huge PDFs
                        const scale = 0.5;
                        const viewport = page.getViewport({ scale });

                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");

                        if (context) {
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            await page.render({ canvasContext: context, viewport } as any).promise;

                            const url = canvas.toDataURL("image/jpeg", 0.7);
                            allPages.push({
                                id: `${fileObj.id}-${i}`,
                                fileId: fileObj.id,
                                fileName: fileObj.file.name,
                                pageNum: i,
                                url,
                                deleted: false,
                                rotation: 0
                            });
                        }
                    }
                }

                if (isMounted) {
                    setPages(allPages);
                    onPageStateChange(allPages);
                }
            } catch (error) {
                console.error("Failed generating page gallery:", error);
            } finally {
                if (isMounted) setIsGenerating(false);
            }
        };

        // Adding a slight debounce to prevent thrashing when files change rapidly (e.g. during DnD reorder)
        const timer = setTimeout(() => {
            generateAllPages();
        }, 500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
        // Re-run if file order or count changes
    }, [files]);

    // Actions
    const handleRotate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p);
        setPages(updated);
        onPageStateChange(updated);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = pages.map(p => p.id === id ? { ...p, deleted: !p.deleted } : p);
        setPages(updated);
        onPageStateChange(updated);
    };

    if (isGenerating && pages.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center p-8 overflow-hidden bg-[#e3e7e9] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Icon name="loader-2" size={48} className="animate-spin text-[#0081C9]" />
                    <p className="text-muted-foreground">Extracting PDF pages...</p>
                </div>
            </div>
        );
    }

    // Group pages by File order based on the `files` array input, ensuring the visual gallery matches the sidebar order
    return (
        <div className="w-full h-full flex flex-col p-4 md:p-8 overflow-y-auto custom-scrollbar relative z-10 bg-[#e3e7e9] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="flex-1 space-y-10 max-w-5xl mx-auto w-full">
                {files.map(file => {
                    const filePages = pages.filter(p => p.fileId === file.id);
                    if (filePages.length === 0) return null;

                    return (
                        <div key={file.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#0081C9]/10 p-2 rounded-lg text-[#0081C9]">
                                        <Icon name="file-text" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-800 truncate max-w-[200px] md:max-w-md">{file.file.name}</h3>
                                        <p className="text-muted-foreground">{filePages.length} Pages</p>
                                    </div>
                                </div>
                            </div>

                            {/* Page Grid */}
                            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {filePages.map(page => (
                                    <div key={page.id} className={`group relative flex flex-col items-center gap-2 transition-all ${page.deleted ? 'opacity-30 grayscale' : 'opacity-100 hover:-translate-y-1'}`}>

                                        <div className="relative rounded-lg shadow-md border border-slate-200 bg-white overflow-hidden aspect-[1/1.4] w-full flex items-center justify-center">
                                            <img
                                                src={page.url}
                                                alt={`Page ${page.pageNum}`}
                                                className="w-full h-full object-contain pointer-events-none transition-transform duration-300"
                                                style={{ transform: `rotate(${page.rotation}deg)` }}
                                            />

                                            {/* Hover Overlay Actions */}
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                                <button
                                                    onClick={(e) => handleRotate(page.id, e)}
                                                    className="p-2 bg-white text-slate-700 hover:text-[#0081C9] rounded-full shadow-lg transform hover:scale-110 transition-all border border-transparent hover:border-[#0081C9]/20"
                                                    title="Rotate Page"
                                                >
                                                    <Icon name="rotate-cw" size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(page.id, e)}
                                                    className={`p-2 bg-white rounded-full shadow-lg transform hover:scale-110 transition-all border border-transparent ${page.deleted ? 'text-green-600 hover:border-green-200' : 'text-slate-700 hover:text-red-600 hover:border-red-200'}`}
                                                    title={page.deleted ? "Restore Page" : "Delete Page"}
                                                >
                                                    {page.deleted ? <Icon name="rotate-ccw" size={16} /> : <Icon name="trash-2" size={16} />}
                                                </button>
                                            </div>

                                            {/* Deleted Overlay Visual */}
                                            {page.deleted && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 pointer-events-none">
                                                    <Icon name="x" size={48} className="text-red-500/50" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">{page.pageNum}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Generating Overlay for subsequent loads while preserving old grid */}
            {isGenerating && pages.length > 0 && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3">
                        <Icon name="loader-2" size={24} className="animate-spin text-[#0081C9]" />
                        <span className="font-semibold text-slate-700">Updating rendering...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
