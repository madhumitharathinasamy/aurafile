import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Aura File team for support.",
};

import { siteConfig } from "@/config/site";

export default function ContactPage() {
    return (
        <>
            <PageHeader
                title="Contact Us"
                subtitle="Have questions, suggestions, or need help? We're here to assist you."
            />

            <main className="container mx-auto px-4 pb-24 max-w-3xl">
                <div className="p-12 bg-surface rounded-lg border border-border text-center">
                    <h2 className="mb-4 flex items-center justify-center gap-2 text-foreground">
                        <span>📧</span> Email Support
                    </h2>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">
                        For all inquiries, please email us directly. We aim to respond within 24 hours.
                    </p>

                    <a href={`mailto:${siteConfig.links.email}`} className="no-underline">
                        <Button variant="primary">
                            {siteConfig.links.email}
                        </Button>
                    </a>
                </div>
            </main>
        </>
    );
}
