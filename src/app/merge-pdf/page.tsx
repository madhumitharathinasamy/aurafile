import type { Metadata } from "next";
import { MergePdfToolLoader } from "./MergePdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Merge PDF Files Free \u2013 Private, No Upload Required",
    description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
    alternates: {
        canonical: "https://aurafile.net/merge-pdf",
    },
};

export default function MergePdfPage() {
    const steps: Step[] = [
        {
            title: "Merge PDF Files Free \u2013 Private, No Upload Required",
            description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
            icon: "upload-cloud"
        },
        {
            title: "Merge PDF Files Free \u2013 Private, No Upload Required",
            description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
            icon: "layers"
        },
        {
            title: "Merge PDF Files Free \u2013 Private, No Upload Required",
            description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Merge PDF Files Free \u2013 Private, No Upload Required",
            description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
            icon: "file-text"
        },
        {
            title: "Merge PDF Files Free \u2013 Private, No Upload Required",
            description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
            icon: "lock"
        },
        {
            title: "Merge PDF Files Free \u2013 Private, No Upload Required",
            description: "Combine multiple PDFs into one file \u2014 processed entirely in your browser. No uploads, no accounts. Your documents never reach our servers.",
            icon: "folder"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "How many files can I merge?",
            answer: "You can merge as many PDF files as you like, provided they fit within your browser's memory limits."
        },
        {
            question: "Can I reorder pages inside the PDFs?",
            answer: "This tool merges whole files. To reorder individual pages, first split them or use our page organizer tool (coming soon)."
        },
        {
            question: "Is it free?",
            answer: "Yes, merging PDFs is completely free with no watermarks."
        }
    ];

    return (
        <ToolPageLayout
            title="Merge PDF Files"
            description="Combine multiple PDF documents into one file instantly. Organize your documents efficiently."
            toolComponent={<MergePdfToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
        />
    );
}
