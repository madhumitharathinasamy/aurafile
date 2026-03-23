export type PdfAnalysisResult = {
    isScanned: boolean;
    pageCount: number;
    textItemsCount: number; // Avg items per page
};

export async function analyzePdf(file: File): Promise<PdfAnalysisResult> {
    const pdfjsLib = await import("pdfjs-dist");

    // Configure worker to avoid blocking the main thread
    if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `/workers/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    let totalTextItems = 0;
    const pagesToCheck = Math.min(pageCount, 3); // Check first 3 pages

    for (let i = 1; i <= pagesToCheck; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        totalTextItems += textContent.items.length;
    }

    const avgTextItems = totalTextItems / pagesToCheck;

    // Heuristic: If < 5 text items per page, it's likely scanned or image-heavy
    // This is a simple heuristic; can be improved by checking for large images covering the page.
    const isScanned = avgTextItems < 10;

    return {
        isScanned,
        pageCount,
        textItemsCount: Math.round(avgTextItems)
    };
}
