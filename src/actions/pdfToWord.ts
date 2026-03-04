"use server";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function convertPdfToWordAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const useOcr = formData.get("useOcr") === "true";

        if (!file) {
            return { success: false, error: "No PDF file provided." };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let fullText = "";

        try {
            // Provide DOM polyfills required by PDF.js in Node.js
            if (typeof global !== "undefined" && typeof global.DOMMatrix === "undefined") {
                global.DOMMatrix = class DOMMatrix {
                    constructor() { }
                } as any;
            }

            // In Next.js Server Actions, we must explicitly use the legacy build and standard worker 
            // otherwise Turbopack strips the worker out and throws ENOENT / module not found
            const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

            // Set workerSrc to a dummy string and disable the worker port. 
            // This forces pdf.js to run inline on the server without crashing trying to require() the fallback fake worker file
            pdfjsLib.GlobalWorkerOptions.workerSrc = '';
            (pdfjsLib as any).GlobalWorkerOptions.workerPort = null;

            const uint8Array = new Uint8Array(buffer);
            const loadingTask = pdfjsLib.getDocument({
                data: uint8Array,
                useSystemFonts: true
            });

            const pdfDocument = await loadingTask.promise;

            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const textContent = await page.getTextContent();

                let lastY;
                let text = '';
                for (let item of textContent.items as any[]) {
                    if (lastY !== undefined && Math.abs(lastY - item.transform[5]) > 4) {
                        text += '\n';
                    }
                    text += item.str;
                    lastY = item.transform[5];
                }
                fullText += text + '\n\n';
            }
        } catch (e: any) {
            console.error("PDF Parse error", e);
            import('fs').then(fs => fs.writeFileSync('error-log.txt', String(e.stack || e.message || e)));
            return { success: false, error: "Failed to read PDF structure. The file might be corrupted or encrypted. Detailed error is in log." };
        }

        if (fullText.trim().length === 0) {
            if (useOcr) {
                return { success: false, error: "OCR is not implemented on this server yet. No text found in PDF." };
            } else {
                return { success: false, error: "No extractable text found. This might be a scanned image. Try enabling OCR." };
            }
        }

        // Generate DOCX
        const paragraphs = fullText.split('\n').filter((line: string) => line.trim().length > 0).map((line: string) => {
            return new Paragraph({
                children: [new TextRun(line)]
            });
        });

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        const docxBuffer = await Packer.toBuffer(doc);

        const base64 = docxBuffer.toString("base64");

        return {
            success: true,
            data: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`
        };

    } catch (error: any) {
        console.error("Convert Action Error:", error);
        import('fs').then(fs => fs.writeFileSync('error-log.txt', String(error.stack || error.message || error)));
        return { success: false, error: error.message || "Failed to convert PDF to Word" };
    }
}
