import type { Metadata } from 'next';
import { PageTitle, SectionDescription } from '@/components/ui/typography';
import { ShieldCheck, Cpu, Globe } from 'lucide-react';
import { PrivacyBadge } from '@/components/sections/ToolSections';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Security & Privacy Architecture | AuraFile',
    description: 'Learn how AuraFile processes files securely. 100% client-side execution means your documents and images never leave your device.',
    alternates: {
        canonical: 'https://aurafile.net/security',
    },
};

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="relative pt-16 pb-24 border-b border-border/40 bg-slate-50/50">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <PrivacyBadge theme="blue" />
                    <PageTitle className="mb-6 text-slate-900">Security & Privacy Architecture</PageTitle>
                    <SectionDescription className="text-slate-600 text-lg sm:text-xl">
                        A transparent look at how we built AuraFile to make cloud uploads obsolete.
                    </SectionDescription>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="prose prose-slate prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">The Core Problem: Trusting the Cloud</h2>
                        <p className="text-slate-600 mb-6">
                            For the last decade, the standard model for web utility tools has been the same: you have a file you need to convert or compress, so you upload it to a server. That server processes the file, and then you download the result.
                        </p>
                        <p className="text-slate-600 mb-8">
                            This model creates a massive point of failure. It forces you to hand over sensitive financial documents, legal contracts, and personal photos to unknown servers. As developers, we realized there is no longer any technical justification for this risk.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Cpu className="w-6 h-6 text-[#00B4D8]" />
                                Client-Side Processing (The AuraFile Answer)
                            </h3>
                            <p className="text-slate-600">
                                AuraFile completely reverses the traditional model. Instead of sending your files to our software, <strong>we send our software to your files.</strong> We utilize modern browser APIs and WebAssembly (WASM) to run complex operations—like PDF merging, AI background removal, and advanced image compression—directly using your device's CPU and memory.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works Technically</h2>
                        
                        <div className="space-y-8 mb-12">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">1. No Network Transmission</h3>
                                <p className="text-slate-600 text-base mt-2">
                                    When you drop a file into an AuraFile tool, the file is loaded into your browser's local memory via the HTML5 File API. It never touches a network request payload. If you open your browser's network tab while compressing an image, you will see exactly zero bytes of your file being transferred.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">2. WebAssembly Execution</h3>
                                <p className="text-slate-600 text-base mt-2">
                                    For heavy tasks like removing backgrounds, we download a small, isolated WebAssembly module (and a local AI model) to your browser cache on your first visit. Your browser then executes this code locally. WebAssembly runs in a secure sandbox, offering near-native performance without any required backend infrastructure.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900">3. Ephemeral Memory</h3>
                                <p className="text-slate-600 text-base mt-2">
                                    Processed files exist only in your RAM as a Blob URL (e.g., <code>blob:https://aurafile.net/...</code>). The moment you close the tab or refresh the page, the browser's garbage collector permanently wipes the file from memory. We literally have no servers capable of saving your data even if we wanted to.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">The Bottom Line</h2>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start">
                                <ShieldCheck className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-slate-900 block">We cannot see your files.</strong>
                                    <span className="text-slate-600 text-base">We do not have a database attached to the file processing logic. We do not log what you upload.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <ShieldCheck className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-slate-900 block">We cannot be breached for user files.</strong>
                                    <span className="text-slate-600 text-base">Hackers cannot steal what we do not possess. Our server infrastructure strictly serves static HTML, CSS, and JS files.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <ShieldCheck className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-slate-900 block">It works entirely offline.</strong>
                                    <span className="text-slate-600 text-base">Because the logic runs locally, once the page loads, you can disconnect your WiFi and the tools will still function perfectly.</span>
                                </div>
                            </li>
                        </ul>
                        
                    </div>
                </div>
            </section>
        </div>
    );
}
