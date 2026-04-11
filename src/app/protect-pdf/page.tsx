import { Metadata } from 'next';
import { ProtectPdfToolLoader } from './ProtectPdfToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { ProtectPdfPower } from './ProtectPdfPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Protect PDF with Password | Encrypt Securely Free \u2013 AuraFile",
    description: "Add a secure password to your PDF document completely offline in your browser. Encrypt files with AES-128. 100% private, no uploads.",
    alternates: {
        canonical: 'https://aurafile.net/protect-pdf',
    },
};

export default function ProtectPdfPage() {
    const schemaData = {
        name: "AuraFile PDF Encryptor",
        description: "Secure PDF files with strong cryptographic passwords locally in your browser.",
        url: "https://aurafile.net/protect-pdf",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Protect PDF"
            description="Secure your sensitive documents from unauthorized access. Encrypt your PDFs with military-grade passwords offline in your browser."
            toolComponent={<ProtectPdfToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/#tools" },
                { label: "Protect PDF", href: "/protect-pdf" }
            ]}
            longFormContent={<ProtectPdfPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/protect-pdf"
        />
    );
}
