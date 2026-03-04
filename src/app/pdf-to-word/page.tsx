import type { Metadata } from "next";
import { PdfToWordToolLoader } from "./PdfToWordToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const metadata: Metadata = {
    title: "PDF to Word Converter – Editable DOCX | Aura File",
    description: "Convert PDF files to editable Microsoft Word (DOCX) documents online. Preserve text and basic formatting.",
    alternates: {
        canonical: "https://aurafile.net/pdf-to-word",
    },
};

export default function PdfToWordPage() {
    const steps: Step[] = [
        {
            title: "Upload PDF",
            description: "Drag & drop your PDF file to begin extraction.",
            icon: "upload-cloud"
        },
        {
            title: "Wait for Extraction",
            description: "Our tool processes the PDF and extracts text content into a document structure.",
            icon: "file-text"
        },
        {
            title: "Download Word Doc",
            description: "Save the result as an editable .docx file compatible with Microsoft Word.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Editable Text",
            description: "Convert read-only PDF text into fully editable Word paragraphs.",
            icon: "edit-3"
        },
        {
            title: "Browser-Based",
            description: "No software installation required. Works on Windows, Mac, and Linux.",
            icon: "globe"
        },
        {
            title: "100% Free",
            description: "Convert as many files as you need without any cost.",
            icon: "smile"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "Does it preserve formatting?",
            answer: "The tool extracts text paragraphs and basic structure. Complex layouts like tables or floating images may need adjustment in Word."
        },
        {
            question: "Is my file secure?",
            answer: "Yes. Processing happens in your browser (or via a secure ephemeral worker). We do not store your files."
        },
        {
            question: "Can I convert scanned PDFs?",
            answer: "This tool works best with standard PDFs containing text data. Scanned images (OCRing) are not currently supported."
        }
    ];

    return (
        <ToolPageLayout
            title="Convert PDF to Word"
            description="Extract text from PDF and save as editable Word (DOCX) document. Simple, fast, and free."
            toolComponent={<PdfToWordToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
        />
    );
}
