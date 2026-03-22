import type { Metadata } from 'next';
import { PdfToWordToolLoader } from './PdfToWordToolLoader';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { PdfToWordArticle } from './PdfToWordArticle';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Convert PDF to Word Free \u2013 Private, No Upload',
    description: 'Convert PDF files to editable Microsoft Word (.docx) documents securely. Processed locally in your browser, ensuring 100% privacy.',
    alternates: {
        canonical: 'https://aurafile.net/pdf-to-word',
    },
};

export default function PdfToWordPage() {
    const steps = [
        {
            title: "Select PDF",
            description: "Upload the PDF document you wish to convert. The file is loaded securely into your browser's memory.",
            icon: "upload-cloud" as const
        },
        {
            title: "Wait for Conversion",
            description: "Our advanced algorithm analyzes the text, fonts, and layout to accurately reconstruct the document.",
            icon: "layers" as const
        },
        {
            title: "Download Word Doc",
            description: "Instantly download the fully editable .docx file to your device.",
            icon: "download" as const
        }
    ];

    const benefits = [
        {
            title: "Maximum Privacy",
            description: "Convert sensitive financial or legal documents safely. Your PDFs are never uploaded to our servers; everything executes locally.",
            icon: "shield" as const
        },
        {
            title: "Accurate Layouts",
            description: "Our converter preserves complex formatting, paragraphs, tables, and images to perfectly match the original PDF.",
            icon: "file-text" as const
        },
        {
            title: "Free and Unlimited",
            description: "Unlike cloud tools that charge a premium per document, our local conversion process allows for unlimited usage at zero cost.",
            icon: "check-circle" as const
        }
    ];

    const faq = [
        {
            question: "Is this tool completely free?",
            answer: "Yes. Our conversion executes entirely on your local machine, allowing us to offer the service without limits or paywalls."
        },
        {
            question: "Are my documents uploaded to a cloud server?",
            answer: "No. Your PDF files stay perfectly secure because they are never transmitted over the internet during the conversion process."
        },
        {
            question: "Does this work on scanned PDFs?",
            answer: "Currently, this tool extracts text from natively generated PDFs. If you have a scanned image of a document, you will need to utilize an OCR (Optical Character Recognition) tool first."
        }
    ];

    return (
        <ToolPageLayout
            title="Convert PDF to Word"
            description="Securely transform your PDF files into editable Microsoft Word (.docx) documents. Fast, free, and 100% private."
            toolComponent={<PdfToWordToolLoader />}
            howItWorks={steps}
            benefits={benefits}
            faq={faq}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "PDF Tools", href: "/pdf-tools" },
                { label: "Convert PDF to Word", href: "/pdf-to-word" }
            ]}
            longFormContent={<PdfToWordArticle />}
        />
    );
}
