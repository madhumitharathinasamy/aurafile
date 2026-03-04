interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-12 border-b border-border bg-background py-16 px-4 text-center md:mb-8 md:py-12">
            <div className="mx-auto max-w-[800px]">
                <h1 className="mb-4 tracking-tight text-foreground">{title}</h1>
                {subtitle && <p className="leading-relaxed text-muted">{subtitle}</p>}
            </div>
        </div>
    );
}
