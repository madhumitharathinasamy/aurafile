import { Metadata } from 'next';
import { PageTitle, SectionDescription } from '@/components/ui/typography';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms and conditions for utilizing AuraFile\'s client-side processing tools.',
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-white pt-16 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <PageTitle>Terms of Service</PageTitle>
                    <SectionDescription className="mt-4">
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </SectionDescription>
                </div>

                <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-[#00B4D8]">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing, browsing, or utilizing the web applications hosted on AuraFile (aurafile.net), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our services.
                    </p>

                    <h2>2. Description of Service</h2>
                    <p>
                        AuraFile provides a suite of entirely client-side, browser-based tools for manipulating, compressing, converting, and analyzing Image and PDF files. The service is provided "AS IS" and is completely free of charge. Because processing occurs heavily on the user's local device, the performance of the service is dependent upon the user's hardware specifications (CPU, RAM).
                    </p>

                    <h2>3. User Responsibilities & Lawful Use</h2>
                    <p>You agree to use AuraFile only for lawful purposes. You are strictly prohibited from using our tools to:</p>
                    <ul>
                        <li>Remove passwords, digital rights management (DRM), or copyright protections from files you do not legally own or have explicit permission to modify.</li>
                        <li>Process illegal imagery, maliciously forged documents, or content intended for fraud.</li>
                        <li>Attempt to reverse-engineer, decompile, or launch automated scraping attacks against the structural WebAssembly (WASM) components hosted on our domains.</li>
                    </ul>

                    <h2>4. Data Custody and Liability</h2>
                    <p>
                        AuraFile is a zero-trust platform. All file manipulation occurs locally within your web browser. <strong>We do not maintain backups, cloud copies, or server logs of your processed files.</strong>
                    </p>
                    <p>
                        Consequently, you are solely responsible for ensuring you have adequate backups of your files prior to using our compression, resizing, or background removal tools. AuraFile assumes no liability for accidental data loss, corrupted outputs, or irreversible modifications made to your files through the use of our web application.
                    </p>

                    <h2>5. Intellectual Property</h2>
                    <p>
                        The branding, UI design, text, logos, and custom structural code (excluding open-source WASM libraries legally utilized under MIT/Apache licenses) are the intellectual property of AuraFile. You may not duplicate, copy, or reuse any portion of our visual design elements without express written permission.
                    </p>

                    <h2>6. Disclaimer of Warranties</h2>
                    <p>
                        YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. AURAFILE EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p>
                        We do not guarantee that the service will be entirely free of bugs, errors, or temporary rendering glitches, particularly on outdated or unsupported mobile browsers.
                    </p>

                    <h2>7. Changes to Terms</h2>
                    <p>
                        AuraFile reserves the right to update or replace these Terms of Service at any given time without direct notification to individual users. Continued use of the website following any changes constitutes your formal acceptance of the new Terms.
                    </p>

                    <h2>8. Contact Information</h2>
                    <p>
                        For any clarifications regarding these Terms of Service, please reach out to us at <strong>team@aurafile.net</strong>.
                    </p>
                </article>
            </div>
        </main>
    );
}
