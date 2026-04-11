import { Metadata } from 'next';
import { ImageToPdfToolLoader } from './ImageToPdfToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { ImageToPdfPower } from './ImageToPdfPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Image to PDF Converter Free | Secure 100% Private \u2013 AuraFile",
    description: "Convert JPG to PDF, PNG to PDF safely in your browser. 100% private, no file uploads. Reorder images and create documents instantly.",
    alternates: {
        canonical: 'https://aurafile.net/image-to-pdf',
    },
};

export default function ImageToPdfPage() {
    const schemaData = {
        name: "AuraFile Image to PDF Converter",
        description: "Combine multiple image files into a single PDF document natively in your browser.",
        url: "https://aurafile.net/image-to-pdf",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Convert Image to PDF"
            description="Turn random JPGs and PNGs into a clean, professional PDF document. Manage margins, reorder pages, and convert instantly offline."
            toolComponent={<ImageToPdfToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Image to PDF", href: "/image-to-pdf" }
            ]}
            longFormContent={<ImageToPdfPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/image-to-pdf"
        />
    );
}
