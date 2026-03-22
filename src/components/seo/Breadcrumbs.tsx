import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://aurafile.net${item.href}`
    }))
  };

  return (
    <>
      <Script
        id={`breadcrumb-${items[items.length - 1]?.label || 'schema'}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="w-full flex justify-center mb-6">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.href} className="flex items-center">
                {isLast ? (
                  <span className="text-slate-900 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="hover:text-[#00B4D8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded-sm"
                    >
                      {item.label}
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-300" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
