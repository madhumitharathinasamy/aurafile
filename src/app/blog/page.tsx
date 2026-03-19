import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | AuraFile - Privacy-First File Tools",
  description: "Read our latest articles on file processing, data privacy, and optimizing your web workflow.",
};

export default function BlogList() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="mb-6 font-extrabold tracking-tight text-slate-900 text-4xl md:text-6xl">
            AuraFile <span className="text-[#00B4D8]">Blog</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Thoughts, guides, and insights on data privacy and browser-based file processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#00B4D8] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-56 bg-slate-100 w-full relative overflow-hidden bg-grid-slate flex items-center justify-center">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-[#00B4D8] opacity-50 font-bold text-5xl">
                    Aura<span className="text-slate-400">File</span>
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mb-4">
                  <span className="text-[#00B4D8]">{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#00B4D8] transition-colors leading-snug">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{post.author.name}</p>
                      <p className="text-xs text-slate-500">{post.author.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
