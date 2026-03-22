"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ScrollReveal } from "@/components/ScrollReveal";

const FAQ_ITEMS = [
    {
        question: "Is AuraFile truly 100% free?",
        answer: "Yes! AuraFile is completely free to use. There are no hidden fees, no subscriptions, and absolutely no limits on how many files you can process."
    },
    {
        question: "Are my files uploaded to your servers?",
        answer: "Never. AuraFile uses a strict 100% client-side computing architecture. All processing, including image compression, PDF merging, and conversions, happens entirely within your web browser. Your files never leave your device."
    },
    {
        question: "Do I need to create an account to use the tools?",
        answer: "No, you do not need to create an account or sign in. We believe in frictionless access to tools. Simply open a tool, process your files, and download the results immediately."
    },
    {
        question: "What file types do you support?",
        answer: "We support a wide range of formats for both Images and PDFs. For images, we commonly support JPG, PNG, WebP, GIF, and BMP. For document tools, we provide full support for PDF manipulation and conversions, like PDF to Word (DOCX)."
    },
    {
        question: "How is AuraFile so fast?",
        answer: "By utilizing advanced WebAssembly (WASM) technology, AuraFile can run complex algorithms right in your browser at near-native speeds. Because you don't have to wait for files to upload or download from a server, the process is uniquely fast."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. Because your files are processed locally on your own machine and never uploaded to any cloud server, the risk of data breaches or unauthorized access to your documents is entirely eliminated."
    },
    {
        question: "Can I use AuraFile on my mobile device?",
        answer: "Yes! AuraFile is fully responsive and optimized to work seamlessly across desktops, tablets, and mobile phones, as long as you have a modern web browser."
    },
    {
        question: "Do you retain any of my data?",
        answer: "Since your files are never uploaded to our servers, we couldn't retain them even if we wanted to. Once you close your browser tab, all locally processed file data is instantly discarded."
    },
    {
        question: "Can I use AuraFile offline?",
        answer: "Since AuraFile relies on the browser to load its tools initially, you need an internet connection to visit the site. However, once a tool is loaded, the processing happens locally, meaning it does not use your bandwidth to upload files."
    },
    {
        question: "What is the maximum file size you support?",
        answer: "Our tools are optimized for files up to 50MB. Larger files may be processed depending on your device's memory capacity, as everything runs directly in your browser."
    },
    {
        question: "How do you make money if this is free?",
        answer: "We display non-intrusive advertisements on the site to help cover the costs of our domain and hosting infrastructure. We never monetize by selling your data."
    },
    {
        question: "Will my PDF formatting change when converting to Word?",
        answer: "We use high-quality parsers to preserve the original structure, fonts, and layout as accurately as possible. However, highly complex documents might require minor manual adjustments after conversion."
    },
    {
        question: "Is there an API available for developers?",
        answer: "At the moment, AuraFile consists of browser-based consumer tools. We do not offer a public API, as our primary focus is on client-side privacy rather than server-to-server integrations."
    }
];

export function FaqList() {
    const [visibleCount, setVisibleCount] = useState(6);

    const showMore = () => {
        setVisibleCount((prev) => Math.min(prev + 4, FAQ_ITEMS.length));
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                {FAQ_ITEMS.slice(0, visibleCount).map((item, index) => (
                    <ScrollReveal key={index}>
                        <details className="group rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 open:bg-white open:shadow-md transition-all">
                            <summary className="flex cursor-pointer items-center justify-between p-6 list-none focus:outline-none">
                                <span className="text-lg font-bold text-slate-800 pr-8 leading-snug">{item.question}</span>
                                <span className="transition-transform duration-300 group-open:rotate-180 text-slate-400 group-open:text-[#00B4D8] shrink-0">
                                    <Icon name="chevron-down" size={24} />
                                </span>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-fade-in">
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.answer}</p>
                            </div>
                        </details>
                    </ScrollReveal>
                ))}
            </div>

            {visibleCount < FAQ_ITEMS.length && (
                <div className="flex justify-center pt-2">
                    <button 
                        onClick={showMore}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#00B4D8] text-[#00B4D8] px-8 py-3.5 text-sm font-bold bg-transparent shadow-sm transition-all hover:bg-[#00B4D8]/5 hover:-translate-y-0.5"
                    >
                        Load More Questions
                        <Icon name="chevron-down" size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

