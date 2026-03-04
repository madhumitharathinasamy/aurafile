import type { Metadata } from 'next';
import RemoveBackgroundTool from './RemoveBackgroundTool';

export const metadata: Metadata = {
    title: 'Remove Background | AuraFile',
    description: 'Automatically remove the background from any image locally in your browser using AI. Fast, secure, and private.',
    alternates: {
        canonical: 'https://aurafile.net/remove-background',
    },
};

export default function RemoveBackgroundPage() {
    return (
        <main className="container mx-auto px-4 py-8 md:py-16 pb-24 max-w-7xl animate-fade-in flex-grow">
            <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 mb-4">
                    AI Background Remover
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Remove image backgrounds instantly. 100% private, powered by Client-Side AI.
                </p>
            </div>
            <RemoveBackgroundTool />
        </main>
    );
}
