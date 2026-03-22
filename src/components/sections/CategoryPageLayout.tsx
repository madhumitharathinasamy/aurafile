import React from 'react';
import Link from 'next/link';
import { PageTitle, SectionDescription } from "@/components/ui/typography";
import { Icon } from "@/components/ui/Icon";
import { PrivacyBadge, FAQSection, type FAQItem } from "@/components/sections/ToolSections";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/Breadcrumbs";

export interface CategoryTool {
    title: string;
    description: string;
    href: string;
    icon: any;
    tags?: string[];
}

interface CategoryPageLayoutProps {
    title: string;
    description: string;
    icon: any;
    theme?: "blue" | "red";
    tools: CategoryTool[];
    faq: FAQItem[];
    breadcrumbs: BreadcrumbItem[];
}

export default function CategoryPageLayout({
    title,
    description,
    icon,
    theme = "blue",
    tools,
    faq,
    breadcrumbs
}: CategoryPageLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-8 pb-16 border-b border-border/40 bg-slate-50/50">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
                    <Breadcrumbs items={breadcrumbs} />
                    <PrivacyBadge theme={theme} />
                    
                    <div className="flex justify-center mb-6">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0081C9]/10 text-[#0081C9]`}>
                            <Icon name={icon} size={32} />
                        </div>
                    </div>

                    <PageTitle className="mb-4 text-slate-900">{title}</PageTitle>
                    <SectionDescription className="max-w-2xl mx-auto text-slate-600 mb-6">{description}</SectionDescription>
                </div>
            </section>

            {/* Tools Grid Section */}
            <section className="py-16 bg-[#F8FAFC]">
                <div className="container mx-auto px-4 max-w-[var(--container-width)]">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tools.map((tool) => (
                            <Link key={tool.title} href={tool.href} className="group flex flex-col rounded-[20px] bg-white border border-slate-100 p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                                <Icon name={tool.icon} size={28} className="text-[#0081C9] mb-6" />
                                <h3 className="mb-3 text-xl font-bold text-slate-900">{tool.title}</h3>
                                <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500 flex-grow">{tool.description}</p>

                                {tool.tags && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                    {tool.tags.map((tag: string) => (
                                        <span key={tag} className="rounded md:rounded-lg bg-slate-700 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">{tag}</span>
                                    ))}
                                    </div>
                                )}

                                <div className="text-sm font-bold text-[#0081C9] flex items-center">
                                    Use {tool.title.split(' ')[0]} <Icon name="arrow-right" size={14} className="ml-1 pt-0.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <div className="pb-16 pt-8">
                <FAQSection items={faq} />
            </div>
        </div>
    );
}
