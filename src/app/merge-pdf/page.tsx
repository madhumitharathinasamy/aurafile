import type { Metadata } from "next";
import { MergePdfToolLoader } from "./MergePdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const metadata: Metadata = {
    title: "Merge PDF Online – Combine PDF Files | Aura File",
    description: "Merge multiple PDF files into one document online for free. Reorder pages and combine securely.",
    alternates: {
        canonical: "https://aurafile.net/merge-pdf",
    },
};

export default function MergePdfPage() {
    const steps: Step[] = [
        {
            title: "Upload PDFs",
            description: "Select multiple PDF files you want to combine.",
            icon: "upload-cloud"
        },
        {
            title: "Reorder",
            description: "Drag the files to arrange them in the correct order.",
            icon: "layers"
        },
        {
            title: "Merge & Download",
            description: "Click to merge them into a single PDF document instantly.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Combine Reports",
            description: "Merge separate report chapters or invoices into one easy-to-manage file.",
            icon: "file-text"
        },
        {
            title: "Secure Processing",
            description: "Files are processed in your browser or a secure temporary worker and never stored.",
            icon: "lock"
        },
        {
            title: "Easy Organization",
            description: "Clean up your digital workspace by consolidating related documents.",
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
