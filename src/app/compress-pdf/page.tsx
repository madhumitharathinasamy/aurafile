import { Metadata } from 'next';
import { CompressPdfToolLoader } from './CompressPdfToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { CompressPdfPower } from './CompressPdfPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Compress PDF Free | Secure No Upload Compressor \u2013 AuraFile",
    description: "Reduce PDF file size securely directly in your browser. 100% private, no file uploads. Compress documents instantly for email or web.",
    alternates: {
        canonical: 'https://aurafile.net/compress-pdf',
    },
};

export default function CompressPdfPage() {
    const schemaData = {
        name: "AuraFile PDF Compressor",
        description: "Compress large PDF documents securely locally in your browser.",
        url: "https://aurafile.net/compress-pdf",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Compress PDF"
            description="Shrink heavy PDF documents to a fraction of their original size, making them easy to stream, email, and store. 100% secure processing."
            toolComponent={<CompressPdfToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/#tools" }, // Adjusting simple route based on config
                { label: "Compress PDF", href: "/compress-pdf" }
            ]}
            longFormContent={<CompressPdfPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/compress-pdf"
        />
    );
}
