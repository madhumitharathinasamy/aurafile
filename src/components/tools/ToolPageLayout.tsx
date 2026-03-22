import React from 'react';
import { PageTitle, SectionDescription } from "@/components/ui/typography";
import { SEOAndSpecsSection, FAQSection, Step, Benefit, FAQItem, PrivacyBadge } from "@/components/sections/ToolSections";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/Breadcrumbs";

interface ToolPageLayoutProps {
    title: string;
    description: string;
    toolComponent: React.ReactNode;
    howItWorks: Step[];
    benefits: Benefit[];
    faq: FAQItem[];
    specs?: {label: string, value: string}[];
    backgroundImage?: string;
    theme?: "blue" | "red";
    breadcrumbs?: BreadcrumbItem[];
    longFormContent?: React.ReactNode;
}

export default function ToolPageLayout({
    title,
    description,
    toolComponent,
    howItWorks,
    benefits,
    faq,
    specs,
    theme = "blue",
    breadcrumbs,
    longFormContent
}: ToolPageLayoutProps) {
    const isRed = theme === "red";
    
    // Create a subtle grid patterned hero background
    return (
        <div className="min-h-screen bg-white">
            {/* 1. Hero Section - Clean Minimal Background */}
            <section className="relative pt-8 pb-16 border-b border-border/40 bg-slate-50/50">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
                    {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                    <PrivacyBadge theme={theme} />
                    <PageTitle className="mb-4 text-slate-900">{title}</PageTitle>
                    <SectionDescription className="max-w-2xl mx-auto text-slate-600 mb-10">{description}</SectionDescription>

                    {/* Tool Slot - Professional Dashboard wrapping without extra borders */}
                    <div className="w-full relative z-10 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-left">
                        {toolComponent}
                    </div>
                </div>
            </section>

            {/* Below the fold content with Lazy Loading */}
            <ScrollReveal>
                <div className="pb-16 pt-8">
                    {/* 2. SEO & Specs Grid Layout */}
                    <SEOAndSpecsSection 
                        howItWorks={howItWorks} 
                        benefits={benefits} 
                        theme={theme} 
                        specs={specs} 
                    />

                    {/* 3. FAQ Section */}
                    <FAQSection items={faq} />

                    {/* 4. Long Form SEO Content (if provided) */}
                    {longFormContent && (
                        <section className="container mx-auto px-4 max-w-4xl mt-16 pt-16 border-t border-slate-200">
                            {longFormContent}
                        </section>
                    )}
                </div>
            </ScrollReveal>
        </div>
    );
}

// Re-export types for easier usage in pages
export type { Step, Benefit, FAQItem };
