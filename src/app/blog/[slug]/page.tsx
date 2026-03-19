import { blogPosts } from "@/data/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | AuraFile Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }



  return (
    <>
      {post.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faqSchema) }}
        />
      )}
      
      <main className="min-h-screen bg-white">
        {/* Article Header */}
        <header className="bg-[#F8FAFC] border-b border-slate-100 pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link href="/blog" className="inline-flex items-center text-sm font-bold text-[#00B4D8] mb-8 hover:underline">
                <span className="mr-2">←</span> Back to Blog
              </Link>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                {post.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 font-medium mb-10 leading-relaxed max-w-3xl mx-auto">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-slate-600 font-medium bg-white py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-full border border-slate-200 shadow-sm inline-flex text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">
                    {post.author.name.charAt(0)}
                  </div>
                  <span className="text-slate-900 font-bold">{post.author.name}</span>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <span>{post.date}</span>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <span className="text-[#00B4D8] font-bold">{post.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Optional Hero Image */}
              {post.image && (
                <div className="mb-12 md:mb-16 rounded-2xl overflow-hidden shadow-xl border border-slate-100 w-full relative h-[300px] md:h-[500px] bg-slate-900">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              
              {/* Render the React Node content */}
              <div className="prose-container">
                {post.content}
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
