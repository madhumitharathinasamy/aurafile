import type { Metadata } from "next";
import { UnlockPdfToolLoader } from "./UnlockPdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Unlock PDF - Remove Password, No Upload | AuraFile",
    description: "Remove password protection from PDFs directly in your browser. No uploads, no server access. Fast, private, and free PDF unlocker.",
    alternates: {
        canonical: "https://aurafile.net/unlock-pdf",
    },
};

export default function UnlockPdfPage() {
    const steps: Step[] = [
        {
            title: "Unlock PDF - Remove Password, No Upload | AuraFile",
            description: "Remove password protection from PDFs directly in your browser. No uploads, no server access. Fast, private, and free PDF unlocker.",
            icon: "upload-cloud"
        },
        {
            title: "Unlock PDF - Remove Password, No Upload | AuraFile",
            description: "Remove password protection from PDFs directly in your browser. No uploads, no server access. Fast, private, and free PDF unlocker.",
            icon: "key"
        },
        {
            title: "Unlock PDF - Remove Password, No Upload | AuraFile",
            description: "Remove password protection from PDFs directly in your browser. No uploads, no server access. Fast, private, and free PDF unlocker.",
            icon: "unlock"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Unlock PDF - Remove Password, No Upload | AuraFile",
            description: "Remove password protection from PDFs directly in your browser. No uploads, no server access. Fast, private, and free PDF unlocker.",
            icon: "zap"
        },
        {
            title: "Unlock PDF - Remove Password, No Upload | AuraFile",
            description: "Remove password protection from PDFs directly in your browser. No uploads, no server access. Fast, private, and free PDF unlocker.",
            icon: "shield-check"
        },
        {
            title: "Unlock PDF - Remove Password, No Upload | AuraFile",
            description: "Remove password protection from PDFs directly in your browser. No uploads, no server access. Fast, private, and free PDF unlocker.",
            icon: "file-text"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "Can this crack a PDF without the password?",
            answer: "No. Our tool requires you to know the correct password to decrypt and permanently unlock the document. It does not hack or bypass passwords."
        },
        {
            question: "Is this tool safe to use with sensitive documents?",
            answer: "Yes, it is extremely safe. The file is decrypted locally within your own web browser. No data ever leaves your computer."
        },
        {
            question: "Will this remove printing or editing restrictions?",
            answer: "Yes, once you enter the correct password and the file is unlocked, all editing, printing, and copying restrictions are permanently removed."
        }
    ];

    return (
        <ToolPageLayout
            title="Unlock PDF"
            description="Instantly remove password protection and security restrictions from your PDF files."
            toolComponent={<UnlockPdfToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/pdf-tools" },
                { label: "Unlock PDF", href: "/unlock-pdf" }
            ]}
        />
    );
}
