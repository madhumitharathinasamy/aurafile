import { Icon } from "@/components/ui/Icon";

const reviews = [
    {
        name: "Sarah Jenkins",
        role: "Graphic Designer",
        content: "The image resizing and compression tools are incredibly fast. The fact that it all happens in my browser without uploading my sensitive client files is a huge plus for my workflow.",
        rating: 5,
    },
    {
        name: "David Chen",
        role: "Software Engineer",
        content: "Finally, a set of PDF tools that respects privacy! I use AuraFile daily to compress and merge documents. The speed is unmatched, and the 'Clean Tech' UI is gorgeous.",
        rating: 5,
    },
    {
        name: "Emily Rodriguez",
        role: "Marketing Manager",
        content: "I love the batch conversion feature. I can process dozens of campaign images in seconds. It really saves me hours every week, completely free and reliable.",
        rating: 5,
    },
];

export function Reviews() {
    return (
        <section className="py-20 md:py-32 bg-surface border-t border-border">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="mb-4 tracking-tight text-foreground">
                        Loved by Professionals
                    </h2>
                    <p className="text-muted-foreground">
                        See what people are saying about our speed and privacy-first approach.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="flex flex-col rounded-2xl border border-border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                            <div className="flex gap-1 mb-4 text-[#facc15]">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Icon key={i} name="star" size={18} fill="currentColor" />
                                ))}
                            </div>
                            <p className="mb-6 text-foreground italic flex-grow">
                                "{review.content}"
                            </p>
                            <div>
                                <h3 className="font-semibold text-foreground">{review.name}</h3>
                                <p className="text-sm text-text-secondary">{review.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
