import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-[#F8FAFC] py-8">
            <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row max-w-[var(--container-width)]">
                <Link href="/" className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                    <img src="/favicon.ico" alt="Logo" width={24} height={24} className="rounded-[4px] shadow-sm" />
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        Aura<span className="text-[#0081C9]">File</span>
                    </span>
                </Link>

                <nav className="flex flex-wrap justify-center gap-8">
                    {siteConfig.footer.legal.map((link) => (
                        <Link key={link.href} href={link.href} className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
                            {link.title}
                        </Link>
                    ))}
                </nav>
                <p className="text-xs font-semibold text-slate-500 text-center md:text-right">{siteConfig.footer.copyright}</p>
            </div>
        </footer>
    );
}
