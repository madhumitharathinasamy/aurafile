export const siteConfig = {
    name: "Aura File",
    domain: "aurafile.net",
    description: "Secure, fast, and private image tools for everyone.",
    links: {
        github: "https://github.com/aurafile", // Placeholder
        twitter: "https://twitter.com/aurafile", // Placeholder
        email: "aurafile.team@gmail.com",
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
            { title: "About Us", href: "/about" },
            { title: "Contact Us", href: "/contact" },
        ],
    },
    home: {
        hero: {
            trustedText: "100% Private & Browser-Based Processing",
            title: "Professional file tools made simple",
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
                    tags: ["JPG", "PNG", "WebP", "SVG"]
                },
                {
                    title: "Resize Image",
                    description: "Resize images to exact pixel dimensions or percentage.",
                    href: "/resize-image",
                    icon: "resize",
                    tags: ["JPG", "PNG", "WebP", "GIF"]
                },
                {
                    title: "Image Converter",
                    description: "Convert images between JPG, PNG, WebP, and more.",
                    href: "/image-converter",
                    icon: "convert",
                    tags: ["JPG", "PNG", "WebP", "GIF", "BMP"]
                },
                {
                    title: "Crop Image",
                    description: "Crop efficiently with custom aspect ratios.",
                    href: "/crop-image",
                    icon: "crop",
                    tags: ["Edit"]
                },
                {
                    title: "Background Remover",
                    description: "Remove image backgrounds automatically with AI precision.",
                    href: "/remove-background",
                    icon: "scissors",
                    tags: ["AI", "Edit"]
                },
            ],
            pdf: [
                {
                    title: "Compress PDF",
                    description: "Reduce PDF file size for easy sharing and storage.",
                    href: "/compress-pdf",
                    icon: "file-minus",
                    tags: ["PDF"]
                },
                {
                    title: "Merge PDF",
                    description: "Combine multiple PDF files into one single document.",
                    href: "/merge-pdf",
                    icon: "files",
                    tags: ["PDF"]
                },
                {
                    title: "PDF to Word",
                    description: "Convert PDF documents to editable Microsoft Word files.",
                    href: "/pdf-to-word",
                    icon: "file-text",
                    tags: ["PDF", "DOCX"]
                },
                {
                    title: "Image to PDF",
                    description: "Convert JPG, PNG, and other images to PDF format.",
                    href: "/image-to-pdf",
                    icon: "file-image",
                    tags: ["PDF", "Image"]
                },
                {
                    title: "Protect PDF",
                    description: "Encrypt your PDF with a password for enhanced security.",
                    href: "/protect-pdf",
                    icon: "lock",
                    tags: ["PDF", "Security"]
                },
                {
                    title: "Unlock PDF",
                    description: "Remove passwords to unlock and easily share your PDFs.",
                    href: "/unlock-pdf",
                    icon: "unlock",
                    tags: ["PDF", "Security"]
                },
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
