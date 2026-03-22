import type { Metadata } from 'next';
import CategoryPageLayout, { type CategoryTool } from '@/components/sections/CategoryPageLayout';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Free Document Utilities | AuraFile',
    description: 'Helpful browser-based utilities for OCR text extraction, bulk file renaming, and more. No uploads require, perfectly private.',
    alternates: {
        canonical: 'https://aurafile.net/document-tools',
    },
};

export default function DocumentToolsPage() {
    const tools = siteConfig.home.tools.other as CategoryTool[] || [];
    
    const faq = [
        {
            question: "How does the OCR (Optical Character Recognition) work without a server?",
            answer: "We utilize Tesseract.js, a WebAssembly port of the famous open-source OCR engine. It runs the recognition algorithms entirely in your browser memory."
        },
        {
            question: "Are there any limits on bulk renaming files?",
            answer: "No. Since the renaming happens via client-side JavaScript referencing the HTML5 File API, you can rename hundreds of files instantly without any network bottlenecks."
        }
    ];

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Document Tools", href: "/document-tools" }
    ];

    return (
        <CategoryPageLayout
            title="Document Tools & Utilities"
            description="Handy tools for productivity. Extract text from images, rename files in bulk, and more—all powered by your device."
            icon="folder"
            tools={tools}
            faq={faq}
            breadcrumbs={breadcrumbs}
        />
    );
}
