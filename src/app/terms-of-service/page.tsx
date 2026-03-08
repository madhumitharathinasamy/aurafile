import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | AuraFile",
    description: "Read the Terms of Service for AuraFile. Understand the rules and regulations for using our website and tools.",
    alternates: {
        canonical: "https://aurafile.net/terms-of-service",
    },
};

export default function TermsOfService() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-16 animate-fade-in">
            <h1 className="mb-8 text-center text-[#00B4D8] font-extrabold text-4xl md:text-5xl tracking-tight">Terms of Service</h1>
            <div className="prose prose-slate max-w-none text-foreground/80">
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

                <h2 className="mt-8 mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using AuraFile ("we", "our", or "us"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">2. Use License</h2>
                <p>
                    Permission is granted to use the tools on AuraFile's website for personal or commercial transitory viewing and processing only. This is the grant of a license, not a transfer of title.
                </p>
                <p className="mt-2">
                    You may not:
                </p>
                <ul className="list-disc pl-6 my-4 space-y-2">
                    <li>Attempt to reverse engineer any software contained on AuraFile's website.</li>
                    <li>Use the website for any illegal purpose or in violation of any local laws.</li>
                    <li>Remove any copyright or other proprietary notations from the materials.</li>
                </ul>

                <h2 className="mt-8 mb-4 text-foreground">3. Disclaimer</h2>
                <p>
                    The materials on AuraFile's website are provided on an 'as is' basis. AuraFile makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">4. Limitations</h2>
                <p>
                    In no event shall AuraFile or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AuraFile's website.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">5. Modifications</h2>
                <p>
                    AuraFile may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">6. Governing Law</h2>
                <p>
                    These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
            </div>
        </main>
    );
}
