import type { Metadata } from "next";
import { ProtectPdfToolLoader } from "./ProtectPdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Password Protect PDF - No Upload | AuraFile",
    description: "Add a password to your PDF instantly in your browser. Your file never leaves your device. 100% private PDF protection. Free.",
    alternates: {
        canonical: "https://aurafile.net/protect-pdf",
    },
};

export default function ProtectPdfPage() {
    const steps: Step[] = [
        {
            title: "Password Protect PDF - No Upload | AuraFile",
            description: "Add a password to your PDF instantly in your browser. Your file never leaves your device. 100% private PDF protection. Free.",
            icon: "upload-cloud"
        },
        {
            title: "Password Protect PDF - No Upload | AuraFile",
            description: "Add a password to your PDF instantly in your browser. Your file never leaves your device. 100% private PDF protection. Free.",
            icon: "key"
        },
        {
            title: "Password Protect PDF - No Upload | AuraFile",
            description: "Add a password to your PDF instantly in your browser. Your file never leaves your device. 100% private PDF protection. Free.",
            icon: "lock"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Password Protect PDF - No Upload | AuraFile",
            description: "Add a password to your PDF instantly in your browser. Your file never leaves your device. 100% private PDF protection. Free.",
            icon: "shield"
        },
        {
            title: "Password Protect PDF - No Upload | AuraFile",
            description: "Add a password to your PDF instantly in your browser. Your file never leaves your device. 100% private PDF protection. Free.",
            icon: "eye-off"
        },
        {
            title: "Password Protect PDF - No Upload | AuraFile",
            description: "Add a password to your PDF instantly in your browser. Your file never leaves your device. 100% private PDF protection. Free.",
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
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/pdf-tools" },
                { label: "Protect PDF", href: "/protect-pdf" }
            ]}
        />
    );
}
