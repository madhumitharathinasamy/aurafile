import type { Metadata } from 'next';
import CategoryPageLayout, { type CategoryTool } from '@/components/sections/CategoryPageLayout';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Free Image Tools | AuraFile',
    description: 'Browser-based image utilities including compression, resizing, format conversion, and AI background removal. 100% private and fast.',
    alternates: {
        canonical: 'https://aurafile.net/image-tools',
    },
};

export default function ImageToolsPage() {
    const tools = siteConfig.home.tools.image as CategoryTool[];
    
    const faq = [
        {
            question: "Does the AI background remover process locally?",
            answer: "Yes! When you first use it, your browser downloads a compact AI model caching it locally. All subsequent background removals run on your device's hardware, meaning your photos stay private."
        },
        {
            question: "What image formats can I convert and compress?",
            answer: "We support a wide range of formats including standard JPG, PNG, and WebP, as well as high-efficiency formats like HEIC (from iPhones), TIFF, and BMP."
        },
        {
            question: "Will compression reduce my image quality?",
            answer: "Our intelligent compression algorithms strip unnecessary metadata and optimize color profiles to reduce file size significantly while maintaining near-perfect visual fidelity."
        }
    ];

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Image Tools", href: "/image-tools" }
    ];

    return (
        <CategoryPageLayout
            title="Image Tools"
            description="Optimize, edit, and convert your images instantly using your device's CPU. Your photos never touch a cloud server."
            icon="image"
            tools={tools}
            faq={faq}
            breadcrumbs={breadcrumbs}
        />
    );
}
