import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Aura File Terms and Conditions.",
};

export default function TermsPage() {
    return (
        <>
            <PageHeader
                title="Terms of Service"
                subtitle={`Last Updated: ${new Date().toLocaleDateString()}`}
            />

            <main className="container" style={{ paddingBottom: "6rem", maxWidth: "800px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>⚖️</span> 1. Acceptance of Terms
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            By accessing and using Aura File (aurafile.net), you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>📝</span> 2. Use License
                        </h2>
                        <p className="mb-4 leading-relaxed text-muted-foreground">
                            Permission is granted to use our image tools for personal and commercial purposes. However, you agree not to:
                        </p>
                        <ul className="flex flex-col gap-3 pl-0 list-none">
                            <li className="p-3 bg-surface rounded-md text-base text-muted-foreground border border-border">
                                🚫 Upload malicious files or malware.
                            </li>
                            <li className="p-3 bg-surface rounded-md text-base text-muted-foreground border border-border">
                                🚫 Attempt to reverse engineer the software.
                            </li>
                            <li className="p-3 bg-surface rounded-md text-base text-muted-foreground border border-border">
                                🚫 Use the service for illegal activities.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>⚠️</span> 3. Disclaimer
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            The tools on Aura File are provided "as is". We make no warranties, expressed or implied, regarding the reliability or availability of the service, although we strive for 99.9% uptime.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 flex items-center gap-3 text-foreground">
                            <span>✋</span> 4. Limitations
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            In no event shall Aura File be liable for any damages (including, without limitation, damages for loss of data) arising out of the use or inability to use the materials on Aura File's website.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
