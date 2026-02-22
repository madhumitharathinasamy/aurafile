import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

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
    children
}: ToolModalProps) {
    const [mounted, setMounted] = useState(false);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
            <div className="flex flex-col md:flex-row w-full h-full md:h-[90vh] md:max-w-7xl md:rounded-2xl overflow-hidden bg-background shadow-2xl relative">

                {/* Mobile Header (Only visible on small screens) */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card z-10">
                    <h2 className="font-semibold">{title}</h2>
                    <button onClick={onClose} className="p-2 bg-muted/50 rounded-full text-muted-foreground hover:text-foreground">
                        <Icon name="x" size={20} />
                    </button>
                </div>

                {/* Left Stage: 65% Fixed Content (AuraFile Layout) */}
                <div className="w-full md:w-[65%] h-[40vh] md:h-full bg-slate-950/5 relative flex flex-col border-b md:border-b-0 md:border-r border-border">
                    {/* Desktop Close Button floating Top Left */}
                    <div className="hidden md:block absolute top-4 left-4 z-20">
                        <button onClick={onClose} className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur pb rounded-full text-sm font-medium border border-border/50 hover:bg-background shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <Icon name="chevron-left" size={16} />
                            Back to tools
                        </button>
                    </div>

                    {/* Main Preview Center Stage */}
                    <div className="flex-1 relative p-4 md:p-8 flex items-center justify-center overflow-hidden min-h-0">
                        {activeFile?.previewUrl ? (
                            <img
                                src={activeFile.previewUrl}
                                alt="Preview"
                                className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground h-full border-2 border-dashed border-border/50 rounded-xl w-full">
                                <Icon name="image" size={48} className="mb-4 opacity-20" />
                                <p>No preview available</p>
                            </div>
                        )}
                    </div>

                    {/* AuraFile Carousel (Thumbnail Strip) */}
                    {isBatch && (
                        <div className="h-24 md:h-32 bg-background/50 border-t border-border/50 p-2 md:p-4 shrink-0 flex items-center">
                            <button onClick={handlePrevious} className="h-full px-2 text-muted-foreground hover:text-foreground transition-colors shrink-0 outline-none">
                                <Icon name="chevron-left" size={24} />
                            </button>

                            <div className="flex-1 flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar px-2 snap-x snap-mandatory h-full pb-1 items-center">
                                {files.map((file, idx) => {
                                    const isActive = idx === activeIndex;
                                    return (
                                        <button
                                            key={file.id}
                                            onClick={() => setActiveIndex(idx)}
                                            className={`relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden shrink-0 snap-start transition-all ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-95 shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-95'}`}
                                        >
                                            <img src={file.previewUrl} alt="thumb" className="w-full h-full object-cover" />
                                        </button>
                                    );
                                })}
                            </div>

                            <button onClick={handleNext} className="h-full px-2 text-muted-foreground hover:text-foreground transition-colors shrink-0 outline-none">
                                <Icon name="chevron-right" size={24} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar: 35% Scrollable */}
                <div className="w-full md:w-[35%] h-[calc(100vh-40vh-60px)] md:h-full flex flex-col bg-card">

                    {/* Dynamic Sidebar Header */}
                    <div className="px-6 py-5 border-b border-border bg-background/50 backdrop-blur shrink-0 hidden md:flex items-center justify-between">
                        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            {title} {isBatch ? `${activeIndex + 1} / ${files.length}` : ''}
                        </h2>
                    </div>

                    {/* Scrollable Tool Options */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
                        {children}
                    </div>

                    {/* Sticky Footer Action */}
                    <div className="shrink-0 p-4 md:p-6 border-t border-border bg-background/95 backdrop-blur shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] z-10">
                        <Button
                            onClick={onPrimaryAction}
                            disabled={isProcessing}
                            style={{ backgroundColor: '#0081C9' }}
                            className="w-full h-12 md:h-14 text-base md:text-lg font-semibold text-white hover:opacity-90 shadow-lg shadow-blue-500/20 rounded-xl transition-all"
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
    );

    return createPortal(modalContent, document.body);
}
