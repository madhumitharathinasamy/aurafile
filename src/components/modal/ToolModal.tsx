import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface ToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    files: any[]; // Will use IntegratedFile[] from universal hook
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    onPrimaryAction: () => void;
    primaryActionText: React.ReactNode;
    isProcessing?: boolean;
    children: React.ReactNode; // Sidebar settings content
    customPreview?: React.ReactNode; // Optional override for the Left Stage image preview
    hidePreviewPane?: boolean; // Hides the 55% left stage entirely
    isPrimaryDisabled?: boolean; // Allows explicitly disabling the primary action
}

export function ToolModal({
    isOpen,
    onClose,
    title,
    files,
    activeIndex,
    setActiveIndex,
    onPrimaryAction,
    primaryActionText,
    isProcessing = false,
    children,
    customPreview,
    hidePreviewPane = false,
    isPrimaryDisabled = false
}: ToolModalProps) {
    const [mounted, setMounted] = useState(false);
    const [zoom, setZoom] = useState<number>(100);
    const [isBatchView, setIsBatchView] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Locking Body Scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Initial batch view state based on files
    // Reset isBatchView when files array changes dramatically
    useEffect(() => {
        setIsBatchView(files.length > 1);
    }, [files.length > 1]);

    if (!isOpen || !mounted) return null;

    const activeFile = files[activeIndex];
    const isBatch = files.length > 1;

    const handlePrevious = () => {
        setActiveIndex(activeIndex > 0 ? activeIndex - 1 : files.length - 1);
    };

    const handleNext = () => {
        setActiveIndex(activeIndex < files.length - 1 ? activeIndex + 1 : 0);
    };

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
            <div className="flex flex-col w-full h-[85vh] sm:h-[500px] sm:max-h-[80vh] md:max-w-[1000px] rounded-xl overflow-hidden bg-white shadow-2xl relative">

                {/* Universal Top Header */}
                <div className="flex flex-col p-4 md:px-6 border-b border-border bg-white shrink-0 z-20 gap-3">
                    {/* Top Row: Title, Counter & Close Button (and Desktop Toggle) */}
                    <div className="flex flex-row items-center justify-between w-full min-w-0">
                        {/* Left Side: Title & Pagination */}
                        <div className="flex items-center gap-3 min-w-0">
                            <h2 className="text-slate-800 truncate">{title}</h2>
                            {/* Page Indicator */}
                            {isBatch && (
                                <div className="flex items-center gap-1 text-sm md:text-base font-medium text-muted-foreground tabular-nums shrink-0">
                                    <span>{activeIndex + 1}</span>
                                    <span className="text-slate-300">/</span>
                                    <span>{files.length}</span>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Desktop Toggle & Close X */}
                        <div className="flex items-center gap-3 shrink-0 pl-3">
                            {/* Desktop Single/Batch Toggle */}
                            {isBatch && (
                                <div className="hidden sm:flex items-center bg-[#F1F5F9] p-1 rounded-lg">
                                    <button
                                        onClick={() => setIsBatchView(false)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!isBatchView ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-muted-foreground hover:text-slate-800'}`}
                                    >
                                        <Icon name="image" size={16} className={!isBatchView ? "text-slate-600" : ""} /> Single
                                    </button>
                                    <button
                                        onClick={() => setIsBatchView(true)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isBatchView ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-muted-foreground hover:text-slate-800'}`}
                                    >
                                        <Icon name="layers" size={16} className={isBatchView ? "text-slate-600" : ""} /> Stacked
                                    </button>
                                </div>
                            )}

                            {/* Close Button */}
                            <button aria-label="Close Modal" onClick={onClose} className="p-1 -mr-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center">
                                <Icon name="x" size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Single/Batch Toggle (Second Row on Mobile) */}
                    {isBatch && (
                        <div className="flex sm:hidden items-center bg-[#F1F5F9] p-1 rounded-lg self-start">
                            <button
                                onClick={() => setIsBatchView(false)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!isBatchView ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-muted-foreground hover:text-slate-800'}`}
                            >
                                <Icon name="image" size={16} className={!isBatchView ? "text-slate-600" : ""} /> Single
                            </button>
                            <button
                                onClick={() => setIsBatchView(true)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isBatchView ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-muted-foreground hover:text-slate-800'}`}
                            >
                                <Icon name="layers" size={16} className={isBatchView ? "text-slate-600" : ""} /> Stacked
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                    {/* Left Stage: 65% Fixed Content (Hidden if hidePreviewPane is true) */}
                    {!hidePreviewPane && (
                        <div className="w-full md:w-[65%] h-[40%] md:h-full bg-[#e3e7e9] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] relative flex flex-col border-b md:border-b-0 md:border-r border-border">
                            {/* Main Preview Center Stage */}
                            <div className="flex-1 relative p-4 md:p-0 flex items-center justify-center overflow-hidden min-h-0 group">

                                {/* Zoom Controller */}
                                <div className="absolute bottom-4 right-4 z-40 flex items-center bg-white shadow-md rounded-lg border border-slate-200 overflow-hidden">
                                    <button aria-label="Zoom Out" onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-2 text-muted-foreground hover:bg-slate-50 hover:text-slate-800">
                                        <Icon name="minus" size={16} />
                                    </button>
                                    <div className="px-2 text-xs font-semibold text-slate-700 w-12 text-center select-none cursor-pointer" onClick={() => setZoom(100)}>{zoom}%</div>
                                    <button aria-label="Zoom In" onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-2 text-muted-foreground hover:bg-slate-50 hover:text-slate-800">
                                        <Icon name="plus" size={16} />
                                    </button>
                                </div>

                                {/* Floating Navigation Arrows (Only in single view) */}
                                {isBatch && !isBatchView && (
                                    <>
                                        <button
                                            aria-label="Previous File"
                                            onClick={handlePrevious}
                                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-slate-800 z-30 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                        >
                                            <Icon name="chevron-left" size={24} />
                                        </button>
                                        <button
                                            aria-label="Next File"
                                            onClick={handleNext}
                                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-slate-800 z-30 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                        >
                                            <Icon name="chevron-right" size={24} />
                                        </button>
                                    </>
                                )}

                                {isBatchView ? (
                                    /* Stacked Card Batch Layout */
                                    <div className="absolute inset-0 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-24">
                                        <div className="flex flex-col gap-6 max-w-2xl mx-auto items-center" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
                                            {files.map((file, idx) => (
                                                <div
                                                    key={file.id}
                                                    onClick={() => setActiveIndex(idx)}
                                                    className={`w-full bg-white shadow-md border rounded-xl overflow-hidden cursor-pointer transition-all ${activeIndex === idx ? 'ring-2 ring-primary border-transparent' : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'}`}
                                                >
                                                    <div className="bg-slate-50 border-b border-slate-100 p-2 px-4 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-slate-700 truncate">{file.file.name}</span>
                                                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                    <div className="relative p-4 min-h-[200px] bg-white">
                                                        {file.previewUrl ? (
                                                            file.file.name.toLowerCase().match(/\.(tiff|tif|avif)$/i) ? (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50">
                                                                    <Icon name="file-image" size={48} className="text-slate-300 mb-3" />
                                                                    <span className="text-sm font-medium text-slate-500">{file.file.name.split('.').pop()?.toUpperCase()} format</span>
                                                                </div>
                                                            ) : (
                                                                <Image
                                                                    src={file.previewUrl}
                                                                    alt={file.file.name}
                                                                    fill
                                                                    className="object-contain drop-shadow-sm p-4"
                                                                    unoptimized
                                                                />
                                                            )
                                                        ) : (
                                                            <div className="animate-pulse flex flex-col items-center justify-center h-full min-h-[200px]">
                                                                <Icon name="image" size={32} className="text-slate-200 mb-2" />
                                                                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : customPreview ? (
                                    customPreview
                                ) : activeFile?.previewUrl ? (
                                    <div className="w-full h-full p-4 md:p-8 flex items-center justify-center overflow-auto custom-scrollbar">
                                        <div className="relative w-full h-[70vh] max-h-full aspect-square" style={{ transition: 'transform 0.2s ease-out', transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>
                                            {activeFile.file.name.toLowerCase().match(/\.(tiff|tif|avif)$/i) ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 border border-slate-200 shadow-lg rounded-xl">
                                                    <Icon name="file-image" size={64} className="text-slate-300 mb-4" />
                                                    <p className="text-slate-500 font-medium text-center px-4">Preview not available<br/>for {activeFile.file.name.split('.').pop()?.toUpperCase()}</p>
                                                </div>
                                            ) : (
                                                <Image
                                                    src={activeFile.previewUrl}
                                                    alt="Preview"
                                                    fill
                                                    className="object-contain shadow-lg border border-slate-200 bg-white p-1"
                                                    unoptimized
                                                />
                                            )}
                                            {/* Page Placeholder for future implementation */}
                                            {activeFile.settings?.pageCount > 0 && (
                                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full shadow-md font-medium whitespace-nowrap opacity-90">
                                                    Page 1 of {activeFile.settings.pageCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground h-full border-2 border-dashed border-border/50 rounded-xl w-full bg-slate-50">
                                            <Icon name="loader-2" size={48} className="mb-4 opacity-30 animate-spin" />
                                            <p className="">Loading preview...</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AuraFile Carousel (Thumbnail Strip - Only in Single view) */}
                            {isBatch && !isBatchView && (
                                <div className="hidden md:flex h-20 bg-white/50 border-t border-border/10 p-2 shrink-0 items-center justify-center">
                                    <div className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar px-2 snap-x snap-mandatory h-full pb-1 items-center justify-start md:justify-center max-w-full">
                                        {files.map((file, idx) => {
                                            const isActive = idx === activeIndex;
                                            return (
                                                <button
                                                    key={file.id}
                                                    onClick={() => setActiveIndex(idx)}
                                                    className={`relative h-12 w-12 aspect-square rounded-lg overflow-hidden shrink-0 snap-start transition-all bg-white border border-border/50 ${isActive ? 'ring-2 ring-primary ring-offset-1 scale-95 shadow-sm' : 'opacity-60 hover:opacity-100 hover:scale-95'}`}
                                                >
                                                    {file.file.name.toLowerCase().match(/\.(tiff|tif|avif)$/i) ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                            <span className="text-[10px] font-bold text-slate-400">{file.file.name.split('.').pop()?.substring(0, 3).toUpperCase()}</span>
                                                        </div>
                                                    ) : (
                                                        <Image
                                                            src={file.previewUrl}
                                                            alt="thumb"
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Right Sidebar: 35% Scrollable (or full width if preview is hidden) */}
                    <div className={`w-full flex-1 min-h-0 md:h-full ${hidePreviewPane ? 'md:w-full max-w-2xl mx-auto' : 'md:w-[35%] shrink-0'} flex flex-col bg-white overflow-hidden shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10`}>

                        {/* Scrollable Tool Options */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            {children}
                        </div>

                        {/* Sticky Footer Action */}
                        <div className="shrink-0 p-6 md:p-8 bg-white z-10 pt-2">
                            <Button
                                onClick={onPrimaryAction}
                                disabled={isProcessing || isPrimaryDisabled}
                                style={{ backgroundColor: '#0081C9' }}
                                className="w-full h-12 text-base font-semibold text-white hover:opacity-90 shadow-md shadow-blue-500/10 rounded-lg transition-all"
                            >
                                {isProcessing ? (
                                    <>
                                        <Icon name="loader-2" size={20} className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    primaryActionText
                                )}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
