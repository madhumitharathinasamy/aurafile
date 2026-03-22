import type { Metadata } from 'next';
import { RemoveBgToolLoader } from './RemoveBgToolLoader';
import ToolPageLayout, { Step, Benefit, FAQItem } from '@/components/tools/ToolPageLayout';

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: 'Remove Image Background Free � On-Device AI | AuraFile',
    description: 'Remove image backgrounds using AI that runs locally in your browser. Your photos are never uploaded. Free, private, no accounts needed.',
    alternates: {
        canonical: 'https://aurafile.net/remove-background',
    },
};

export default function RemoveBackgroundPage() {
    const steps: Step[] = [
        {
            title: "Remove Background Free - No Upload | AuraFile",
            description: "Remove image backgrounds instantly with AI, entirely in your browser. No uploads, no cloud processing. 100% private background remover.",
            icon: "upload-cloud"
        },
        {
            title: "Remove Background Free - No Upload | AuraFile",
            description: "Remove image backgrounds instantly with AI, entirely in your browser. No uploads, no cloud processing. 100% private background remover.",
            icon: "wand-2"
        },
        {
            title: "Remove Background Free - No Upload | AuraFile",
            description: "Remove image backgrounds instantly with AI, entirely in your browser. No uploads, no cloud processing. 100% private background remover.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Remove Background Free - No Upload | AuraFile",
            description: "Remove image backgrounds instantly with AI, entirely in your browser. No uploads, no cloud processing. 100% private background remover.",
            icon: "shield-check"
        },
        {
            title: "Remove Background Free - No Upload | AuraFile",
            description: "Remove image backgrounds instantly with AI, entirely in your browser. No uploads, no cloud processing. 100% private background remover.",
            icon: "zap"
        },
        {
            title: "Remove Background Free - No Upload | AuraFile",
            description: "Remove image backgrounds instantly with AI, entirely in your browser. No uploads, no cloud processing. 100% private background remover.",
            icon: "layers"
        }
    ];

    const faq: FAQItem[] = [
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
            description="Remove image backgrounds instantly using on-device AI. 100% private � no uploads, no accounts."
            toolComponent={<RemoveBgToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "AI Background Remover", href: "/remove-background" }
            ]}
        />
    );
}
