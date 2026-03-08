import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reviews } from "@/components/ui/Reviews";

export const dynamic = "force-static";
export const revalidate = 86400;
export default function Home() {
  const { hero, tools, features } = siteConfig.home;

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
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-[#0081C9]"></span>
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
              <Button href="/#tools" className="rounded-lg bg-[#0081C9] px-8 py-6 text-base font-bold text-white shadow-sm hover:bg-[#0070B8] transition-all w-full sm:w-auto">
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
                  <Icon name={benefit.icon} size={18} className="text-[#0081C9]" />
                  {benefit.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 md:py-32 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="mb-4 font-bold tracking-tight text-slate-900 text-3xl md:text-4xl">
              {tools.title}
            </h2>
            <p className="text-lg font-medium text-slate-500">
              {tools.subtitle}
            </p>
          </div>

          <div className="max-w-[var(--container-width)] mx-auto">
            {/* Image Tools Section */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8 ml-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0081C9]/10 text-[#0081C9]">
                  <Icon name="image" size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Image Tools</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tools.image.map((tool) => (
                  <Link key={tool.title} href={tool.href} className="group flex flex-col rounded-[20px] bg-white border border-slate-100 p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                    <Icon name={tool.icon} size={28} className="text-[#0081C9] mb-6" />
                    <h3 className="mb-3 text-xl font-bold text-slate-900">{tool.title}</h3>
                    <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500 flex-grow">{tool.description}</p>

                    {tool.tags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tool.tags.map(tag => (
                          <span key={tag} className="rounded bg-slate-700 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">{tag}</span>
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

            {/* PDF Tools Section */}
            <div>
              <div className="flex items-center gap-3 mb-8 ml-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0081C9]/10 text-[#0081C9]">
                  <Icon name="file-text" size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">PDF Tools</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tools.pdf.map((tool) => (
                  <Link key={tool.title} href={tool.href} className="group flex flex-col rounded-[20px] bg-white border border-slate-100 p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                    <Icon name={tool.icon} size={28} className="text-[#0081C9] mb-6" />
                    <h3 className="mb-3 text-xl font-bold text-slate-900">{tool.title}</h3>
                    <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500 flex-grow">{tool.description}</p>

                    {tool.tags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tool.tags.map(tag => (
                          <span key={tag} className="rounded bg-slate-700 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">{tag}</span>
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
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section id="features" className="py-20 md:py-24 bg-[#c4cdd6]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 max-w-[var(--container-width)] mx-auto text-center">
            {features.items.map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center text-[#0081C9]">
                  <Icon name={feature.icon as string} size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="mb-3 font-bold text-slate-900 text-lg">{feature.title}</h3>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed max-w-[250px] mx-auto">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Reviews />
    </main>
  );
}
