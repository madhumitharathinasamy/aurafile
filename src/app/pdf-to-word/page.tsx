import type { Metadata } from "next";
import { PdfToWordToolLoader } from "./PdfToWordToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Convert PDF to Word DOCX Free \u2013 No Upload | AuraFile",
    description: "Convert PDFs to editable Word DOCX files in your browser. No uploads to any server. Preserves text structure. Free and private.",
    alternates: {
        canonical: "https://aurafile.net/pdf-to-word",
    },
};

export default function PdfToWordPage() {
    const steps: Step[] = [
        {
            title: "Convert PDF to Word DOCX Free \u2013 No Upload | AuraFile",
            description: "Convert PDFs to editable Word DOCX files in your browser. No uploads to any server. Preserves text structure. Free and private.",
            icon: "upload-cloud"
        },
        {
            title: "Convert PDF to Word DOCX Free \u2013 No Upload | AuraFile",
            description: "Convert PDFs to editable Word DOCX files in your browser. No uploads to any server. Preserves text structure. Free and private.",
            icon: "file-text"
        },
        {
            title: "Convert PDF to Word DOCX Free \u2013 No Upload | AuraFile",
            description: "Convert PDFs to editable Word DOCX files in your browser. No uploads to any server. Preserves text structure. Free and private.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Convert PDF to Word DOCX Free \u2013 No Upload | AuraFile",
            description: "Convert PDFs to editable Word DOCX files in your browser. No uploads to any server. Preserves text structure. Free and private.",
            icon: "edit-3"
        },
        {
            title: "Convert PDF to Word DOCX Free \u2013 No Upload | AuraFile",
            description: "Convert PDFs to editable Word DOCX files in your browser. No uploads to any server. Preserves text structure. Free and private.",
            icon: "globe"
        },
        {
            title: "Convert PDF to Word DOCX Free \u2013 No Upload | AuraFile",
            description: "Convert PDFs to editable Word DOCX files in your browser. No uploads to any server. Preserves text structure. Free and private.",
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
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/pdf-tools" },
                { label: "Convert PDF to Word", href: "/pdf-to-word" }
            ]}
        />
    );
}
