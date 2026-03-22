import type { Metadata } from "next";
import { CropToolLoader } from "./CropToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Crop Image Free - No Upload Required | AuraFile",
    description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
    alternates: {
        canonical: "https://aurafile.net/crop-image",
    },
};

export default function CropPage() {
    const steps: Step[] = [
        {
            title: "Crop Image Free - No Upload Required | AuraFile",
            description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
            icon: "upload-cloud"
        },
        {
            title: "Crop Image Free - No Upload Required | AuraFile",
            description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
            icon: "crop"
        },
        {
            title: "Crop Image Free - No Upload Required | AuraFile",
            description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Crop Image Free - No Upload Required | AuraFile",
            description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
            icon: "maximize"
        },
        {
            title: "Crop Image Free - No Upload Required | AuraFile",
            description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
            icon: "image"
        },
        {
            title: "Crop Image Free - No Upload Required | AuraFile",
            description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
            icon: "eye"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "Does cropping reduce image quality?",
            answer: "No, cropping simply removes pixels from the edges. The remaining part of the image retains its original quality."
        },
        {
            question: "Can I crop specifically for social media?",
            answer: "Yes! Use our preset aspect ratios to crop perfectly for Instagram, Twitter, and Facebook posts."
        },
        {
            question: "Is it secure?",
            answer: "As with all our tools, your image is processed locally in your browser and never uploaded to our servers."
        }
    ];

    return (
        <ToolPageLayout
            title="Crop Image"
            description="Trim unwanted parts from your photos instantly. Adjust aspect ratios and focus on what matters."
            toolComponent={<CropToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Crop Image", href: "/crop-image" }
            ]}
        />
    );
}
