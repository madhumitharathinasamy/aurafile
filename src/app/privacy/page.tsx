import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/config/site";
import { VisualNetworkMonitor } from "@/components/privacy/VisualNetworkMonitor";

export const metadata: Metadata = {
    title: "Privacy Policy | Zero-Trust Architecture",
    description: "AuraFile Privacy Policy. Learn about our 100% client-side, zero-trust WASM architecture and our AdSense data handling.",
    alternates: {
        canonical: 'https://aurafile.net/privacy',
    },
};

export default function PrivacyPage() {
    return (
        <>
            <PageHeader
                title="Privacy Policy & Technical Whitepaper"
                subtitle={`Last Updated: ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}
            />

            <main className="container mx-auto max-w-[800px] pb-12 px-4 md:pb-12">
                <VisualNetworkMonitor />
                <div className="flex flex-col gap-12 mt-8 prose prose-slate max-w-none prose-h2:text-2xl prose-h2:text-slate-900 prose-a:text-[#00B4D8] prose-a:no-underline hover:prose-a:underline">

                    <section>
                        <h2>1. Core Premise: Zero-Trust Client-Side Processing</h2>
                        <p>
                            At AuraFile, we operate on a fundamental principle of data sovereignty: your documents belong to you. To ensure absolute privacy, we have engineered a <strong>100% serverless data-processing architecture</strong>.
                        </p>
                        <p>
                            Unlike traditional web utilities that require you to upload your sensitive PDFs or images to a remote corporate server, AuraFile utilizes WebAssembly (WASM) to process your files securely within the localized active memory (RAM) of your own web browser.
                        </p>
                        <ul>
                            <li><strong>Zero Uploads:</strong> Your files never traverse the public internet.</li>
                            <li><strong>Zero Server Access:</strong> We literally do not possess backend servers capable of receiving or storing your documents.</li>
                            <li><strong>Zero Retention:</strong> The moment you close your browser tab, the temporary local memory is flushed natively by your operating system.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Information We DO NOT Collect</h2>
                        <p>
                            Because of our zero-trust architecture, it is physically impossible for us to collect, view, monitor, or sell your files. Specifically, we <strong>do not</strong> collect:
                        </p>
                        <ul>
                            <li>The contents of any PDF or Document you manipulate.</li>
                            <li>Images, metadata (EXIF data), or contextual tags from your graphics.</li>
                            <li>Passwords used to lock or unlock documents (since cryptography happens locally).</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Telemetry and Analytics</h2>
                        <p>
                            While your processing data is strictly local, we do utilize anonymous analytical tools (such as Google Analytics and Vercel Analytics) to monitor the aggregate health and performance of the website itself.
                        </p>
                        <p>
                            These tools collect non-personally identifiable information, including:
                        </p>
                        <ul>
                            <li>Browser type and generalized device categories (e.g., Mobile vs. Desktop).</li>
                            <li>Diagnostic timing for load speeds to ensure our WASM engines are performing optimally.</li>
                            <li>Pages visited and generalized country-level geolocation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Advertising and Cookies (Google AdSense)</h2>
                        <p>
                            To maintain our enterprise-grade tools entirely for free, AuraFile utilizes <strong>Google AdSense</strong> to display advertisements. To serve relevant ads, third-party vendors, including Google, use cookies based on a user's prior visits to this website or other websites.
                        </p>
                        <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg">
                            <h3 className="text-lg font-bold text-slate-800 mt-0 mb-3">Google DoubleClick DART Cookie Notice</h3>
                            <ul className="mb-0">
                                <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to AuraFile and/or other sites on the Internet.</li>
                                <li>Users may strictly <strong>opt out of personalized advertising</strong> by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
                                <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2>5. Security Protocol & Updates</h2>
                        <p>
                            We maintain AuraFile using industry-leading transport layer security (HTTPS) for serving the application scripts, ensuring that your connection to our interface is immune to Man-in-the-Middle attacks. We reserve the right to update this policy to reflect any architectural enhancements in WebAssembly or browser APIs.
                        </p>
                    </section>

                    <section>
                        <h2>6. Contact Us</h2>
                        <p>
                            If you have questions regarding this architecture, code auditing, or general privacy inquiries, please reach out to our engineering team at <a href={`mailto:${siteConfig.links.email}`}>{siteConfig.links.email}</a> or visit our <a href="/contact">Contact Page</a>.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
