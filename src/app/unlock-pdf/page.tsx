import type { Metadata } from "next";
import UnlockPdfTool from "./UnlockPdfTool";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const metadata: Metadata = {
    title: "Unlock PDF – Remove Password Securely | Aura File",
    description: "Remove password protection from your PDF files securely in your browser. Fast, free, and totally offline.",
    alternates: {
        canonical: "https://aurafile.net/unlock-pdf",
    },
};

export default function UnlockPdfPage() {
    const steps: Step[] = [
        {
            title: "Upload PDF",
            description: "Drag & drop the protected PDF file you want to unlock.",
            icon: "upload-cloud"
        },
        {
            title: "Enter Password",
            description: "Enter the current document password to decrypt the file.",
            icon: "key"
        },
        {
            title: "Unlock & Download",
            description: "Instantly remove the protection and download your unlocked PDF.",
            icon: "unlock"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Instant Unlocking",
            description: "Remove restrictive passwords from your PDFs in seconds.",
            icon: "zap"
        },
        {
            title: "100% Private",
            description: "Decryption happens in your browser. Your file and password never touch our servers.",
            icon: "shield-check"
        },
        {
            title: "Maintain Quality",
            description: "Unlocking your PDF simply removes the encryption; the contents and formatting remain untouched.",
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
            toolComponent={<UnlockPdfTool />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
        />
    );
}
