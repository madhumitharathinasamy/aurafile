import type { Metadata } from "next";
import { ImageToPdfToolLoader } from "./ImageToPdfToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Image to PDF - No Upload, 100% Private | AuraFile",
    description: "Convert JPG, PNG, and WebP images to PDF in seconds. Entirely browser-based, no uploads, no accounts. Free image to PDF converter.",
    alternates: {
        canonical: "https://aurafile.net/image-to-pdf",
    },
};

export default function ImageToPdfPage() {
    const steps: Step[] = [
        {
            title: "Image to PDF - No Upload, 100% Private | AuraFile",
            description: "Convert JPG, PNG, and WebP images to PDF in seconds. Entirely browser-based, no uploads, no accounts. Free image to PDF converter.",
            icon: "image"
        },
        {
            title: "Image to PDF - No Upload, 100% Private | AuraFile",
            description: "Convert JPG, PNG, and WebP images to PDF in seconds. Entirely browser-based, no uploads, no accounts. Free image to PDF converter.",
            icon: "move"
        },
        {
            title: "Image to PDF - No Upload, 100% Private | AuraFile",
            description: "Convert JPG, PNG, and WebP images to PDF in seconds. Entirely browser-based, no uploads, no accounts. Free image to PDF converter.",
            icon: "file-text"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Image to PDF - No Upload, 100% Private | AuraFile",
            description: "Convert JPG, PNG, and WebP images to PDF in seconds. Entirely browser-based, no uploads, no accounts. Free image to PDF converter.",
            icon: "layers"
        },
        {
            title: "Image to PDF - No Upload, 100% Private | AuraFile",
            description: "Convert JPG, PNG, and WebP images to PDF in seconds. Entirely browser-based, no uploads, no accounts. Free image to PDF converter.",
            icon: "globe"
        },
        {
            title: "Image to PDF - No Upload, 100% Private | AuraFile",
            description: "Convert JPG, PNG, and WebP images to PDF in seconds. Entirely browser-based, no uploads, no accounts. Free image to PDF converter.",
            icon: "lock"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "Can I rearrange images?",
            answer: "Yes! Simply drag and drop the image thumbnails to change their order before converting."
        },
        {
            question: "Is there a limit on pages?",
            answer: "You can add as many images as your browser memory allows, but we recommend keeping it under 50 pages for best performance."
        },
        {
            question: "Does it support HEIC?",
            answer: "Currently, we support JPG, PNG, and WebP. For HEIC, please use our Image Converter tool first."
        }
    ];

    return (
        <ToolPageLayout
            title="Convert Images to PDF"
            description="Turn your JPG, PNG, and WebP images into a single PDF document instantly. Organize and share photos easily."
            toolComponent={<ImageToPdfToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            theme="blue"
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/pdf-tools" },
                { label: "Convert Images to PDF", href: "/image-to-pdf" }
            ]}
        />
    );
}
