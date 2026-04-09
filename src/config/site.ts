export const siteConfig = {
    name: "Aura File",
    domain: "aurafile.net",
    description: "Secure, fast, and private image tools for everyone.",
    links: {
        github: "https://github.com/aurafile", // Placeholder
        twitter: "https://twitter.com/aurafile", // Placeholder
        linkedin: "https://www.linkedin.com/in/aura-file-4913483b8",
        facebook: "https://www.facebook.com/profile.php?id=61577547112396",
        email: "team@aurafile.net",
    },
    keywords: [
        "image tools",
        "resize image",
        "compress image",
        "convert image",
        "secure image processing",
        "free online image tools",
    ],
    authors: [
        {
            name: "Aura File Team",
            url: "https://aurafile.net",
        },
    ],
    creator: "Aura File Team",
    ogImage: "https://aurafile.net/og.jpg", // Placeholder until real image exists
    header: {
        nav: [
            { title: "Home", href: "/" },
            { title: "Tools", href: "/#tools" },
            { title: "About", href: "/about" },
            { title: "Contact", href: "/contact" },
        ],
    },
    footer: {
        copyright: `© ${new Date().getFullYear()} Aura File. All rights reserved.`,
        legal: [
            { title: "Privacy Policy", href: "/privacy-policy" },
            { title: "Terms of Service", href: "/terms-of-service" },
            { title: "Disclaimer", href: "/disclaimer" },
            { title: "Sitemap", href: "/sitemap-html" },
            { title: "About Us", href: "/about" },
            { title: "Contact Us", href: "/contact" },
            { title: "Cookie Settings", href: "#cookie-settings" },
        ],
    },
    home: {
        hero: {
            trustedText: "100% Private & Browser-Based Processing",
            title: "Before you share it, secure it.",
            subtitle: "Resize images, compress PDFs, and convert files instantly. No signup required. Your files never leave your browser.",
            ctaPrimary: "Explore Tools",
            ctaSecondary: "View Features",
            benefits: [
                { text: "100% Secure", icon: "shield-check" },
                { text: "Instant Processing", icon: "zap" },
                { text: "Privacy First", icon: "eye-off" }
            ]
        },
        tools: {
            title: "Professional Image & PDF Tools",
            subtitle: "Secure, free, and private tools for all your file editing needs.",
            image: [
                {
                    title: "Compress Image",
                    description: "Reduce image file size significantly without losing quality.",
                    href: "/compress-image",
                    icon: "compress",
                    tags: ["JPG", "PNG", "WebP", "SVG"],
                    keywords: ["reduce", "shrink", "optimize", "mb", "kb", "file size", "discord"]
                },
                {
                    title: "Resize Image",
                    description: "Resize images to exact pixel dimensions or percentage.",
                    href: "/resize-image",
                    icon: "resize",
                    tags: ["JPG", "PNG", "WebP", "GIF"],
                    keywords: ["instagram", "facebook", "twitter", "linkedin", "social media", "dimensions", "width", "height", "scale"]
                },
                {
                    title: "Image Converter",
                    description: "Convert images between JPG, PNG, WebP, and more.",
                    href: "/image-converter",
                    icon: "convert",
                    tags: ["JPG", "PNG", "WebP", "GIF", "BMP"],
                    keywords: ["jpg", "png", "webp", "gif", "format", "change type"]
                },
                {
                    title: "Crop Image",
                    description: "Crop efficiently with custom aspect ratios.",
                    href: "/crop-image",
                    icon: "crop",
                    tags: ["Edit"],
                    keywords: ["trim", "cut", "aspect ratio", "profile picture", "cover photo", "youtube thumbnail"]
                },
                {
                    title: "Background Remover",
                    description: "Remove image backgrounds automatically with AI precision.",
                    href: "/remove-background",
                    icon: "scissors",
                    tags: ["AI", "Edit"],
                    keywords: ["transparent", "cutout", "bg", "remove bg", "erase", "magic"]
                },
            ],
            pdf: [
                {
                    title: "Compress PDF",
                    description: "Reduce PDF file size for easy sharing and storage.",
                    href: "/compress-pdf",
                    icon: "file-minus",
                    tags: ["PDF"],
                    keywords: ["reduce", "shrink", "optimize", "mb", "kb", "file size"]
                },
                {
                    title: "Merge PDF",
                    description: "Combine multiple PDF files into one single document.",
                    href: "/merge-pdf",
                    icon: "files",
                    tags: ["PDF"],
                    keywords: ["combine", "join", "add together", "multiple"]
                },
                {
                    title: "PDF to Word",
                    description: "Convert PDF documents to editable Microsoft Word files.",
                    href: "/pdf-to-word",
                    icon: "file-text",
                    tags: ["PDF", "DOCX"],
                    keywords: ["docx", "microsoft word", "convert pdf", "editable"]
                },
                {
                    title: "Image to PDF",
                    description: "Convert JPG, PNG, and other images to PDF format.",
                    href: "/image-to-pdf",
                    icon: "file-image",
                    tags: ["PDF", "Image"],
                    keywords: ["jpg to pdf", "png to pdf", "photos to pdf"]
                },
                {
                    title: "Protect PDF",
                    description: "Encrypt your PDF with a password for enhanced security.",
                    href: "/protect-pdf",
                    icon: "lock",
                    tags: ["PDF", "Security"],
                    keywords: ["password", "encrypt", "secure", "lock"]
                },
                {
                    title: "Unlock PDF",
                    description: "Remove passwords to unlock and easily share your PDFs.",
                    href: "/unlock-pdf",
                    icon: "unlock",
                    tags: ["PDF", "Security"],
                    keywords: ["remove password", "decrypt", "open"]
                },
            ],
            other: [
                {
                    title: "Rename Files",
                    description: "Bulk rename multiple files securely right in your browser.",
                    href: "/rename-files",
                    icon: "folder",
                    tags: ["Utility", "Files"],
                    keywords: ["bulk rename", "batch rename", "names"]
                }
            ],
        },
        features: {
            title: "Why Aura File?",
            items: [
                { title: "100% Client-Side", description: "All processing happens in your browser. No files are ever uploaded to our servers.", icon: "shield" },
                { title: "Instant & Free", description: "No signups, no limits. Use all tools immediately and completely free.", icon: "zap" },
                { title: "Secure & Private", description: "Your data stays with you. We respect your privacy by design.", icon: "lock" },
                { title: "High Quality", description: "Professional-grade compression and conversion algorithms for best results.", icon: "star" },
            ],
        },
    },
};

export type SiteConfig = typeof siteConfig;
