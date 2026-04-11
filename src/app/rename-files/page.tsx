import { Metadata } from 'next';
import RenameTool from '@/components/tools/RenameTool';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { RenameFilesPower } from './RenameFilesPower';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Batch Rename Files Free | Private & Secure Offline Renamer \u2013 AuraFile",
    description: "Rename hundreds of files effortlessly in your browser. Apply prefixes, suffixes, and numbering securely offline. 100% private, no uploads.",
    alternates: {
        canonical: 'https://aurafile.net/rename-files',
    },
};

export default function RenameFilesPage() {
    const schemaData = {
        name: "AuraFile Batch Renamer",
        description: "Batch rename files efficiently with find and replace, prefix, suffix, and numeration directly in your browser.",
        url: "https://aurafile.net/rename-files",
        applicationCategory: "UtilitiesApplication"
    };

    return (
        <ToolPageLayout
            title="Batch Rename Files"
            description="Organize your workspace instantly. Apply prefixes, replace text, and number your files sequentially completely offline in your browser."
            toolComponent={<RenameTool />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Utility Tools", href: "/#tools" },
                { label: "Rename Files", href: "/rename-files" }
            ]}
            longFormContent={<RenameFilesPower />}
            isPowerLayout={true}
            schemaData={schemaData}
            canonicalUrl="https://aurafile.net/rename-files"
        />
    );
}
