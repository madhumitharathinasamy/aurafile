import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://aurafile.net";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1.0,
        },
        // Image Tools
        { url: `${baseUrl}/compress-image`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/resize-image`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/image-converter`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/crop-image`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/remove-background`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        // PDF Tools
        { url: `${baseUrl}/compress-pdf`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/merge-pdf`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/pdf-to-word`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/image-to-pdf`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/protect-pdf`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        // File Tools
        { url: `${baseUrl}/rename-files`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
        // Legal pages
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.8,
        },
    ];
}
