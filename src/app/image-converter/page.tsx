import { Metadata } from "next";
import { ConvertToolLoader } from "./ConvertToolLoader";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { ImageConverterPower } from "./ImageConverterPower";

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: "Convert Images Free - JPG PNG WebP HEIC | AuraFile",
    description: "Convert images to JPG, PNG, WebP, AVIF and more in your browser. No file uploads. Supports HEIC from iPhone. Free, private, and instant.",
    alternates: {
        canonical: "https://aurafile.net/image-converter",
    },
};

export default function ConvertPage() {
    const schemaData = {
        name: "AuraFile Image Converter",
        description: "Convert images to JPG, PNG, WebP, AVIF, and HEIC natively in your browser.",
        url: "https://aurafile.net/image-converter",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Convert Image"
            description="The ultimate browser-based image converter. Transform JPG, PNG, WebP, AVIF, HEIC, and more instantly."
            toolComponent={<ConvertToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Convert Image", href: "/image-converter" }
            ]}
            longFormContent={<ImageConverterPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/image-converter"
        />
    );
}
