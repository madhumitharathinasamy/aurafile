import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import RenameTool from "@/components/tools/RenameTool";

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Rename Files in Bulk - Private, No Upload | AuraFile",
  description: "Batch rename files with prefix, suffix, numbering and more. 100% browser-based, no uploads required. Free bulk file renamer.",
  alternates: {
    canonical: "https://aurafile.net/rename-files",
  },
};

export default function BulkRenamePage() {
  const howItWorks = [
    {
      title: "Rename Files in Bulk - Private, No Upload | AuraFile",
      description: "Batch rename files with prefix, suffix, numbering and more. 100% browser-based, no uploads required. Free bulk file renamer.",
      icon: "upload" as const
    },
    {
      title: "Rename Files in Bulk - Private, No Upload | AuraFile",
      description: "Batch rename files with prefix, suffix, numbering and more. 100% browser-based, no uploads required. Free bulk file renamer.",
      icon: "settings" as const
    },
    {
      title: "Rename Files in Bulk - Private, No Upload | AuraFile",
      description: "Batch rename files with prefix, suffix, numbering and more. 100% browser-based, no uploads required. Free bulk file renamer.",
      icon: "download" as const
    }
  ];

  const benefits = [
    {
      title: "Rename Files in Bulk - Private, No Upload | AuraFile",
      description: "Batch rename files with prefix, suffix, numbering and more. 100% browser-based, no uploads required. Free bulk file renamer.",
      icon: "shield-check" as const
    },
    {
      title: "Rename Files in Bulk - Private, No Upload | AuraFile",
      description: "Batch rename files with prefix, suffix, numbering and more. 100% browser-based, no uploads required. Free bulk file renamer.",
      icon: "zap" as const
    },
    {
      title: "Rename Files in Bulk - Private, No Upload | AuraFile",
      description: "Batch rename files with prefix, suffix, numbering and more. 100% browser-based, no uploads required. Free bulk file renamer.",
      icon: "sliders" as const
    }
  ];

  const faq = [
    {
      question: "Are my files uploaded to your server?",
      answer: "No. AuraFile processes bulk renaming locally in your browser securely. Your files never leave your device."
    },
    {
      question: "Will this change my original files?",
      answer: "No. The tool reads your files and outputs renamed copies compiled in a convenient ZIP file, leaving your originals exactly as they were."
    },
    {
      question: "Is there a limit on how many files I can rename?",
      answer: "Since the processing happens in your browser, the only limit is your device's memory. You can generally rename hundreds or even thousands of files easily."
    },
    {
      question: "Is this tool free?",
      answer: "Yes, our Bulk File Renaming tool is completely free with no hidden fees or subscriptions."
    }
  ];

  const specs = [
    { label: "Processing", value: "Client-side (Browser)" },
    { label: "File Upload Limit", value: "None (Memory dependent)" },
    { label: "Privacy", value: "100% Secure" },
    { label: "Output Format", value: "ZIP Archive" }
  ];

  return (
    <>
      <ToolPageLayout
        title="Secure Bulk File Renamer"
        description="Organize your documents and images easily. Add numbering, format cases, and replace text instantly. All processing happens safely inside your browser."
        toolComponent={<RenameTool />}
        howItWorks={howItWorks}
        benefits={benefits}
        faq={faq}
        specs={specs}
      />
      {/* Dynamic structured data built specifically for the rename-files tool */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AuraFile Bulk Renamer",
        "url": "https://aurafile.net/rename-files",
        "description": "Securely rename multiple files at once directly in your browser.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      })}} />
    </>
  );
}
