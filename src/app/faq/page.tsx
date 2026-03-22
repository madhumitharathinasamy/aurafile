import { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FaqList } from "./FaqList";

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Frequently Asked Questions | AuraFile",
    description:
        "Find answers to common questions about AuraFile's secure, fast, and 100% client-side image and PDF tools.",
    alternates: {
        canonical: "https://aurafile.net/faq",
    },
};

export default function FAQPage() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-16 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="mb-4 text-[#00B4D8] font-extrabold text-4xl md:text-5xl tracking-tight">
                    Frequently Asked Questions
                </h1>
                <p className="mt-4 text-foreground/70 max-w-2xl mx-auto text-lg">
                    Everything you need to know about AuraFile and how we keep your files private, secure, and fast.
                </p>
            </div>

            {/* Quick Summary Card */}
            <ScrollReveal>
                <div className="mb-12 rounded-xl border border-[#00B4D8]/30 bg-[#00B4D8]/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-[#00B4D8] mb-2 flex items-center gap-2">
                            <Icon name="mail" /> Need more help?
                        </h2>
                        <p className="text-foreground/80 text-sm">
                            If you still have questions or need support, feel free to reach out to our team directly. We're here to help!
                        </p>
                    </div>
                    <div>
                        <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5 whitespace-nowrap">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* FAQ List from Client Component */}
            <FaqList />

            {/* Footer note */}
            <div className="mt-16 pt-8 border-t border-slate-100 text-center text-sm text-foreground/60">
                <p>
                    Still curious about how we handle data? Check out our{" "}
                    <Link href="/privacy-policy" className="text-[#00B4D8] hover:underline font-medium">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
}
