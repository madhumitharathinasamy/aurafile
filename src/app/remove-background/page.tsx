import type { Metadata } from 'next';
import { RemoveBgToolLoader } from './RemoveBgToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { RemoveBackgroundArticle } from './RemoveBackgroundArticle';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Remove Image Background Free \u2013 On-Device AI | AuraFile',
    description: 'Remove image backgrounds using AI that runs locally in your browser. Your photos are never uploaded. Free, private, no accounts needed.',
    alternates: {
        canonical: 'https://aurafile.net/remove-background',
    },
};

export default function RemoveBackgroundPage() {
    const steps = [
        {
            title: "Upload Image",
            description: "Select an image with a clear subject. For the first run, the AI model will briefly download directly to your browser cache.",
            icon: "upload-cloud" as const
        },
        {
            title: "AI Processing",
            description: "The local AI model securely isolates the subject from the background using your device's GPU.",
            icon: "wand-2" as const
        },
        {
            title: "Save Transparent PNG",
            description: "Download the perfect cutout as a high-resolution PNG file with a transparent background.",
            icon: "download" as const
        }
    ];

    const benefits = [
        {
            title: "Zero Cloud Uploads",
            description: "Because the neural network executes in your browser, your personal or proprietary photos are never uploaded to a server.",
            icon: "shield-check" as const
        },
        {
            title: "Sub-Second Speed",
            description: "After the initial model cache, processing subsequent images is instantaneous because there is no network latency.",
            icon: "zap" as const
        },
        {
            title: "No Subscription Limits",
            description: "Cloud-based AI APIs charge per image. Since you are utilizing your own hardware, usage is completely free and unlimited.",
            icon: "layers" as const
        }
    ];

    const faq = [
        {
            question: "Why does it take a moment on the first use?",
            answer: "The AI model (~50MB for the medium setting) is downloaded once to your browser and then cached. Subsequent uses on the same device are instant."
        },
        {
            question: "What image formats are supported?",
            answer: "You can upload JPG, PNG, and WebP images. Results are exported as PNG (with transparency) or JPG."
        },
        {
            question: "Are my images safe?",
            answer: "Absolutely. The entire AI processing happens locally in your browser. Your images are never sent to our servers."
        },
        {
            question: "Can I choose a different background?",
            answer: "Yes. After removing the background you can choose a transparent background (PNG), a solid color, or a blur effect before downloading."
        },
        {
            question: "Which AI model should I choose?",
            answer: "The 'Medium' model (default) gives the best balance of speed and quality. Use 'Small' for faster processing, or 'Large' for fine hair and complex edges."
        }
    ];

    return (
        <ToolPageLayout
            title="AI Background Remover"
            description="Remove image backgrounds instantly using on-device AI. 100% private \u2014 no uploads, no accounts."
            toolComponent={<RemoveBgToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "AI Background Remover", href: "/remove-background" }
            ]}
            longFormContent={<RemoveBackgroundArticle />}
        />
    );
}
