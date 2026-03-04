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
                    <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="rounded-[4px] shadow-sm" />
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Aura<span className="text-[#0081C9]">File</span>
                    </span>
                </Link>

                {/* Desktop Nav - Centered */}
                <nav className="hidden flex-1 justify-center gap-8 md:flex">
                    {siteConfig.header.nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden items-center justify-end gap-5 md:flex w-48">
                    <Link href="/#tools" className="rounded-[6px] bg-[#0081C9] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#0070B8] hover:shadow">
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
                <div className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b border-border bg-white p-4 shadow-lg md:hidden animate-in slide-in-from-top-2">
                    {siteConfig.header.nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-md p-3 text-lg font-bold hover:bg-slate-50 text-slate-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.title}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-100">
                        <Link href="/#tools" className="rounded-md bg-[#0081C9] p-3 text-lg font-bold text-white text-center shadow-sm" onClick={() => setIsMenuOpen(false)}>
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
