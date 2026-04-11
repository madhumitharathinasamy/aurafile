import React from 'react';

interface SoftwareSchemaProps {
    name: string;
    description: string;
    applicationCategory?: string; // e.g., "UtilitiesApplication", "BrowserApplication"
    operatingSystem?: string;
    url: string;
}

export function SoftwareSchema({
    name,
    description,
    applicationCategory = "UtilitiesApplication",
    operatingSystem = "Web Browser",
    url
}: SoftwareSchemaProps) {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": name,
        "operatingSystem": operatingSystem,
        "applicationCategory": applicationCategory,
        "description": description,
        "url": url,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
