import { Metadata } from 'next';
import RemoveBackgroundToolLoader from './RemoveBackgroundToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { RemoveBackgroundPower } from './RemoveBackgroundPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Remove Background from Image Free | AI Cutout - AuraFile",
    description: "Remove image backgrounds instantly and accurately using on-device AI. 100% private, no uploads, highly precise object masking.",
    alternates: {
        canonical: "https://aurafile.net/remove-background",
    },
};

export default function RemoveBackgroundPage() {
    const schemaData = {
        name: "AuraFile Background Remover",
        description: "Remove the background from images seamlessly using client-side AI detection algorithms.",
        url: "https://aurafile.net/remove-background",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Remove Background"
            description="Remove the background from any photo instantly using powerful AI that runs entirely in your browser. 100% free and private."
            toolComponent={<RemoveBackgroundToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Remove BG", href: "/remove-background" }
            ]}
            longFormContent={<RemoveBackgroundPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/remove-background"
        />
    );
}
