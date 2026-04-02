import { Metadata } from 'next';
import { PageTitle, SectionDescription } from '@/components/ui/typography';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Understand how AuraFile protects your privacy through 100% client-side processing.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white pt-16 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <PageTitle>Privacy Policy</PageTitle>
                    <SectionDescription className="mt-4">
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </SectionDescription>
                </div>

                <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-[#00B4D8]">
                    <h2>1. Core Architecture &amp; Philosophy</h2>
                    <p>
                        At AuraFile (aurafile.net), we believe privacy is a fundamental human right. Unlike traditional web-based file manipulation tools that require you to upload your documents to a cloud server, our entire platform operates on a <strong>client-side architecture</strong>.
                    </p>
                    <p>
                        This means that when you use our Image Compressors, PDF Mergers, or AI Background Removers, the required software logic is downloaded directly into your web browser. The actual processing of your files occurs securely in your device&apos;s active memory (RAM). <strong>We never upload, transmit, view, or store your actual files on our servers.</strong>
                    </p>

                    <h2>2. Information We Do Not Collect</h2>
                    <p>Because of our strict local-processing environment, we categorically <strong>DO NOT</strong> collect, harvest, or process:</p>
                    <ul>
                        <li>The contents, metadata, or titles of the images and PDFs you edit.</li>
                        <li>Any textual data extracted during OCR or PDF-to-Word conversions.</li>
                        <li>Passwords used to lock or unlock your PDF files.</li>
                    </ul>

                    <h2>3. Information We Collect (Analytics &amp; Advertising)</h2>
                    <p>
                        To operate, maintain, and monetize our free platform, we rely on standard third-party web analytics and advertising networks. These networks automatically collect certain non-personally identifiable information:
                    </p>
                    <ul>
                        <li><strong>Google Analytics:</strong> We utilize Google Analytics to understand basic traffic patterns, such as which tools are most popular, what geographic regions our users come from (down to the city level), and what web browsers are being used. This data helps us allocate resources for future development.</li>
                        <li><strong>Google AdSense:</strong> Our service is provided free of charge thanks to advertising revenue. Google AdSense and its partners may use cookies or web beacons to serve personalized advertisements based on your prior visits to our website or other websites on the internet.</li>
                    </ul>

                    <h2>4. Cookies and Web Beacons</h2>
                    <p>
                        A &quot;cookie&quot; is a small text file stored on your browser. We use cookies primarily for tracking user consent (such as acknowledging our cookie banner) and for third-party advertising networks. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites.
                    </p>
                    <p>
                        Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. You can also opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
                    </p>
                    <p>
                        You have the ability to accept or decline cookies through your browser settings. However, opting out of cookies may affect the personalization of the advertisements you see. For users in the European Economic Area (EEA), the UK, and Switzerland, you can manage or revoke your consent at any time via the &quot;Cookie Settings&quot; link found in our website footer.
                    </p>

                    <h2>5. Third-Party Links</h2>
                    <p>
                        Our website or blog articles may contain links to external third-party websites. Please note that we do not govern the privacy protocols of these external domains. We encourage you to review the Privacy Policies of any website you visit when leaving AuraFile.
                    </p>

                    <h2>6. Children&apos;s Privacy</h2>
                    <p>
                        AuraFile&apos;s tools are designed for general audiences and professionals. We do not knowingly target or collect personal information from children under the age of 13. If you believe your child has provided us with personal contact information, please reach out to us so we can delete their data from our analytics records.
                    </p>

                    <h2>7. Changes to This Privacy Policy</h2>
                    <p>
                        We reserve the right to modify this Privacy Policy at any time. Any changes will be published on this page immediately. We recommend users periodically check this page to stay informed about how we are protecting their privacy.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions, concerns, or technical inquiries regarding this Privacy Policy or our client-side infrastructure, please contact us at: <strong>team@aurafile.net</strong>.
                    </p>
                </article>
            </div>
        </main>
    );
}
