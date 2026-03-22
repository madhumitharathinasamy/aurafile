import { Metadata } from 'next';
import { CompressToolLoader } from './CompressToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { CompressImageArticle } from './CompressImageArticle';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
    description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
    alternates: {
        canonical: 'https://aurafile.net/compress-image',
    },
};

export default function CompressImagePage() {
    const steps = [
        {
            title: "Select Images",
            description: "Choose one or multiple images form your device. We support JPG, PNG, and WebP formats.",
            icon: "upload" as const
        },
        {
            title: "Adjust Settings",
            description: "Choose your desired compression level. The tool will show you a preview of the size reduction.",
            icon: "settings" as const
        },
        {
            title: "Download Optimized",
            description: "Save the compressed images individually or as a ZIP file. Everything happens instantly.",
            icon: "download" as const
        }
    ];

    const benefits = [
        {
            title: "Client-Side Processing",
            description: "Your images never leave your device. All compression happens locally in your browser for absolute privacy and maximum speed.",
            icon: "shield" as const
        },
        {
            title: "Smart Compression",
            description: "Advanced algorithms drastically reduce file sizes while maintaining visual quality, perfect for web optimization.",
            icon: "zap" as const
        },
        {
            title: "Batch Support",
            description: "Compress multiple images simultaneously. Our tool utilizes your device's multi-core processor for parallel compression.",
            icon: "layers" as const
        }
    ];

    const faq = [
        {
            question: "Are my photos uploaded to a server?",
            answer: "No. Our tool uses WebAssembly to compress your images directly inside your web browser. Your photos never leave your device, ensuring 100% privacy."
        },
        {
            question: "Is there a file size limit?",
            answer: "Because we don't use servers, there are no artificial file size limits. However, extremely large images may be constrained by the available RAM on your specific device."
        },
        {
            question: "What formats do you support?",
            answer: "We currently support compressing JPG, PNG, and WebP images."
        }
    ];

    return (
        <ToolPageLayout
            title="Compress Image"
            description="Reduce image file size securely in your browser without uploading files. Fast, free, and private."
            toolComponent={<CompressToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Compress Image", href: "/compress-image" }
            ]}
            longFormContent={<CompressImageArticle />}
        />
    );
}
