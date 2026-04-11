import { Metadata } from "next";
import { ResizeToolLoader } from "./ResizeToolLoader";
import { ResizeImagePower } from './ResizeImagePower';
import ToolPageLayout from "@/components/tools/ToolPageLayout";

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: "Resize Image Free - No Upload, 100% Private | AuraFile",
    description: "Resize images by pixel or percentage directly in your browser. No server uploads, no data stored. Free, private image resizer.",
    alternates: {
        canonical: "https://aurafile.net/resize-image",
    },
};

export default function ResizePage() {
    const schemaData = {
        name: "AuraFile Image Resizer",
        description: "Resize images to exact pixel dimensions securely in your browser.",
        url: "https://aurafile.net/resize-image",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Resize Image"
            description="Change dimensions of your images quickly and securely. Adjust width, height, or scale by percentage using your browser."
            toolComponent={<ResizeToolLoader />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Image Tools", href: "/image-tools" },
                { label: "Resize Image", href: "/resize-image" }
            ]}
            longFormContent={<ResizeImagePower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/resize-image"
        />
    );
}
