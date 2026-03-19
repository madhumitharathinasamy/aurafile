import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

export default function ToolsSection() {
  const { tools } = siteConfig.home;

  return (
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
              {tools.image.map((tool: any) => (
                <Link key={tool.title} href={tool.href} className="group flex flex-col rounded-[20px] bg-white border border-slate-100 p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                  <Icon name={tool.icon} size={28} className="text-[#0081C9] mb-6" />
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{tool.title}</h3>
                  <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500 flex-grow">{tool.description}</p>

                  {tool.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.tags.map((tag: string) => (
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
              {tools.pdf.map((tool: any) => (
                <Link key={tool.title} href={tool.href} className="group flex flex-col rounded-[20px] bg-white border border-slate-100 p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                  <Icon name={tool.icon} size={28} className="text-[#0081C9] mb-6" />
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{tool.title}</h3>
                  <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500 flex-grow">{tool.description}</p>

                  {tool.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.tags.map((tag: string) => (
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

          {/* Other Tools Section */}
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8 ml-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0081C9]/10 text-[#0081C9]">
                <Icon name="folder" size={20} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">Other Tools</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tools.other?.map((tool: any) => (
                <Link key={tool.title} href={tool.href} className="group flex flex-col rounded-[20px] bg-white border border-slate-100 p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                  <Icon name={tool.icon} size={28} className="text-[#0081C9] mb-6" />
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{tool.title}</h3>
                  <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500 flex-grow">{tool.description}</p>

                  {tool.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.tags.map((tag: string) => (
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
  );
}
