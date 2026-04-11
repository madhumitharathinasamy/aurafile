import { Metadata } from 'next';
import { MergePdfToolLoader } from './MergePdfToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { MergePdfPower } from './MergePdfPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Merge PDF Free | Private No Upload Document Combiner \u2013 AuraFile",
    description: "Combine multiple PDF files into one securely in your browser. 100% private, no file uploads. Reorder pages instantly for free.",
    alternates: {
        canonical: 'https://aurafile.net/merge-pdf',
    },
};

export default function MergePdfPage() {
    const schemaData = {
        name: "AuraFile PDF Merger",
        description: "Combine and merge multiple PDF documents into a single file locally in your browser.",
        url: "https://aurafile.net/merge-pdf",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Merge PDF"
            description="Stitch multiple PDF documents together into a single master file. Reorder pages intuitively completely within your secure browser."
            toolComponent={<MergePdfToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/#tools" }, 
                { label: "Merge PDF", href: "/merge-pdf" }
            ]}
            longFormContent={<MergePdfPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/merge-pdf"
        />
    );
}
