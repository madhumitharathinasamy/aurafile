import { Icon, IconName } from "@/components/ui/Icon";
import { SectionTitle, SectionDescription, BodyText } from "@/components/ui/typography";
import { ScrollReveal } from "@/components/ScrollReveal";

// --- Types ---
export interface Step {
    title: string;
    description: string;
    icon?: IconName;
}

export interface Benefit {
    title: string;
    description: string;
    icon: IconName;
}

export interface FAQItem {
    question: string;
    answer: string;
}

// --- Components ---

export function SEOAndSpecsSection({ howItWorks, benefits, theme = "blue", specs }: { howItWorks: Step[], benefits: Benefit[], theme?: "blue" | "red", specs?: {label: string, value: string}[] }) {
    const isRed = theme === "red";
    const iconColor = isRed ? "text-red-600 bg-red-50" : "text-[#00B4D8] bg-[#00B4D8]/5";
    const primaryColor = isRed ? "text-red-600" : "text-[#00B4D8]";
    
    // Default generic specs if not provided
    const _specs = specs || [
        { label: "Max File Size", value: "50MB" },
        { label: "Processing", value: "Client-side / WebAssembly" },
        { label: "Privacy", value: "100% Secure (No Uploads)" },
        { label: "Cost", value: "Free" }
    ];

    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-8 flex flex-col gap-16">
                        {/* How It Works (Horizontal Step Indicator) */}
                        {howItWorks && howItWorks.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-8 font-sans tracking-tight">How It Works</h2>
                                <div className="flex flex-col md:flex-row gap-6 relative">
                                    {howItWorks.map((step, index) => (
                                        <div key={index} className="flex-1 relative flex flex-col pt-4">
                                            {/* Horizontal Progress Line on Desktop */}
                                            {index < howItWorks.length - 1 && (
                                                <div className="hidden md:block absolute top-[2.25rem] left-[50%] w-full h-[2px] bg-gradient-to-r from-[#00B4D8] to-transparent opacity-30 z-0" />
                                            )}
                                            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 mx-auto mb-5 ${primaryColor} font-bold text-lg`}>
                                                {index + 1}
                                            </div>
                                            <h3 className="text-center font-semibold text-slate-800 mb-2">{step.title}</h3>
                                            <p className="text-center text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        {benefits && benefits.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-sans tracking-tight">Why Choose AuraFile</h2>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                                            <div className={`mb-4 inline-flex p-3 rounded-lg ${iconColor}`}>
                                                <Icon name={benefit.icon} size={22} />
                                            </div>
                                            <h3 className="font-semibold text-slate-800 mb-2 text-lg">{benefit.title}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-4">
                        <ScrollReveal>
                            <div className="sticky top-24 flex flex-col gap-6">
                                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                        <Icon name="cpu" className={primaryColor} size={24} />
                                        <h3 className="text-lg font-bold text-slate-900 m-0 tracking-tight">Tool Specifications</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {_specs.map((spec, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">{spec.label}</span>
                                                <span className="font-semibold text-slate-800 text-right text-sm">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
                                        <Icon name="shield-check" className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">100% Local Processing</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Your files are processed on your device and never sent to any server.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function FAQSection({ items }: { items: FAQItem[] }) {
    if (!items || items.length === 0) return null;

    return (
        <ScrollReveal>
            <section className="py-12 md:py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <details key={index} className="group rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 open:bg-white open:shadow-md transition-all">
                            <summary className="flex cursor-pointer items-center justify-between p-6 list-none focus:outline-none">
                                <span className="text-lg font-bold text-slate-800">{item.question}</span>
                                <span className="transition-transform duration-300 group-open:rotate-180 text-slate-400 group-open:text-[#00B4D8]">
                                    <Icon name="chevron-down" size={20} />
                                </span>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-fade-in">
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
        </ScrollReveal>
    );
}

export function PrivacyBadge({ theme = "blue" }: { theme?: "blue" | "red" }) {
    const isRed = theme === "red";
    const dotColor = isRed ? "bg-red-500" : "bg-[#00B4D8]";

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6 animate-fade-up">
            <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
            </span>
            <span className="text-xs font-semibold text-slate-600">
                100% Privacy & Browser-Based Processing
            </span>
        </div>
    );
}
