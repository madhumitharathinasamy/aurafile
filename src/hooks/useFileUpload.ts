import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export interface IntegratedFile {
    id: string;
    file: File;
    previewUrl: string;
    format: string;
    size: number;
    // Base properties that all tools can use or extend
    originalWidth?: number;
    originalHeight?: number;
    settings?: any;
}

export function useFileUpload(initialFiles: IntegratedFile[] = []) {
    const [files, setFiles] = useState<IntegratedFile[]>(initialFiles);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const filesRef = useRef(files);
    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    // Cleanup URLs when files are removed or component unmounts
    useEffect(() => {
        return () => {
            filesRef.current.forEach(f => {
                if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
            });
        };
    }, []);

    const addFiles = useCallback((newRawFiles: File[], defaultSettings: any = {}) => {
        // Enforce Phase 5 Hard Limit (50MB)
        const MAX_SIZE = 50 * 1024 * 1024;
        const validFiles = newRawFiles.filter(file => {
            if (file.size > MAX_SIZE) {
                toast.error(`"${file.name}" exceeds the 50MB limit and was skipped.`);
                return false;
            }
            return true;
        });

        const newIntegratedFiles: IntegratedFile[] = validFiles.map(file => ({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
            file,
            previewUrl: URL.createObjectURL(file),
            format: file.type.split('/')[1] || 'unknown',
            size: file.size,
            settings: { ...defaultSettings }
        }));

        setFiles(prev => {
            const updated = [...prev, ...newIntegratedFiles];
            // If this is the first batch of files, set active index to 0
            if (prev.length === 0 && updated.length > 0) {
                setActiveIndex(0);
            }
            return updated;
        });

        return newIntegratedFiles;
    }, []);

    const removeFile = useCallback((id: string) => {
        setFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove?.previewUrl) {
                URL.revokeObjectURL(fileToRemove.previewUrl);
            }

            const newFiles = prev.filter(f => f.id !== id);

            // Adjust activeIndex if necessary
            setActiveIndex(current => {
                if (newFiles.length === 0) return 0;
                if (current >= newFiles.length) return newFiles.length - 1;
                return current;
            });

            return newFiles;
        });
    }, []);

    const clearAll = useCallback(() => {
        files.forEach(f => {
            if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
        });
        setFiles([]);
        setActiveIndex(0);
    }, [files]);

    const updatePreviewUrl = useCallback((id: string, newUrl: string) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                if (f.previewUrl && f.previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(f.previewUrl);
                }
                return { ...f, previewUrl: newUrl };
            }
            return f;
        }));
    }, []);

    const updateFileSettings = useCallback((id: string, newSettings: any) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                return {
                    ...f,
                    settings: { ...f.settings, ...newSettings }
                };
            }
            return f;
        }));
    }, []);

    const updateAllFileSettings = useCallback((newSettings: any) => {
        setFiles(prev => prev.map(f => ({
            ...f,
            settings: { ...f.settings, ...newSettings }
        })));
    }, []);

    return {
        files,
        setFiles,
        activeIndex,
        setActiveIndex,
        activeFile: files[activeIndex] || null,
        addFiles,
        removeFile,
        clearAll,
        updateFileSettings,
        updateAllFileSettings,
        updatePreviewUrl,
        isBatchMode: files.length > 1,
        hasFiles: files.length > 0
    };
}
