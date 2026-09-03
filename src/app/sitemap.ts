import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://aurafile.net";
    const lastModDate = new Date();

    // Dynamic Blog Map
    const blogs: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    // Dynamic Pages Discovery from src/app
    const appDir = path.join(process.cwd(), "src", "app");
    
    // Explicitly exclude non-public, utility, or redirected legacy routes
    const excludeDirs = new Set([
        "api",
        "compress-image-dynamic", // We will handle sizes manually
        "about-us",
        "privacy-policy",
        "terms-of-service",
        "search",
        "sitemap-html"
    ]);

    let toolSubDirs: string[] = [];
    try {
        const allItems = fs.readdirSync(appDir, { withFileTypes: true });
        toolSubDirs = allItems
            .filter((dirent) => dirent.isDirectory())
            .filter((dirent) => !dirent.name.startsWith("_") && !dirent.name.startsWith("("))
            .filter((dirent) => !excludeDirs.has(dirent.name))
            .filter((dirent) => fs.existsSync(path.join(appDir, dirent.name, "page.tsx")))
            .map((dirent) => dirent.name);
    } catch (error) {
        console.error("Error reading src/app directory for sitemap generation:", error);
    }

    const dynamicPages: MetadataRoute.Sitemap = toolSubDirs.map((dirName) => {
        let priority = 0.9;
        let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly";
        
        const legalAndInfoPages = ["about", "contact", "disclaimer", "privacy", "terms", "security", "faq"];
        const categoryPages = ["document-tools", "image-tools", "pdf-tools"];
        
        if (legalAndInfoPages.includes(dirName)) {
            priority = 0.5;
            changeFrequency = "yearly";
        } else if (categoryPages.includes(dirName)) {
            priority = 0.8;
        }

        return {
            url: `${baseUrl}/${dirName}`,
            lastModified: lastModDate,
            changeFrequency,
            priority,
        };
    });

    // Custom Dynamic Sizes for Image Compression
    const customSizes = [20, 50, 100, 200, 500];
    const imageSizeTools: MetadataRoute.Sitemap = customSizes.map((size) => ({
        url: `${baseUrl}/compress-image-to-${size}kb`,
        lastModified: lastModDate,
        changeFrequency: "monthly",
        priority: 0.9,
    }));

    return [
        {
            url: baseUrl,
            lastModified: lastModDate,
            changeFrequency: "monthly",
            priority: 1.0,
        },
        ...dynamicPages,
        ...imageSizeTools,
        ...blogs,
    ];
}
