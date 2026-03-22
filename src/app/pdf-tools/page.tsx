import type { Metadata } from 'next';
import CategoryPageLayout, { type CategoryTool } from '@/components/sections/CategoryPageLayout';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Free PDF Tools | AuraFile',
    description: 'A complete suite of free, browser-based PDF tools. Merge, compress, convert, and split PDFs securely without uploading any files.',
    alternates: {
        canonical: 'https://aurafile.net/pdf-tools',
    },
};

export default function PdfToolsPage() {
    const tools = siteConfig.home.tools.pdf as CategoryTool[];
    
    const faq = [
        {
            question: "Are these PDF tools really secure?",
            answer: "Yes. All processing happens locally in your web browser using WebAssembly. Your PDF files are never uploaded to our servers, ensuring complete privacy."
        },
        {
            question: "Is there a limit on file size or number of files?",
            answer: "Since the processing utilizes your device's memory rather than our servers, the only limit is what your browser and device RAM can handle. In practical terms, you can merge dozens of large PDFs without issue."
        },
        {
            question: "Do I need to install any software?",
            answer: "No installation is required. Our tools run instantly in modern web browsers (Chrome, Edge, Firefox, Safari) on both desktop and mobile devices."
        }
    ];

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "PDF Tools", href: "/pdf-tools" }
    ];

    return (
        <CategoryPageLayout
            title="PDF Tools"
            description="Process, merge, and convert your PDF documents completely securely inside your browser. No uploads, no waiting."
            icon="file-text"
            tools={tools}
            faq={faq}
            breadcrumbs={breadcrumbs}
        />
    );
}
