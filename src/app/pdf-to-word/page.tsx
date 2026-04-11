import { Metadata } from 'next';
import { PdfToWordToolLoader } from './PdfToWordToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { PdfToWordPower } from './PdfToWordPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "PDF to Word Converter Free | Private & Secure Extraction \u2013 AuraFile",
    description: "Convert PDF to Word document (DOCX) securely in your browser. 100% private, no file uploads. Retain formatting perfectly.",
    alternates: {
        canonical: 'https://aurafile.net/pdf-to-word',
    },
};

export default function PdfToWordPage() {
    const schemaData = {
        name: "AuraFile PDF to Word Converter",
        description: "Convert PDF documents to editable Microsoft Word (DOCX) files directly in your browser.",
        url: "https://aurafile.net/pdf-to-word",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Convert PDF to Word"
            description="Transform non-editable PDFs into fully formatted Microsoft Word documents instantly. Processed completely offline for maximum security."
            toolComponent={<PdfToWordToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/#tools" },
                { label: "PDF to Word", href: "/pdf-to-word" }
            ]}
            longFormContent={<PdfToWordPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/pdf-to-word"
        />
    );
}
