import { useState, useCallback, useEffect } from "react";

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

    // Cleanup URLs when files are removed or component unmounts
    useEffect(() => {
        return () => {
            files.forEach(f => {
                if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
            });
        };
    }, []);

    const addFiles = useCallback((newRawFiles: File[], defaultSettings: any = {}) => {
        const newIntegratedFiles: IntegratedFile[] = newRawFiles.map(file => ({
            id: crypto.randomUUID(),
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
        isBatchMode: files.length > 1,
        hasFiles: files.length > 0
    };
}
