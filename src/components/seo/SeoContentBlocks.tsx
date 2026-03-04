import React from "react";
import { Icon } from "@/components/ui/Icon";

export function PdfSecuritySeo() {
    return (
        <div className="max-w-4xl mx-auto mt-24 mb-16 space-y-12 px-4 text-slate-700 leading-relaxed font-sans">
            <section className="space-y-4">
                <h2 className="text-slate-800 tracking-tight">How Secure is Your PDF? Understanding Client-Side Encryption</h2>
                <p className="text-muted-foreground">
                    In today’s digital era, ensuring the privacy and security of your sensitive documents is paramount.
                    Unlike traditional cloud-based services that demand you upload your private files to an external server,
                    our advanced PDF encryption tool operates 100% locally within your browser.
                    This means your files never leave your device, representing the gold standard in data security.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 bg-blue-50 text-[#0081C9] rounded-xl flex items-center justify-center mb-4">
                        <Icon name="shield" size={24} />
                    </div>
                    <h3 className="text-slate-800 mb-2">Zero Data Transfer</h3>
                    <p className="">
                        Traditional online PDF protectors work by asking you to upload your PDF to their server,
                        where the encryption is applied, and then you download the result. This introduces significant risk:
                        your file is transmitted over the internet, temporarily stored on a server, and exposed to potential
                        interception. Our tool downloads the encryption engine to your browser instead, applying the password
                        locally using JavaScript and Web Assembly.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                        <Icon name="lock" size={24} />
                    </div>
                    <h3 className="text-slate-800 mb-2">RC4 & AES Encryption</h3>
                    <p className="">
                        We utilize industry-standard encryption protocols compatible with all major PDF viewers natively.
                        By applying robust standard encryption keys, your document is mathematically sealed. Even if a malicious
                        actor gains access to your local machine’s raw file, they cannot bypass the cryptographic lock without
                        the exact password string you provided during the locking process.
                    </p>
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-slate-800">Why You Should Password-Protect PDFs</h2>
                <div className="space-y-4">
                    <p>
                        Whether you are sending legal contracts, financial statements, medical records, or proprietary business
                        strategies, sending an unprotected PDF as an email attachment is akin to sending a postcard. Anyone who intercepts
                        it can read the contents. Password protection adds an essential layer of security.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600">
                        <li><strong>Compliance and Regulations:</strong> Industries handling PII (Personally Identifiable Information) or PHI (Protected Health Information) are legally obligated (e.g., heavily audited by HIPAA, GDPR) to encrypt sensitive data in transit.</li>
                        <li><strong>Preventing Unauthorized Edits:</strong> Beyond simply blocking people from opening the file, our tool sets strict internal permissions preventing unauthorized users from highlighting, annotating, or manipulating the text even if they bypass reading restrictions.</li>
                        <li><strong>Intellectual Property:</strong> Photographers, authors, and researchers often use password protection as a digital rights management (DRM) strategy to control who gets to view their premium content.</li>
                    </ul>
                </div>
            </section>

            <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h2 className="text-slate-800 mb-4">How to create a strong password</h2>
                <p className="mb-4">
                    The strength of your PDF encryption is only as robust as the password you select.
                    A cryptographic lock can withstand brute-force attacks from supercomputers for millennia,
                    but if your password is "password123", human error becomes the vulnerability.
                </p>
                <p className="mb-4">
                    Instead of random strings of characters that are impossible to remember (like `Xy7!pQ9$m`),
                    we recommend the <strong>Diceware method</strong> or utilizing a <strong>Passphrase</strong>.
                    A passphrase consists of four to five random, unconnected words (e.g., `BatteryHorseStapleCorrect`).
                    It is mathematically incredibly difficult for a computer algorithm to guess, yet extremely easy
                    for the human brain to visualize and remember.
                </p>
                <p className="text-muted-foreground">
                    Disclaimer: Because our tool operates 100% locally and stores absolutely zero data, we do not
                    have a "forgot password" feature. If you forget your PDF password, the document is lost forever.
                    Always keep a backup or store your passwords in a secure, audited Password Manager.
                </p>
            </section>
        </div>
    );
}

export function PdfMergeSeo() {
    return (
        <div className="max-w-4xl mx-auto mt-24 mb-16 space-y-12 px-4 text-slate-700 leading-relaxed font-sans">
            <section className="space-y-4 text-center pb-8 border-b border-slate-200">
                <h2 className="text-slate-800 tracking-tight">The Ultimate Guide to Merging PDF Files</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Combine multiple documents into a single, cohesive PDF file instantly directly within your browser. No data leaves your computer.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-slate-800 flex items-center gap-3">
                    <Icon name="layers" className="text-[#0081C9]" />
                    Why Merge PDFs?
                </h2>
                <p>
                    The Portable Document Format (PDF) is the universal language of business communication.
                    However, organizing multiple PDFs can become chaotic. Imagine receiving five different invoices
                    from a freelancer, a cover letter and a resume as separate files, or distinct chapters of a book
                    submitted by different authors. Merging these files into one single document brings order to chaos.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Professionalism</h4>
                        <p className="text-muted-foreground">Sending one organized PDF report is much more professional than bombarding your client with 14 separate email attachments.</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Easy Printing</h4>
                        <p className="text-muted-foreground">Printing 20 separate documents requires opening each one and configuring the printer dialogue. Merging them first means clicking "Print" once.</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Data Archiving</h4>
                        <p className="text-muted-foreground">Tax seasons and digital archiving are heavily simplified when all receipts or statements for a given month are combined into a single chronological file.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-6 bg-[#0081C9]/5 p-8 rounded-3xl border border-[#0081C9]/10">
                <h2 className="text-[#0081C9]">How Our Merging Engine Works</h2>
                <p>
                    Most web-based PDF combiners rely on cloud processing. This means your private files—potentially containing
                    bank details, confidential corporate roadmaps, or personal ID cards—are sent to a remote server.
                    Once processed, the combined file is sent back.
                </p>
                <p>
                    <strong>AuraFile takes a radically different approach.</strong> We leverage the modern web technology known as
                    Web Assembly (Wasm) and HTML5 APIs to download the logic directly into your browser.
                </p>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex gap-4 items-start">
                        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#0081C9] shadow-sm shrink-0 border border-[#0081C9]/20">1</div>
                        <div>
                            <strong className="text-slate-800 block">Read File Headers</strong>
                            <p className="">Our script locally parses the specific byte structure of your PDFs to understand the page tree and resource dictionaries (fonts, images) without uploading a single byte.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#0081C9] shadow-sm shrink-0 border border-[#0081C9]/20">2</div>
                        <div>
                            <strong className="text-slate-800 block">Cross-Reference Consolidation</strong>
                            <p className="">We create a new, blank PDF container and carefully copy over the pages you selected. We resolve conflicts dynamically, ensuring that if two PDFs use the "Arial" font dictionary, it is only included once in the new file, saving massive amounts of space.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#0081C9] shadow-sm shrink-0 border border-[#0081C9]/20">3</div>
                        <div>
                            <strong className="text-slate-800 block">Blob Generation</strong>
                            <p className="">Finally, the new binary data is compiled and handed directly to your browser's download manager via a Blob URL. The merging happens in milliseconds, limited only by your computer's RAM rather than your internet upload speed.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-slate-800">Tips for Managing Large PDFs</h2>
                <p>
                    If you are merging massive architectural blueprints or extremely high-resolution image portfolios,
                    the resulting merged PDF might be larger than typical email attachment limits (usually 25MB).
                    When working with heavy documents, we highly recommend using our <strong>Compress PDF</strong> tool
                    after merging. The compression tool uses intelligent structural optimization to strip out unused
                    objects and rasterize extreme DPI images down to a manageable size, often resulting in an 80% smaller file size
                    with zero visible quality loss.
                </p>
            </section>
        </div>
    );
}
