// Remove heavy static imports to allow Next.js lazy compilation
// pdfjs-dist and docx will be dynamically imported during actual execution.

interface ConversionOptions {
    useOcr: boolean;
    onProgress: (progress: number) => void;
}

export async function convertPdfToDocx(file: File, options: ConversionOptions): Promise<Blob> {
    // Dynamically inject heavy modules Only when action is triggered
    const pdfjsLib = await import('pdfjs-dist');
    const docxLib = await import('docx');
    const { Document, Packer, Paragraph, TextRun, ImageRun } = docxLib;

    options.onProgress(10);

    if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `/workers/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    options.onProgress(20);

    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;

    options.onProgress(30);

    const docxElements: Array<import("docx").Paragraph> = [];

    const totalPages = pdfDocument.numPages;

    // Use a persistent single worker for the whole document to avoid spinning up OCR WASM cores per-page
    let ocrWorker: import("tesseract.js").Worker | null = null;
    let currentPageForOcr = 1;

    if (options.useOcr) {
        try {
            const Tesseract = (await import('tesseract.js')).default;
            ocrWorker = await Tesseract.createWorker('eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        // Map OCR progress to overall chunk progression smoothly
                        const pageBaseProgress = 30 + Math.floor(((currentPageForOcr - 1) / totalPages) * 50);
                        const pageOcrProgress = Math.floor(m.progress * (50 / totalPages));
                        options.onProgress(pageBaseProgress + pageOcrProgress);
                    }
                }
            });
        } catch (error) {
        }
    }

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();

        const hasText = textContent.items.length > 5; // rudimentary check for extractable text vs empty scan

        if (hasText && !options.useOcr) {
            // Reconstruct Text
            let lastY: number | undefined;
            let currentLine = '';

            for (const item of textContent.items as Array<import("pdfjs-dist/types/src/display/api").TextItem>) {
                if (lastY !== undefined && Math.abs(lastY - item.transform[5]) > 4) {
                    if (currentLine.trim().length > 0) {
                        docxElements.push(new Paragraph({ children: [new TextRun(currentLine)] }));
                    }
                    currentLine = '';
                }
                currentLine += item.str;
                lastY = item.transform[5];
            }
            if (currentLine.trim().length > 0) {
                docxElements.push(new Paragraph({ children: [new TextRun(currentLine)] }));
            }
        } else {
            // Render as Image (Scan)
            const scale = 2.0; // High resolution for DOCX
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (context) {
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport } as Parameters<typeof page.render>[0]).promise;

                const base64Data = canvas.toDataURL("image/jpeg", 0.95);
                const arrayBuffer = Uint8Array.from(atob(base64Data.split(',')[1]), c => c.charCodeAt(0));

                let extractedText = "";

                if (options.useOcr && ocrWorker) {
                    try {
                        currentPageForOcr = i;
                        const { data: { text } } = await ocrWorker.recognize(base64Data);
                        extractedText = text;
                    } catch (error) {
                    }
                }

                // Lowering the strict threshold. Even a single character extracted by OCR 
                // means OCR worked and the user specifically requested text over image.
                if (options.useOcr && extractedText.trim().length > 0) {
                    // We successfully found valid text inside the Image. Use this instead of the image.
                    const lines = extractedText.split('\n');
                    for (const line of lines) {
                        if (line.trim().length > 0) {
                            docxElements.push(new Paragraph({ children: [new TextRun(line.trim())] }));
                        }
                    }
                } else {
                    // Fallback to inserting the scanned image into the Word Document if no text is found,
                    // or if the OCR couldn't figure it out.
                    docxElements.push(
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: arrayBuffer,
                                    type: "jpg",
                                    transformation: {
                                        // Scale it slightly down for Word fit
                                        width: 600,
                                        height: (viewport.height / viewport.width) * 600,
                                    },
                                }),
                            ],
                        })
                    );
                }
            }
        }

        // Progress tracking based on pages parsed
        options.onProgress(30 + Math.floor((i / totalPages) * 50));
    }

    if (ocrWorker) {
        await ocrWorker.terminate();
    }

    if (docxElements.length === 0) {
        throw new Error("Could not extract any content from the PDF.");
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: docxElements,
        }],
    });

    options.onProgress(85);

    const blob = await Packer.toBlob(doc);

    options.onProgress(100);
    return blob;
}
