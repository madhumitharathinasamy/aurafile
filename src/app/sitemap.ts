import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://aurafile.net";
    const lastModDate = new Date("2026-03-23");

    const blogs: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: lastModDate,
            changeFrequency: "monthly",
            priority: 1.0,
        },
        ...blogs,
        // Image Tools
        { url: `${baseUrl}/compress-image`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/resize-image`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/image-converter`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/crop-image`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/remove-background`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        // PDF Tools
        { url: `${baseUrl}/compress-pdf`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/merge-pdf`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/pdf-to-word`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/image-to-pdf`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/protect-pdf`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        // File Tools
        { url: `${baseUrl}/rename-files`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.9 },
        // Legal pages
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: lastModDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: lastModDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: lastModDate,
            changeFrequency: "yearly",
            priority: 0.7,
        },
    ];
}
