import { Metadata } from 'next';
import { MergePdfToolLoader } from './MergePdfToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { MergePdfArticle } from './MergePdfArticle';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Merge PDF Files Free \u2013 Private, No Upload Required",
    description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
    alternates: {
        canonical: 'https://aurafile.net/merge-pdf',
    },
};

export default function MergePdfPage() {
    const steps = [
        {
            title: "Select PDF Files",
            description: "Choose two or more PDF documents from your device. You can drag and drop them directly into the tool.",
            icon: "upload" as const
        },
        {
            title: "Reorder Documents",
            description: "Drag the files into the exact sequence you want them to appear in the final merged document.",
            icon: "layers" as const
        },
        {
            title: "Merge and Download",
            description: "Click merge. Your browser will instantly combine the files and download the final PDF to your device.",
            icon: "download" as const
        }
    ];

    const benefits = [
        {
            title: "100% Private",
            description: "Your sensitive PDFs are never uploaded to a cloud server. Everything is processed locally on your machine.",
            icon: "shield" as const
        },
        {
            title: "Lightning Fast",
            description: "By bypassing server uploads and queue times, your files are merged instantly using your device's memory.",
            icon: "zap" as const
        },
        {
            title: "Unlimited Files",
            description: "Merge as many documents as you need. There are no artificial limits, paywalls, or document quotas.",
            icon: "file-text" as const
        }
    ];

    const faq = [
        {
            question: "How many files can I merge at once?",
            answer: "You can merge dozens or even hundreds of PDF files simultaneously, limited only by your browser's available memory."
        },
        {
            question: "Is it really secure for legal or financial documents?",
            answer: "Yes. Unlike typical online tools, AuraFile does not upload your files to an external server. The merging process executes locally in your browser sandbox via WebAssembly. Your documents remain strictly on your own device."
        },
        {
            question: "Will merging reduce the quality of my PDF?",
            answer: "No. The merging tool acts as a digital stapler, combining the byte streams of the documents without re-compressing or degrading the embedded images and text."
        }
    ];

    return (
        <ToolPageLayout
            title="Merge PDF Files"
            description="Combine multiple PDF documents into one file instantly. Organize your documents efficiently and securely without cloud uploads."
            toolComponent={<MergePdfToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/pdf-tools" },
                { label: "Merge PDF Files", href: "/merge-pdf" }
            ]}
            longFormContent={<MergePdfArticle />}
        />
    );
}
