import type { Metadata } from 'next';
import { PageTitle, SectionDescription } from '@/components/ui/typography';
import Link from 'next/link';
import { Layers, Zap, Shield, Mail } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'About Us | AuraFile',
    description: 'AuraFile was built to solve a simple problem: web tools shouldn\'t require you to surrender your privacy. Discover our mission for safer file utilities.',
    alternates: {
        canonical: 'https://aurafile.net/about',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="relative pt-16 pb-24 border-b border-border/40 bg-slate-50/50">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <PageTitle className="mb-6 text-slate-900">About AuraFile</PageTitle>
                    <SectionDescription className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
                        We build fast, professional file utilities that process locally in your browser. No cloud uploads, no subscriptions, just tools that work.
                    </SectionDescription>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Why We Built This</h2>
                        <p className="mb-6">
                            A few years ago, we needed to quickly merge two sensitive PDF contracts before sending them to a client. A quick web search returned dozens of free tools. We clicked the top one, hit upload, and watched a progress bar creep across the screen. 
                        </p>
                        <p className="mb-8">
                            Then it hit us: <em>Where did those contracts just go? Who owns that server? How long do they keep the files?</em>
                        </p>
                        <p className="mb-8">
                            The internet is saturated with "free" file converters that secretly monetize by holding your files hostage behind a paywall when you try to download them, or worse, by harvesting the data you upload. We knew modern web browsers were capable of so much more.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 my-12 not-prose">
                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center">
                                <div className="w-12 h-12 bg-blue-50 text-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Privacy First</h3>
                                <p className="text-sm text-slate-600">Zero file tracking. Your files never leave your device's memory.</p>
                            </div>
                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center">
                                <div className="w-12 h-12 bg-blue-50 text-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Instant Speeds</h3>
                                <p className="text-sm text-slate-600">Bypass server upload times. Processing happens instantly on your CPU.</p>
                            </div>
                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center">
                                <div className="w-12 h-12 bg-blue-50 text-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">No Bloat</h3>
                                <p className="text-sm text-slate-600">No popups, no account walls, no deceptive "download now" buttons.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-12">Our Philosophy</h2>
                        <p className="mb-6">
                            AuraFile is designed to feel like native desktop software, but delivered instantly via the web. We believe that professional-grade tools shouldn't require installation or costly subscriptions. 
                        </p>
                        <p className="mb-6">
                            By leveraging cutting-edge web technologies like WebAssembly (WASM) and the HTML5 File API, we've shifted the computational burden off of expensive cloud servers and directly into the browser. This architectural choice is precisely what allows us to offer these tools securely and for free.
                        </p>
                        
                        <p className="mb-6">
                            We operate a completely transparent architecture. We make our revenue through unintrusive AdSense placements, which allows us to keep the core utilities 100% free forever without compromising your data.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mt-12 text-center not-prose mb-12">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Want to understand the technical details?</h3>
                            <p className="text-slate-600 mb-6">Read our deep dive into the client-side architecture that powers AuraFile.</p>
                            <Link href="/security" className="inline-block bg-[#00B4D8] hover:bg-[#0096B4] text-white font-medium px-6 py-3 rounded-lg transition-colors">
                                Read the Security Architecture
                            </Link>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 border-t border-slate-200 pt-8 mb-4">Get in Touch</h2>
                        <p className="mb-6">
                            Have feedback or a feature request? We actually read every email. If you find a bug with a specific PDF or image file, let us know!
                        </p>
                        <div className="not-prose mt-6">
                            <a href="mailto:team@aurafile.net" className="inline-flex items-center gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-lg font-medium transition-colors">
                                <Mail className="w-5 h-5 text-[#00B4D8]" /> team@aurafile.net
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
