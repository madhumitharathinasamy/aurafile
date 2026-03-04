import type { Metadata } from "next";
import { ProtectPdfToolLoader } from "./ProtectPdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const metadata: Metadata = {
    title: "Protect PDF – Encrypt & Password | Aura File",
    description: "Encrypt your PDF files with a secure password online. Prevent unauthorized access instantly.",
    alternates: {
        canonical: "https://aurafile.net/protect-pdf",
    },
};

export default function ProtectPdfPage() {
    const steps: Step[] = [
        {
            title: "Upload PDF",
            description: "Drag & drop the PDF file you want to secure.",
            icon: "upload-cloud"
        },
        {
            title: "Set Password",
            description: "Enter a strong password to encrypt your document.",
            icon: "key"
        },
        {
            title: "Encrypt & Download",
            description: "Apply encryption and download your protected PDF instantly.",
            icon: "lock"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Strong Encryption",
            description: "Uses industry-standard AES encryption to ensure your documents remain secure.",
            icon: "shield"
        },
        {
            title: "Client-Side Processing",
            description: "Encryption happens in your browser. Your file and password are never sent to our servers.",
            icon: "eye-off"
        },
        {
            title: "Universal Compatibility",
            description: "Protected PDFs can be opened on any device with the correct password.",
            icon: "globe"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "Can I recover a lost password?",
            answer: "No. Since we don't store your passwords or files, there is no way for us to recover a lost password. Please remember it."
        },
        {
            question: "Is it secure?",
            answer: "Yes, absolutely. The encryption is performed locally on your device using standard web cryptographic libraries."
        },
        {
            question: "Is there a file size limit?",
            answer: "Since processing is local, the limit depends on your device's memory. Most standard PDF documents work perfectly."
        }
    ];

    return (
        <ToolPageLayout
            title="Protect PDF"
            description="Encrypt your PDF with a password for enhanced security. Keep your sensitive documents safe."
            toolComponent={<ProtectPdfToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
        />
    );
}
