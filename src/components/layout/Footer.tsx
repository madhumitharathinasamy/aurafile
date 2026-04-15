"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, ChevronUp, Lock, Zap, ArrowRight, Facebook } from "lucide-react";

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="mt-auto bg-slate-900 border-t-4 border-[#00B4D8] relative text-slate-300">
            
            {/* Top CTA Banner */}
            <div className="border-b border-slate-800 bg-slate-900/50">
                <div className="container mx-auto px-6 py-16 md:py-20 max-w-[var(--container-width)] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Ready to secure your files?</h2>
                        <p className="text-slate-400 font-medium">No signup. 100% private. Files never leave your device.</p>
                    </div>
                    <Link href="/compress-image" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00B4D8] px-8 py-4 text-sm font-bold text-slate-900 shadow-lg transition-all hover:bg-[#0096B4] hover:-translate-y-1 hover:shadow-[#00B4D8]/20 focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:ring-offset-2 w-full md:w-auto">
                        Start using tools <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-16 max-w-[var(--container-width)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    
                    {/* Brand & Trust (Column 1) */}
                    <div className="flex flex-col items-start lg:pr-6">
                        <Link href="/" className="flex items-center gap-3 mb-6 hover:opacity-90 transition-opacity">
                            <Image src="/favicon.ico" alt="AuraFile Logo" width={32} height={32} className="rounded-[6px] shadow-sm bg-white p-0.5" />
                            <span className="text-2xl font-bold tracking-tight text-white uppercase tracking-widest">
                                Aura<span className="text-[#00B4D8]">File</span>
                            </span>
                        </Link>
                        
                        <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-8 text-sm md:text-base">
                            Free browser-based tools for images & PDFs. No uploads. No tracking. Full privacy.
                        </p>
                        
                        {/* Trust Signals */}
                        <ul className="flex flex-col gap-3 border-l-2 border-slate-700 pl-4 w-full m-0 p-0">
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>100% client-side processing</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>Runs securely in your browser</span>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Tools / SEO (Column 2) */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Popular Tools</h3>
                        <nav aria-label="Footer Navigation - Popular Tools">
                            <ul className="flex flex-col gap-4 m-0 p-0">
                                <li><Link href="/compress-image" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Compress Image</Link></li>
                                <li><Link href="/compress-image-to-100kb" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Compress to 100KB</Link></li>
                                <li><Link href="/resize-image" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Resize Image</Link></li>
                                <li><Link href="/pdf-to-word" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">PDF to Word</Link></li>
                                <li><Link href="/remove-background" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Background Remover</Link></li>
                                <li><Link href="/rename-files" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Rename Files</Link></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Site Map (Column 3) */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Explore</h3>
                        <nav aria-label="Footer Navigation - Site Map">
                            <ul className="flex flex-col gap-4 m-0 p-0">
                                <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Home</Link></li>
                                <li><Link href="/image-tools" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Image Tools</Link></li>
                                <li><Link href="/pdf-tools" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">PDF Tools</Link></li>
                                <li><Link href="/document-tools" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Document Tools</Link></li>
                                <li><Link href="/blog" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Blog</Link></li>
                                <li><Link href="/faq" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">FAQ</Link></li>
                                <li><Link href="/about" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">About</Link></li>
                                <li><Link href="/security" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Security Architecture</Link></li>
                                <li><Link href="/contact" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-medium flex items-center min-h-[48px]">Contact</Link></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Legal (Column 4) */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Legal</h3>
                        <nav aria-label="Footer Navigation - Legal">
                            <ul className="flex flex-col gap-4 m-0 p-0">
                                {/* Legal Links mapping */}
                                {siteConfig.footer.legal.map((link) => (
                                    <li key={link.href}>
                                        {link.href === "#cookie-settings" ? (
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.dispatchEvent(new Event('open-cookie-settings'));
                                                }}
                                                className="text-slate-400 hover:text-white transition-colors text-sm font-medium hover:translate-x-1 flex items-center min-h-[48px] border-transparent cursor-pointer bg-transparent text-left"
                                            >
                                                {link.title}
                                            </button>
                                        ) : (
                                            <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium hover:translate-x-1 flex items-center min-h-[48px] border-transparent">
                                                {link.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                </div>

                {/* Bottom Bar integrated inside layout for cleaner look, with back to top */}
                <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                    
                    {/* Copyright Left */}
                    <div className="order-3 md:order-1 flex-1">
                        <p className="text-[13px] font-medium text-slate-400 text-center md:text-left">
                            © 2026 AuraFile. All rights reserved.
                        </p>
                    </div>
                    
                    {/* Social Center */}
                    <div className="order-1 md:order-2 flex items-center justify-center gap-3 flex-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none hidden md:inline-block">Join community</span>
                        <a href={siteConfig.links.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm" aria-label="Follow us on Facebook">
                            <Facebook size={14} strokeWidth={2} />
                        </a>
                        <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all shadow-sm" aria-label="Follow us on LinkedIn">
                            <Linkedin size={14} strokeWidth={2} />
                        </a>
                    </div>

                    {/* Back to top Right */}
                    <div className="order-2 md:order-3 flex-1 flex justify-center md:justify-end">
                        <button 
                            onClick={scrollToTop}
                            className="flex items-center gap-2 group text-slate-400 hover:text-[#00B4D8] transition-colors text-[11px] font-bold uppercase tracking-widest bg-transparent border-none min-h-[48px]"
                            aria-label="Scroll back to top"
                        >
                            <span className="relative top-0.5">Back to Top</span>
                            <div className="p-1.5 rounded-full bg-slate-800 group-hover:bg-[#00B4D8]/20 transition-colors hidden md:block">
                                <ChevronUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </button>
                    </div>

                </div>
            </div>

            {/* Very thin accent bar to ground the visual weight */}
            <div className="bg-[#00B4D8] h-1 w-full absolute bottom-0 left-0"></div>
        </footer>
    );
}
