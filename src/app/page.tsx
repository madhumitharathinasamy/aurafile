import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/ScrollReveal";

const ToolsSection = dynamic(() => import("@/components/home/ToolsSection"), { ssr: true });
const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection"), { ssr: true });
const BlogSection = dynamic(() => import("@/components/home/BlogSection"), { ssr: true });
const Reviews = dynamic(() => import("@/components/ui/Reviews").then(mod => mod.Reviews), { ssr: true });

export const dynamicConfig = "force-static";
export const revalidate = 86400;

export default function Home() {
  const { hero } = siteConfig.home;

  return (
    <main className="flex min-h-screen flex-col animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-[#F8FAFC]">
        <div className="absolute left-[5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#E0F2FE] blur-[100px] opacity-70"></div>
        <div className="absolute right-[5%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#E0F2FE] blur-[100px] opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Trusted Badge */}
            <div className="mb-10 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-[#00B4D8]"></span>
              {hero.trustedText}
            </div>

            <h1 className="mb-6 font-extrabold tracking-tight text-slate-900 text-5xl md:text-7xl">
              {hero.title.replace("made simple", "").trim()}<br className="hidden md:block" />
              <span className="text-[#00B4D8]"> made simple</span>
            </h1>

            <p className="mb-12 text-lg md:text-xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
              <Button href="/#tools" className="rounded-lg bg-[#00B4D8] px-8 py-6 text-base font-bold text-white shadow-sm hover:bg-[#0096b7] transition-all w-full sm:w-auto">
                {hero.ctaPrimary} <span className="ml-1">→</span>
              </Button>
              <Button href="/#features" variant="outline" className="rounded-lg bg-white border-2 border-slate-200 px-8 py-6 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all w-full sm:w-auto">
                {hero.ctaSecondary}
              </Button>
            </div>

            {/* Hero Features */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-bold text-slate-600">
              {hero.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name={benefit.icon} size={18} className="text-[#00B4D8]" />
                  {benefit.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal>
        <ToolsSection />
      </ScrollReveal>

      <ScrollReveal>
        <FeaturesSection />
      </ScrollReveal>

      <ScrollReveal>
        <BlogSection />
      </ScrollReveal>

      <ScrollReveal>
        <Reviews />
      </ScrollReveal>
    </main>
  );
}
