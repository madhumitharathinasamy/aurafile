import type { Metadata } from "next";
import { CompressPdfToolLoader } from "./CompressPdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Compress PDF Free - No Upload Required | AuraFile",
    description: "Reduce PDF file size directly in your browser. No server uploads ever. 100% private, browser-based PDF compression. Free and instant.",
    alternates: {
        canonical: "https://aurafile.net/compress-pdf",
    },
};

export default function CompressPdfPage() {
    const steps: Step[] = [
        {
            title: "Compress PDF Free - No Upload Required | AuraFile",
            description: "Reduce PDF file size directly in your browser. No server uploads ever. 100% private, browser-based PDF compression. Free and instant.",
            icon: "upload-cloud"
        },
        {
            title: "Compress PDF Free - No Upload Required | AuraFile",
            description: "Reduce PDF file size directly in your browser. No server uploads ever. 100% private, browser-based PDF compression. Free and instant.",
            icon: "minimize-2"
        },
        {
            title: "Compress PDF Free - No Upload Required | AuraFile",
            description: "Reduce PDF file size directly in your browser. No server uploads ever. 100% private, browser-based PDF compression. Free and instant.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Compress PDF Free - No Upload Required | AuraFile",
            description: "Reduce PDF file size directly in your browser. No server uploads ever. 100% private, browser-based PDF compression. Free and instant.",
            icon: "share-2"
        },
        {
            title: "Compress PDF Free - No Upload Required | AuraFile",
            description: "Reduce PDF file size directly in your browser. No server uploads ever. 100% private, browser-based PDF compression. Free and instant.",
            icon: "hard-drive"
        },
        {
            title: "Compress PDF Free - No Upload Required | AuraFile",
            description: "Reduce PDF file size directly in your browser. No server uploads ever. 100% private, browser-based PDF compression. Free and instant.",
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
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/pdf-tools" },
                { label: "Compress PDF", href: "/compress-pdf" }
            ]}
        />
    );
}
