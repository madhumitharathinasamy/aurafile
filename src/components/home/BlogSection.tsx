"use client";

import Link from "next/link";
import { blogPosts } from "@/data/blog";

export default function BlogSection() {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 md:py-28 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="mb-4 inline-block rounded-full bg-[#E0F2FE] px-4 py-1.5 text-sm font-bold text-[#00B4D8]">
            Privacy & Performance
          </span>
          <h2 className="mb-6 font-bold tracking-tight text-slate-900 text-4xl md:text-5xl">
            Latest from the Blog
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Insights on browser-based processing, data privacy, and optimizing your file workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#00B4D8] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Optional Post Image Area */}
              <div className="h-48 bg-slate-100 w-full relative overflow-hidden bg-grid-slate flex items-center justify-center">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-[#00B4D8] opacity-50 font-bold text-4xl">
                    Aura<span className="text-slate-400">File</span>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mb-3">
                  <span className="text-[#00B4D8]">{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#00B4D8] transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {post.author.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{post.author.name}</span>
                  </div>
                  <span className="text-[#00B4D8] font-bold text-sm flex items-center">
                    Read Post <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/blog" className="inline-flex items-center rounded-lg bg-white border-2 border-slate-200 px-8 py-4 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
