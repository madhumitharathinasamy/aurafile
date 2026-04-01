"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Icon, IconName } from "@/components/ui/Icon";

interface SearchBarProps {
    variant: "desktop" | "mobile";
    onClose?: () => void;
}

export function SearchBar({ variant, onClose }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const allTools = [
        ...siteConfig.home.tools.image,
        ...siteConfig.home.tools.pdf,
        ...siteConfig.home.tools.other
    ];

    const results = query.trim() === "" ? [] : allTools.filter(tool => {
        const q = query.toLowerCase();
        // @ts-ignore - keywords added dynamically to config but type might not reflect it
        const keywords = tool.keywords as string[] | undefined;
        
        return (
            tool.title.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            tool.tags?.some(tag => tag.toLowerCase().includes(q)) ||
            keywords?.some((kw: string) => kw.toLowerCase().includes(q))
        );
    }).slice(0, 5); // Limit to top 5 results

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            if (onClose) onClose();
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const isDesktop = variant === "desktop";

    return (
        <div ref={wrapperRef} className={`relative ${isDesktop ? "hidden lg:block z-50" : "mb-2 shrink-0 z-50 w-full"}`}>
            <form role="search" onSubmit={handleSubmit} className="relative w-full">
                <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search tools..."
                    className={
                        isDesktop
                            ? "h-9 w-44 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition-all focus:w-56 focus:border-[#00B4D8] focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/20"
                            : "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-base outline-none focus:border-[#00B4D8]"
                    }
                    aria-label="Search"
                    autoComplete="off"
                />
            </form>

            {isOpen && query.trim() !== "" && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden ${
                    isDesktop ? "right-0 w-[350px]" : "left-0 right-0 w-full"
                }`}>
                    {results.length > 0 ? (
                        <div className="py-2">
                            {results.map((tool) => (
                                <Link
                                    key={tool.title}
                                    href={tool.href}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery("");
                                        if (onClose) onClose();
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#00B4D8]/10 text-[#00B4D8] group-hover:bg-[#00B4D8]/20 transition-colors">
                                        <Icon name={tool.icon as IconName} size={20} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-sm font-bold text-slate-900 truncate group-hover:text-[#00B4D8] transition-colors">
                                            {tool.title}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate">
                                            {tool.description}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <div className="border-t border-slate-100 mt-2">
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (onClose) onClose();
                                    }}
                                    className="block px-4 py-3 text-sm text-center font-semibold text-[#00B4D8] hover:bg-slate-50 transition-colors"
                                >
                                    View all results
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 px-4 text-center">
                            <Icon name="frown" size={24} className="mx-auto text-slate-300 mb-2" />
                            <div className="text-sm font-semibold text-slate-900 mb-1">No tools found</div>
                            <div className="text-xs text-slate-500">Try a different search term</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
