import type { Metadata } from "next";
import { CompressPdfToolLoader } from "./CompressPdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const metadata: Metadata = {
    title: "Compress PDF Online – Reduce File Size | Aura File",
    description: "Compress PDF files online for free. Reduce file size while maintaining quality. Secure browser-based processing.",
    alternates: {
        canonical: "https://aurafile.net/compress-pdf",
    },
};

export default function CompressPdfPage() {
    const steps: Step[] = [
        {
            title: "Upload PDF",
            description: "Drag & drop your PDF file to start compressing.",
            icon: "upload-cloud"
        },
        {
            title: "Auto-Compress",
            description: "Our algorithms automatically scan and reduce redundant data in your PDF.",
            icon: "minimize-2"
        },
        {
            title: "Download",
            description: "Get your optimized PDF immediately. Smaller size, same great content.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Faster Sharing",
            description: "Smaller files are easier to email, upload, and share with others.",
            icon: "share-2"
        },
        {
            title: "Save Storage",
            description: "Free up space on your phone or computer by optimizing large PDF documents.",
            icon: "hard-drive"
        },
        {
            title: "100% Private",
            description: "Processing happens on your device. We never see or store your files.",
            icon: "eye-off"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "How much can I reduce my PDF size?",
            answer: "It varies depending on the content (images vs text). We aim for maximum reduction without visible quality loss, often achieving 20-50% compression."
        },
        {
            question: "Is it safe?",
            answer: "Absolutely. Your files are processed in your browser. No data is sent to external servers for compression."
        },
        {
            question: "Can I compress multiple files?",
            answer: "Currently, we process one file at a time to ensure maximum privacy and performance in the browser."
        }
    ];

    return (
        <ToolPageLayout
            title="Compress PDF"
            description="Reduce PDF file size securely in your browser. Optimize documents for email and web sharing."
            toolComponent={<CompressPdfToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
        />
    );
}
