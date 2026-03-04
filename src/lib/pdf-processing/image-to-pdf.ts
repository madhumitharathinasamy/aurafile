import { PDFDocument, PageSizes } from '@cantoo/pdf-lib';

export type PageSizeOption = 'a4-p' | 'a4-l' | 'us-letter';
export type MarginOption = 'none' | 'small' | 'large';

export interface ImageToPdfOptions {
    pageSize: PageSizeOption;
    margin: MarginOption;
    onProgress?: (progress: number) => void;
}

const PAGE_DIMENSIONS = {
    'a4-p': [PageSizes.A4[0], PageSizes.A4[1]],
    'a4-l': [PageSizes.A4[1], PageSizes.A4[0]],
    'us-letter': PageSizes.Letter,
};

const MARGIN_SIZES = {
    'none': 0,
    'small': 10,
    'large': 24,
};

// Helper to reliably convert any web image (like WEBP or GIF) to a JPG Blob using Canvas
const convertToJpgBlob = async (file: File | Blob): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            // Fill with white background in case of transparent images being converted to JPG
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas to Blob failed'));
                    return;
                }
                blob.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer))).catch(reject);
            }, 'image/jpeg', 0.95); // High quality JPG
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for conversion'));
        };
        img.src = url;
    });
};

export async function generatePdfFromImages(files: (File | Blob)[], options: ImageToPdfOptions): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();
    const dimensions = PAGE_DIMENSIONS[options.pageSize];
    const margin = MARGIN_SIZES[options.margin];

    const maxWidth = dimensions[0] - (margin * 2);
    const maxHeight = dimensions[1] - (margin * 2);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Report progress
        if (options.onProgress) {
            options.onProgress(Math.round((i / files.length) * 100));
        }

        let imageBytes: Uint8Array;
        let image;

        const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
        const isPng = file.type === 'image/png';

        try {
            if (isJpeg || isPng) {
                imageBytes = new Uint8Array(await file.arrayBuffer());
                image = isJpeg ? await pdfDoc.embedJpg(imageBytes) : await pdfDoc.embedPng(imageBytes);
            } else {
                // Convert other formats (WEBP, GIF, BMP) to JPG
                imageBytes = await convertToJpgBlob(file);
                image = await pdfDoc.embedJpg(imageBytes);
            }
        } catch (error) {
            console.error(`Failed to embed image ${i}:`, error);
            // If native parsing fails (e.g., malformed EXIF in JPG), attempt to sanitize via canvas
            try {
                const sanitizedBytes = await convertToJpgBlob(file);
                image = await pdfDoc.embedJpg(sanitizedBytes);
            } catch (fallbackError) {
                console.error(`Fallback embedding failed for image ${i}:`, fallbackError);
                continue; // Skip the image if both native and fallback fail
            }
        }

        if (!image) continue;

        const page = pdfDoc.addPage(dimensions as [number, number]);

        // Calculate scaling to fit within maxWidth and maxHeight while maintaining aspect ratio
        const imgWidth = image.width;
        const imgHeight = image.height;

        const widthRatio = maxWidth / imgWidth;
        const heightRatio = maxHeight / imgHeight;
        const scaleFactor = Math.min(widthRatio, heightRatio, 1); // Don't scale up past original size unless necessary, actually it's a PDF, usually we scale to fit if it's too large, but if it's too small, maybe scale down? The requirement "Scale images to fit within the designated page size minus margins, maintaining aspect ratio". Typical behavior: scale to fit the available space while maintaining aspect ratio.

        // Let's scale uniformly to fit the bounding box
        const drawScale = Math.min(widthRatio, heightRatio);
        const finalWidth = imgWidth * drawScale;
        const finalHeight = imgHeight * drawScale;

        // Center on page
        const xOffset = margin + (maxWidth - finalWidth) / 2;
        const yOffset = margin + (maxHeight - finalHeight) / 2;

        page.drawImage(image, {
            x: xOffset,
            y: yOffset,
            width: finalWidth,
            height: finalHeight,
        });
    }

    // Report final progress
    if (options.onProgress) {
        options.onProgress(100);
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
