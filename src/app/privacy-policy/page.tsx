import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | AuraFile",
    description: "Our privacy policy explains how we handle your data. At AuraFile, your privacy is our priority. No files are stored on our servers.",
    alternates: {
        canonical: "https://aurafile.net/privacy-policy",
    },
};

export default function PrivacyPolicy() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-16 animate-fade-in">
            <h1 className="mb-8 text-center text-[#00B4D8] font-extrabold text-4xl md:text-5xl tracking-tight">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none text-foreground/80">
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

                <h2 className="mt-8 mb-4 text-foreground">1. Introduction</h2>
                <p>
                    Welcome to AuraFile. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information when you use our website.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">2. Data Processing</h2>
                <p>
                    <strong>AuraFile operates firmly on a "Client-Side Processing" model.</strong> This means:
                </p>
                <ul className="list-disc pl-6 my-4 space-y-2">
                    <li>Your files (images, documents) are processed directly within your web browser.</li>
                    <li>We do <strong>not</strong> upload your files to any server for processing unless explicitly stated for specific legacy tools (currently none).</li>
                    <li>Your files never leave your device, ensuring maximum security and privacy.</li>
                </ul>

                <h2 className="mt-8 mb-4 text-foreground">3. Information We Collect</h2>
                <p>
                    Since we do not require user accounts, we collect minimal data:
                </p>
                <ul className="list-disc pl-6 my-4 space-y-2">
                    <li><strong>Usage Data:</strong> We may use analytics tools (like Google Analytics) to understand how visitors use our site (e.g., pages visited, time spent). This data is anonymized.</li>
                    <li><strong>Cookies:</strong> We use cookies to enhance your experience and for analytics purposes. You can control cookie preferences through your browser settings.</li>
                </ul>

                <h2 className="mt-8 mb-4 text-foreground">4. Third-Party Services</h2>
                <p>
                    We may use third-party services such as:
                </p>
                <ul className="list-disc pl-6 my-4 space-y-2">
                    <li><strong>Google AdSense:</strong> To display advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites.</li>
                    <li><strong>Google Analytics:</strong> To analyze website traffic.</li>
                </ul>

                <h2 className="mt-8 mb-4 text-foreground">5. Your Rights</h2>
                <p>
                    You have the right to access, correct, or delete your personal data if we held any. Since we do not store personal files or account data, there is typically no personal data to manage.
                </p>

                <h2 className="mt-8 mb-4 text-foreground">6. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:team@aurafile.net" className="text-primary hover:underline">team@aurafile.net</a>
                </p>
            </div>
        </main>
    );
}
