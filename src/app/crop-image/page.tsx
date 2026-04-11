import type { Metadata } from "next";
import { CropToolLoader } from "./CropToolLoader";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { CropImagePower } from './CropImagePower';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: "Crop Image Free - No Upload Required | AuraFile",
    description: "Crop and trim images directly in your browser with no file uploads. Supports JPG, PNG, WebP. Free, private, instant image cropping.",
    alternates: {
        canonical: "https://aurafile.net/crop-image",
    },
};

export default function CropPage() {
    const schemaData = {
        name: "AuraFile Image Cropper",
        description: "Crop and trim images directly in your browser with no file uploads.",
        url: "https://aurafile.net/crop-image",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Crop Image"
            description="Trim unwanted parts from your photos instantly. Adjust aspect ratios and focus on what matters."
            toolComponent={<CropToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Crop Image", href: "/crop-image" }
            ]}
            longFormContent={<CropImagePower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/crop-image"
        />
    );
}
