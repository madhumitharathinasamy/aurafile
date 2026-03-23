export async function generatePdfPreview(file: File): Promise<{ url: string, pageCount: number } | null> {
    try {
        const pdfjsLib = await import('pdfjs-dist');
        if (typeof window !== "undefined") {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `/workers/pdf.worker.min.mjs`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        if (pdf.numPages === 0) return null;

        const page = await pdf.getPage(1);

        // Use a reasonable scale for a thumbnail to save memory
        const scale = 1.0;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return null;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport } as any).promise;

        // Convert to high-quality JPEG
        const url = canvas.toDataURL("image/jpeg", 0.9);
        return { url, pageCount: pdf.numPages };
    } catch (error) {
        return null;
    }
}
