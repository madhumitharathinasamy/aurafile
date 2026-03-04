import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Aura File Privacy Policy - How we handle your data.",
};

import { siteConfig } from "@/config/site";

export default function PrivacyPage() {
    return (
        <>
            <PageHeader
                title="Privacy Policy"
                subtitle={`Last Updated: ${new Date().toLocaleDateString()}`}
            />

            <main className="container mx-auto max-w-[800px] pb-12 px-4 md:pb-12">
                <div className="flex flex-col gap-12">

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>ℹ️</span> 1. Information We Collect
                        </h2>
                        <p className="mb-6 leading-relaxed text-muted-foreground">
                            Our mission is to process your images without compromising your privacy. When you use Aura File tools:
                        </p>
                        <ul className="flex flex-col gap-4">
                            <li className="rounded-md border-l-4 border-primary bg-surface p-5 shadow-sm">
                                <strong className="mb-1 block text-foreground">User Files</strong>
                                <span className="leading-relaxed text-text-secondary">Images you upload are processed either strictly in your browser or temporarily on our secure servers.</span>
                            </li>
                            <li className="rounded-md border-l-4 border-primary bg-surface p-5 shadow-sm">
                                <strong className="mb-1 block text-foreground">Auto-Deletion</strong>
                                <span className="leading-relaxed text-text-secondary">For server-side tools, files are automatically deleted immediately after processing or within 1 hour.</span>
                            </li>
                            <li className="rounded-md border-l-4 border-primary bg-surface p-5 shadow-sm">
                                <strong className="mb-1 block text-foreground">No Permanent Storage</strong>
                                <span className="leading-relaxed text-text-secondary">We do strictly NOT store your images permanently.</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>🛠️</span> 2. How We Use Information
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            We use the data solely to provide the service you requested (e.g., resizing an image). We do not sell, trade, or share your personal files with third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>🍪</span> 3. Cookies & Analytics
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            We use minimal cookies necessary for website functionality and anonymous analytics (e.g., Google Analytics) to improve our performance. You can disable cookies in your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>🔒</span> 4. Security
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            We implement industry-standard security measures including SSL/TLS encryption for data in transit and automatic cleanup scripts for data at rest.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>📫</span> 5. Contact Us
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            If you have questions about this Privacy Policy, please contact us at <a href={`mailto:${siteConfig.links.email}`} className="text-primary hover:underline">{siteConfig.links.email}</a>.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
