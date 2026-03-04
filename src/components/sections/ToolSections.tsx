import { Icon, IconName } from "@/components/ui/Icon";
import { SectionTitle, SectionDescription, BodyText } from "@/components/ui/typography";

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

export function HowItWorksSection({ steps, theme = "blue" }: { steps: Step[]; theme?: "blue" | "red" }) {
    if (!steps || steps.length === 0) return null;

    const isRed = theme === "red";
    const iconColor = isRed ? "text-red-600" : "text-primary";

    return (
        <section className="py-6 md:py-12 bg-surface-secondary">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <SectionTitle>How It Works</SectionTitle>
                    <SectionDescription>Simple steps to process your files securely in your browser.</SectionDescription>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            {/* Step Number/Icon */}
                            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ${iconColor}`}>
                                {step.icon ? <Icon name={step.icon} size={32} /> : <span className="text-2xl font-bold">{index + 1}</span>}
                            </div>

                            {/* Connector Line (Desktop only, except last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border/50 to-transparent" />
                            )}

                            <h3 className="mb-3">{step.title}</h3>
                            <BodyText className="text-muted-foreground">{step.description}</BodyText>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function BenefitsSection({ benefits, theme = "blue" }: { benefits: Benefit[]; theme?: "blue" | "red" }) {
    if (!benefits || benefits.length === 0) return null;

    const isRed = theme === "red";
    const iconBg = isRed ? "bg-red-500/5 text-red-600 group-hover:bg-red-500 group-hover:text-white" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white";

    return (
        <section className="py-6 md:py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <SectionTitle>Why Use This Tool?</SectionTitle>
                    <SectionDescription>Fast, secure, and free online tool for your daily needs.</SectionDescription>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="group p-6 rounded-2xl border border-border bg-surface hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className={`mb-4 inline-flex p-3 rounded-lg ${iconBg} transition-colors`}>
                                <Icon name={benefit.icon} size={24} />
                            </div>
                            <h3 className="mb-2">{benefit.title}</h3>
                            <BodyText className="text-muted-foreground text-base">{benefit.description}</BodyText>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function FAQSection({ items }: { items: FAQItem[] }) {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-6 md:py-12 bg-surface-secondary border-t border-border/50">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                <div className="text-center mb-12">
                    <SectionTitle>Frequently Asked Questions</SectionTitle>
                </div>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <details key={index} className="group rounded-xl border border-border bg-surface open:shadow-sm transition-all">
                            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium list-none">
                                <span className="text-xl md:text-2xl font-bold">{item.question}</span>
                                <span className="transition-transform group-open:rotate-180 text-muted-foreground">
                                    <Icon name="chevron-down" size={20} />
                                </span>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-fade-in">
                                <BodyText className="text-muted-foreground leading-7">{item.answer}</BodyText>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function PrivacyBadge({ theme = "blue" }: { theme?: "blue" | "red" }) {
    const isRed = theme === "red";
    const dotColor = isRed ? "bg-red-600" : "bg-primary";

    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft border border-border/50 mb-8 animate-fade-up">
            <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
            </span>
            <span className="text-sm text-muted-foreground">
                100% Private & Browser-Based Processing
            </span>
        </div>
    );
}
