import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { siteConfig } from '@/config/site';

export default function RelatedToolsSection() {
    // Select 4 diverse tools to feature
    const featuredTools = [
        siteConfig.home.tools.image[0], // Compress Image
        siteConfig.home.tools.image[1], // Resize Image
        siteConfig.home.tools.pdf[0],   // Compress PDF
        siteConfig.home.tools.pdf[2],   // PDF to Word
    ];

    return (
        <section className="container mx-auto px-4 max-w-7xl mt-16 pt-16 border-t border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Explore More Tools</h2>
                <p className="text-slate-500">Discover other highly-rated tools to help you manage your files.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                {featuredTools.map((tool: any) => (
                    <Link key={tool.title} href={tool.href} className="group flex flex-col rounded-[20px] bg-white border border-slate-100 p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                        <Icon name={tool.icon} size={28} className="text-[#0081C9] mb-4" />
                        <h3 className="mb-2 text-lg font-bold text-slate-900">{tool.title}</h3>
                        <p className="mb-4 text-sm font-medium leading-relaxed text-slate-500 flex-grow">{tool.description}</p>
                        
                        <div className="text-sm font-bold text-[#0081C9] flex items-center mt-auto">
                            Use Tool <Icon name="arrow-right" size={14} className="ml-1 pt-0.5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="text-center">
                <Link href="/#tools" className="inline-flex items-center justify-center rounded-full bg-[#0081C9] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#006ba6] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0081C9]">
                    View All Tools
                    <Icon name="arrow-right" size={16} className="ml-2" />
                </Link>
            </div>
        </section>
    );
}
