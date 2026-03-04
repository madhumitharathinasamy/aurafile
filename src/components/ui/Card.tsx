import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface CardProps {
    title: string;
    description: string;
    href?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function Card({ title, description, icon, href }: CardProps) {
    const Content = (
        <>
            {icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                    {icon}
                </div>
            )}
            <h3 className="mb-2 text-foreground group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="mb-4 text-muted-foreground leading-relaxed flex-grow">
                {description}
            </p>
            <div className="flex items-center text-sm font-semibold text-primary mt-auto">
                Try Now <Icon name="arrow-right" size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
            </div>
        </>
    );

    const cardClasses = "group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:shadow-subtle hover:-translate-y-1 hover:border-primary/50 h-full";

    if (href) {
        return (
            <Link href={href} className={cardClasses}>
                {Content}
            </Link>
        );
    }

    return <div className={cardClasses}>{Content}</div>;
}
