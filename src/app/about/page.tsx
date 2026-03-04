import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "About Us | AuraFile",
    description: "Learn about AuraFile, our mission to provide fast, secure, and private browser-based image tools for everyone.",
    alternates: {
        canonical: "https://aurafile.net/about",
    },
};

export default function AboutPage() {
    return (
        <main className="container mx-auto max-w-3xl px-4 py-16 md:py-24 animate-fade-in">
            {/* Header */}
            <h1 className="mb-8 text-center text-[#0081C9] font-extrabold text-4xl md:text-5xl tracking-tight">About AuraFile</h1>
            <p className="text-center text-lg md:text-xl text-muted-foreground mb-16 leading-relaxed max-w-2xl mx-auto">
                AuraFile is a suite of powerful, browser-based file tools designed for speed, privacy, and simplicity.
            </p>

            <div className="space-y-16 text-foreground/90">
                {/* Mission Section */}
                <section>
                    <h2 className="mb-6 text-2xl md:text-4xl font-semibold text-foreground">Our Mission</h2>
                    <p className="mb-4">
                        We believe that simple tasks like resizing an image or converting a file format shouldn't require downloading heavy software, registering for an account, or risking your privacy by uploading files to unknown servers.
                    </p>
                    <p className="mb-8">
                        Our mission is to build the web's best collection of file utility tools that work <strong>entirely in your browser</strong>. This ensures:
                    </p>

                    {/* Feature List */}
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-base">
                            <div className="mt-1 flex-shrink-0 text-primary">
                                <Icon name="check-circle" size={20} />
                            </div>
                            <div>
                                <span className="font-bold text-foreground">Privacy:</span> Your files never leave your device.
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-base">
                            <div className="mt-1 flex-shrink-0 text-primary">
                                <Icon name="check-circle" size={20} />
                            </div>
                            <div>
                                <span className="font-bold text-foreground">Speed:</span> Zero upload/download times for processing.
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-base">
                            <div className="mt-1 flex-shrink-0 text-primary">
                                <Icon name="check-circle" size={20} />
                            </div>
                            <div>
                                <span className="font-bold text-foreground">Accessibility:</span> Works on any device with a modern web browser.
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Tech Section */}
                <section>
                    <h2 className="mb-6 text-2xl md:text-4xl font-semibold text-foreground">Why Browser-Based?</h2>
                    <p className="leading-relaxed">
                        Traditional online tools upload your files to a cloud server to process them. This is slow, requires internet bandwidth, and raises privacy concerns. By leveraging modern web technologies like <code className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm font-semibold mx-1">WebAssembly and the Canvas API</code>, AuraFile brings desktop-class performance directly to your browser tab.
                    </p>
                </section>

                {/* Contact Section */}
                <section className="bg-surface border border-border rounded-2xl p-8 text-center mt-12">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                        <Icon name="mail" size={24} />
                    </div>
                    <h2 className="mb-4 text-xl md:text-2xl font-semibold text-foreground">Contact Us</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        We are constantly improving and adding new tools. If you have feedback, suggestions, or just want to say hi, reach out to us:
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button
                            href="mailto:aurafile.team@gmail.com"
                            variant="primary"
                            className="w-full sm:w-auto flex items-center gap-2"
                        >
                            <Icon name="mail" size={18} />
                            Email Us
                        </Button>
                    </div>
                </section>
            </div>
        </main>
    );
}
