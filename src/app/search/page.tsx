import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { PageTitle, SectionDescription } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Search Results | AuraFile',
    description: 'Search for secure, in-browser PDF, Image, and Document processing tools.',
    alternates: {
        canonical: 'https://aurafile.net/search',
    },
};

export default async function SearchPage(props: {
    searchParams: Promise<{ q?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams.q?.toLowerCase() || '';

    // Flat array of all tools to search against
    const allTools = [
        ...siteConfig.home.tools.image,
        ...siteConfig.home.tools.pdf,
        ...siteConfig.home.tools.other
    ];

    const results = allTools.filter(tool => {
        const keywords = (tool as any).keywords as string[] | undefined;
        return (
            tool.title.toLowerCase().includes(query) || 
            tool.description.toLowerCase().includes(query) ||
            tool.tags?.some(tag => tag.toLowerCase().includes(query)) ||
            keywords?.some(kw => kw.toLowerCase().includes(query))
        );
    });

    return (
        <main className="min-h-screen bg-slate-50 pt-16 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00B4D8]/10 text-[#00B4D8]">
                        <Icon name="search" size={32} />
                    </div>
                    <PageTitle>Search Results</PageTitle>
                    <SectionDescription className="mt-4">
                        {query ? `Showing results for "${query}"` : 'Enter a search term to find tools'}
                    </SectionDescription>
                </div>

                {query && results.length > 0 ? (
                    <div className="grid gap-4">
                        {results.map(tool => (
                            <Link 
                                href={tool.href} 
                                key={tool.title}
                                className="group flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#00B4D8]/50 hover:shadow-md"
                            >
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-[#00B4D8]/10 group-hover:text-[#00B4D8]">
                                    <Icon name={tool.icon} size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#00B4D8] transition-colors">{tool.title}</h3>
                                    <p className="mt-1 text-slate-600">{tool.description}</p>
                                </div>
                                <div className="hidden sm:flex shrink-0 items-center text-sm font-bold text-[#00B4D8]">
                                    Open Tool <Icon name="arrow-right" size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
                        <Icon name="frown" size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No tools found</h3>
                        <p className="text-slate-600 mb-6">We couldn't find any tools matching "{query}".</p>
                        <Link href="/#tools" className="inline-flex items-center justify-center rounded-lg bg-[#00B4D8] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0096B4]">
                            Browse All Tools
                        </Link>
                    </div>
                ) : null}
            </div>
        </main>
    );
}
