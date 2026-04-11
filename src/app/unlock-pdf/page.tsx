import { Metadata } from 'next';
import { UnlockPdfToolLoader } from './UnlockPdfToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { UnlockPdfPower } from './UnlockPdfPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Unlock PDF Offline | Remove Password Securely \u2013 AuraFile",
    description: "Remove PDF password security entirely in your web browser. 100% private, no server required. Decrypt your documents securely and instantly.",
    alternates: {
        canonical: 'https://aurafile.net/unlock-pdf',
    },
};

export default function UnlockPdfPage() {
    const schemaData = {
        name: "AuraFile PDF Unlocker",
        description: "Remove password encryption from PDF documents securely within your browser.",
        url: "https://aurafile.net/unlock-pdf",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Unlock PDF"
            description="Strip stubborn encryption and permission passwords from your PDFs entirely offline. Regain full editorial control instantly."
            toolComponent={<UnlockPdfToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/#tools" },
                { label: "Unlock PDF", href: "/unlock-pdf" }
            ]}
            longFormContent={<UnlockPdfPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/unlock-pdf"
        />
    );
}
