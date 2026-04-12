import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { siteConfig } from '@/config/site';
import { Mail, Bug, FileQuestion, Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Contact & Support | AuraFile',
    description: 'Get in touch with the AuraFile engineering team. Report bugs, request new web-based file tools, or ask technical questions.',
    alternates: {
        canonical: 'https://aurafile.net/contact',
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white pb-24">
            <PageHeader 
                title="Contact & Support" 
                subtitle="We're actively maintaining AuraFile. Reach out to a real human engineer below."
            />

            <main className="container mx-auto px-4 max-w-5xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Direct Contact & Security Notice */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-blue-100 text-[#00B4D8] rounded-xl flex items-center justify-center mb-6">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Direct Email</h2>
                        <p className="text-slate-600 mb-6 text-sm">
                            Whether it's a feature request, business inquiry, or you just want to say hi. We try our best to respond within 24-48 business hours.
                        </p>
                        <a href={`mailto:${siteConfig.links.email}`} className="inline-flex items-center gap-2 bg-[#00B4D8] hover:bg-[#0096B4] text-white px-6 py-3 rounded-lg font-medium transition-colors w-full justify-center">
                            {siteConfig.links.email}
                        </a>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Support Privacy Notice</h2>
                        <p className="text-slate-600 text-sm mb-0">
                            Because AuraFile operates with entirely offline, zero-trust WASM processing, <strong>our engineering team has absolutely no backend access to your files</strong>. If you are experiencing a bug with a specific document, we cannot "look at your account." You will need to explicitly attach a non-sensitive sample file in your email for us to replicate the issue.
                        </p>
                    </div>
                </div>

                {/* Right Column: Bug Reports & FAQ */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* Bug Report Template */}
                    <section>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                            <Bug className="text-[#00B4D8] w-8 h-8" /> Bug Reports 
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p>
                                Notice a glitch while trying to compress a massive image? PDF merger stalling at 99%? Since we utilize your browser's native capabilities, bugs are often tied to specific browser versions (Chrome, Firefox, Safari).
                            </p>
                            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl mt-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-3 mt-0">How to submit a helpful bug report via email:</h3>
                                <ul className="mb-0 space-y-2">
                                    <li><strong>The Tool Used:</strong> e.g., "PDF to Word Converter"</li>
                                    <li><strong>Your Browser & OS:</strong> e.g., "Chrome v120 on Windows 11"</li>
                                    <li><strong>The File Attributes:</strong> e.g., "It was a 400MB 4K PNG file"</li>
                                    <li><strong>The Console Error (Optional):</strong> If you know how to open Developer Tools (F12), copying the red text in the 'Console' tab significantly accelerates our patch times.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-200" />

                    {/* Support FAQ */}
                    <section>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                            <FileQuestion className="text-[#00B4D8] w-8 h-8" /> Support FAQ
                        </h2>
                        <div className="space-y-6">
                            
                            <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-start gap-2">
                                    <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    Why did the tool crash while processing my very large file?
                                </h3>
                                <p className="text-slate-600 mb-0">
                                    AuraFile runs strictly inside your local browser tab using WebAssembly. Browsers enforce strict RAM memory limits (often around 2GB - 4GB per tab). If you try to merge 50 highly-detailed PDFs simultaneously, Google Chrome might forcefully crash the tab to protect your operating system. Try processing files in smaller batches.
                                </p>
                            </div>

                            <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-start gap-2">
                                    <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    Can you delete the file I accidentally uploaded?
                                </h3>
                                <p className="text-slate-600 mb-0">
                                    We physically cannot, because we don't have it. Your files never left your device. They were only processed temporarily in your local RAM. Simply refresh your page, and all traces of the processing execution are destroyed.
                                </p>
                            </div>

                            <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-start gap-2">
                                    <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    Are you interested in placing sponsored links on your blog?
                                </h3>
                                <p className="text-slate-600 mb-0">
                                    No. We keep our site clean of undisclosed sponsored content ("guest posts"). Our monetization is strictly handled programmatically via Google AdSense to maintain editorial and tool integrity.
                                </p>
                            </div>

                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
