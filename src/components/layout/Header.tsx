"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";


export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 max-w-[var(--container-width)] items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold z-10 w-48">
                    <Image priority src="/favicon.ico" alt="Logo" width={32} height={32} className="rounded-[4px] shadow-sm" />
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Aura<span className="text-[#00B4D8]">File</span>
                    </span>
                </Link>

                {/* Desktop Nav - Centered */}
                <nav className="hidden flex-1 justify-center gap-6 lg:gap-8 md:flex items-center">
                    <Link href="/" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
                        Home
                    </Link>

                    {/* Image Tools Dropdown */}
                    <div className="relative group py-4">
                        <button
                            aria-label="Image Tools Menu"
                            className="flex items-center gap-1 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 focus:outline-none"
                        >
                            Image Tools
                            <Icon name="chevron-down" size={14} className="transition-transform group-hover:rotate-180" />
                        </button>

                        {/* Dropdown Panel */}
                        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-4 z-50">
                            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 gap-4 relative overflow-hidden">
                                {siteConfig.home.tools.image.map((tool) => (
                                    <Link key={tool.title} href={tool.href} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group/item">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#00B4D8]/10 text-[#00B4D8] group-hover/item:bg-[#00B4D8]/20 transition-colors">
                                            <Icon name={tool.icon} size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm mb-1">{tool.title}</div>
                                            <div className="text-xs font-medium text-slate-500 line-clamp-2">{tool.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PDF Tools Dropdown */}
                    <div className="relative group py-4">
                        <button
                            aria-label="PDF Tools Menu"
                            className="flex items-center gap-1 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 focus:outline-none"
                        >
                            PDF Tools
                            <Icon name="chevron-down" size={14} className="transition-transform group-hover:rotate-180" />
                        </button>

                        {/* Dropdown Panel */}
                        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-4 z-50">
                            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 gap-4 relative overflow-hidden">
                                {siteConfig.home.tools.pdf.map((tool) => (
                                    <Link key={tool.title} href={tool.href} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group/item">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#00B4D8]/10 text-[#00B4D8] group-hover/item:bg-[#00B4D8]/20 transition-colors">
                                            <Icon name={tool.icon} size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm mb-1">{tool.title}</div>
                                            <div className="text-xs font-medium text-slate-500 line-clamp-2">{tool.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link href="/about" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
                        About
                    </Link>
                    <Link href="/contact" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
                        Contact
                    </Link>
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden items-center justify-end gap-5 md:flex w-48">
                    <Link
                        href="/#tools"
                        className="rounded-[6px] border-2 border-[#00B4D8] px-4 py-2 text-sm font-bold text-[#00B4D8] bg-transparent shadow-sm transition-all hover:bg-[#00B4D8]/10 hover:shadow"
                        onClick={(e) => {
                            const element = document.getElementById('tools');
                            if (element) {
                                e.preventDefault();
                                element.scrollIntoView({ behavior: 'smooth' });
                                window.history.pushState(null, "", "/#tools");
                            }
                        }}
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden z-10">
                    <button
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                        className="p-2 text-foreground"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav Content */}
            {isMenuOpen && (
                <div className="absolute left-0 right-0 top-full flex flex-col border-b border-border bg-white shadow-lg md:hidden animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto thin-scrollbar">
                    <div className="p-4 flex flex-col gap-2">
                        <Link href="/" className="rounded-md p-3 text-lg font-bold hover:bg-slate-50 text-slate-700" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>

                        {/* Image Tools Section Content */}
                        <div className="px-3 py-2">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Icon name="image" size={14} /> Image Tools
                            </div>
                            <div className="flex flex-col pl-2 border-l-2 border-slate-100 gap-1">
                                {siteConfig.home.tools.image.map(tool => (
                                    <Link key={tool.title} href={tool.href} onClick={() => setIsMenuOpen(false)} className="py-2 px-3 text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                                        {tool.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* PDF Tools Section Content */}
                        <div className="px-3 py-2">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Icon name="file-text" size={14} /> PDF Tools
                            </div>
                            <div className="flex flex-col pl-2 border-l-2 border-slate-100 gap-1">
                                {siteConfig.home.tools.pdf.map(tool => (
                                    <Link key={tool.title} href={tool.href} onClick={() => setIsMenuOpen(false)} className="py-2 px-3 text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                                        {tool.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link href="/about" className="rounded-md p-3 text-lg font-bold hover:bg-slate-50 text-slate-700" onClick={() => setIsMenuOpen(false)}>
                            About
                        </Link>
                        <Link href="/contact" className="rounded-md p-3 text-lg font-bold hover:bg-slate-50 text-slate-700" onClick={() => setIsMenuOpen(false)}>
                            Contact
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-100">
                        <Link
                            href="/#tools"
                            className="rounded-md border-2 border-[#00B4D8] p-3 text-lg font-bold text-[#00B4D8] bg-transparent text-center shadow-sm hover:bg-[#00B4D8]/10 transition-colors"
                            onClick={(e) => {
                                setIsMenuOpen(false);
                                const element = document.getElementById('tools');
                                if (element) {
                                    e.preventDefault();
                                    setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
                                    window.history.pushState(null, "", "/#tools");
                                }
                            }}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
