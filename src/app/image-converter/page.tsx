import { Metadata } from "next";
import { ConvertToolLoader } from "./ConvertToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
    description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
    alternates: {
        canonical: "https://aurafile.net/image-converter",
    },
};

export default function ConvertPage() {
    const steps: Step[] = [
        {
            title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
            description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
            icon: "upload-cloud"
        },
        {
            title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
            description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
            icon: "settings"
        },
        {
            title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
            description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
            description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
            icon: "shield-check"
        },
        {
            title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
            description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
            icon: "zap"
        },
        {
            title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
            description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
            icon: "star"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "Is it free to use?",
            answer: "Yes, AuraFile Image Converter is completely free with no limits on daily conversions."
        },
        {
            question: "Can I convert HEIC files from iPhone?",
            answer: "Absolutely! We support HEIC to JPG conversion directly in your browser, perfect for Windows or Android users."
        },
        {
            question: "Does it support transparency?",
            answer: "Yes, converting to PNG, WebP, or AVIF preserves transparency. If converting to JPG, you can choose a background color."
        }
    ];

    return (
        <ToolPageLayout
            title="Convert Image"
            description="The ultimate browser-based image converter. Transform JPG, PNG, WebP, AVIF, HEIC, and more instantly."
            toolComponent={<ConvertToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Convert Image", href: "/image-converter" }
            ]}
        />
    );
}
