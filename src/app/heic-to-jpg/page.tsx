import type { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import HeicToJpgToolLoader from './HeicToJpgToolLoader';
import HeicToJpgPower from './HeicToJpgPower';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'HEIC to JPG Converter Free | Convert iPhone Photos - AuraFile',
    description: 'Convert HEIC/HEIF images to JPG completely free in your browser. 100% private, no uploads required. Batch convert iPhone photos to JPG fast and secure.',
    alternates: {
        canonical: 'https://aurafile.net/heic-to-jpg',
    },
};

const schemaData = {
    name: "AuraFile HEIC to JPG Converter",
    description: "Convert HEIC images to JPG format directly in your browser. 100% private and secure, with zero data uploads to external servers.",
    url: "https://aurafile.net/heic-to-jpg",
    applicationCategory: "MultimediaApplication",
};

export default function HeicToJpgPage() {
    return (
        <ToolPageLayout
            title="HEIC to JPG Converter"
            description="Convert iPhone photos (.heic) to standard JPG format instantly. Your photos never leave your device."
            toolComponent={<HeicToJpgToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/#tools" },
                { label: "HEIC to JPG", href: "/heic-to-jpg" }
            ]}
            longFormContent={<HeicToJpgPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            theme="blue"
        />
    );
}
