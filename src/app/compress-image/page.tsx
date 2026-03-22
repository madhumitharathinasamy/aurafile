import { Metadata } from "next";
import { CompressToolLoader } from "./CompressToolLoader";
import ToolPageLayout, { Step, Benefit, FAQItem } from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';


export const metadata: Metadata = {
    title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
    description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
    alternates: {
        canonical: "https://aurafile.net/compress-image",
    },
};

export default function CompressPage() {
    const steps: Step[] = [
        {
            title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
            description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
            icon: "upload-cloud"
        },
        {
            title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
            description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
            icon: "sliders"
        },
        {
            title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
            description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
            icon: "download"
        }
    ];

    const benefits: Benefit[] = [
        {
            title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
            description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
            icon: "cpu"
        },
        {
            title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
            description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
            icon: "layers"
        },
        {
            title: "Compress Images Free \u2013 No Upload, Stays on Your Device",
            description: "Reduce JPG, PNG & WebP file size directly in your browser. No uploads, no accounts, no data sent anywhere. Instant results, free.",
            icon: "lock"
        }
    ];

    const faq: FAQItem[] = [
        {
            question: "Does compressing images reduce quality?",
            answer: "Our smart compression algorithms significantly reduce file size while maintaining visual quality that is often indistinguishable from the original."
        },
        {
            question: "What is the maximum file size?",
            answer: "Each image can be up to 25MB. You can upload and process up to 10 images simultaneously."
        },
        {
            question: "Are my images uploaded to your servers?",
            answer: "No. All compression happens locally in your browser. Your files never leave your device."
        },
        {
            question: "Is this tool free?",
            answer: "Yes, AuraFile Image Compressor is 100% free to use with no hidden costs."
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
        />
    );
}
