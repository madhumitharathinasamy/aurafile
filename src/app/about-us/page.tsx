import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | AuraFile",
    description: "Learn about AuraFile, our mission to provide fast, secure, and private browser-based image tools for everyone.",
    alternates: {
        canonical: "https://aurafile.net/about-us",
    },
};

export default function AboutUs() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-16 animate-fade-in">
            <h1 className="mb-8 text-center text-[#00B4D8] font-extrabold text-4xl md:text-5xl tracking-tight">About AuraFile</h1>
            <div className="prose prose-slate max-w-none text-foreground/80">
                <p className="lead text-muted-foreground mb-8">
                    AuraFile is a suite of powerful, browser-based image tools designed for speed, privacy, and simplicity.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">Our Mission</h2>
                <p>
                    We believe that simple tasks like resizing an image or converting a file format shouldn't require downloading heavy software, registering for an account, or risking your privacy by uploading files to unknown servers.
                </p>
                <p className="mt-4">
                    Our mission is to build the web's best collection of file utility tools that work <strong>entirely in your browser</strong>. This ensures:
                </p>
                <ul className="list-disc pl-6 my-4 space-y-2">
                    <li><strong>Privacy:</strong> Your files never leave your device.</li>
                    <li><strong>Speed:</strong> Zero upload/download times for processing.</li>
                    <li><strong>Accessibility:</strong> Works on any device with a modern web browser.</li>
                </ul>

                <h2 className="mt-8 mb-4 text-foreground">Why Browser-Based?</h2>
                <p>
                    Traditional online tools upload your files to a cloud server to process them. This is slow, requires internet bandwidth, and raises privacy concerns. By leveraging modern web technologies like WebAssembly and the Canvas API, AuraFile brings desktop-class performance directly to your browser tab.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">Contact Us</h2>
                <p>
                    We are constantly improving and adding new tools. If you have feedback, suggestions, or just want to say hi, reach out to us at:
                    <br />
                    <a href="mailto:team@aurafile.net" className="text-primary hover:underline font-medium">team@aurafile.net</a>
                </p>
            </div>
        </main>
    );
}
