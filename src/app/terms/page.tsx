import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Terms of Service | AuraFile",
    description: "AuraFile Terms and Conditions of Use. Read our policies regarding software liability, client-side processing algorithms, and acceptable use.",
};

export default function TermsPage() {
    return (
        <>
            <PageHeader
                title="Terms of Service"
                subtitle={`Last Updated: ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}
            />

            <main className="container mx-auto max-w-[800px] pb-12 px-4 md:pb-12 mt-8">
                <div className="prose prose-slate max-w-none prose-h2:text-2xl prose-h2:text-slate-900 prose-a:text-[#00B4D8] prose-a:no-underline hover:prose-a:underline">

                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and utilizing the web-based software provided at AuraFile (aurafile.net), you signify your explicit agreement to be bound by these Terms of Service. If you disagree with any part of these terms, you must refrain from using the provided file manipulation utilities.
                        </p>
                    </section>

                    <section>
                        <h2>2. Architectural Liability & Client-Side Risk</h2>
                        <p>
                            AuraFile operates structurally differently than traditional Software-as-a-Service (SaaS) platforms. Our operations run via <strong>WebAssembly (WASM)</strong> and HTML5 APIs directly inside your local web browser. This means the heavy computational load of processing files occurs entirely on your device's native CPU and GPU.
                        </p>
                        <p>
                            By using these tools, you explicitly acknowledge and agree to the following technical limitations and liabilities:
                        </p>
                        <div className="bg-slate-50 border border-amber-200 p-5 rounded-lg mb-6">
                            <ul className="mb-0 text-slate-700">
                                <li><strong>Hardware Responsibility:</strong> The performance, speed, and success of large file conversions (such as compressing 4K images or extracting massive PDFs) are unconditionally dependent on the physical processing speeds and available memory (RAM) of your specific hardware.</li>
                                <li><strong>Browser Instability:</strong> AuraFile explicitly disclaims any liability for browser crashes, frozen tabs, or memory allocation errors that may occur when your local device attempts to process excessively large files.</li>
                                <li><strong>Data Loss:</strong> Because processing occurs locally without server-side backups, AuraFile is not responsible for data corruption or data loss resulting from interruptions, tab closures, or power failures during the export or manipulation sequence.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2>3. Governing Use License</h2>
                        <p>
                            We grant you a non-exclusive, revocable, and temporary license to utilize our browser-based implementations for both personal and enterprise use. However, you strictly agree <strong>not to:</strong>
                        </p>
                        <ul>
                            <li>Attempt to decompile, reverse-engineer, or maliciously overload the WASM binaries distributed to your browser.</li>
                            <li>Automate requests via headless browsers or scraping bots in a manner that constitutes a Denial of Service (DoS) against our static asset distribution network.</li>
                            <li>Use these tools to process explicitly illegal imagery, maliciously alter cryptographic signatures, or forge documentation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Intellectual Property & User Content</h2>
                        <p>
                            At AuraFile, <strong>you retain complete 100% intellectual property ownership</strong> of every document, photo, and file you process using our interface. Because our architecture is entirely zero-trust and client-side, we do not claim any right, license, or distribution authority over your utilized files, as we literally cannot access them.
                        </p>
                    </section>
                    
                    <section>
                        <h2>5. Advertising, Endorsements, and AdSense</h2>
                        <p>
                            AuraFile's free structure is subsidized entirely through the placement of third-party advertisements via the Google AdSense publisher network. 
                        </p>
                        <p>
                            AuraFile does not explicitly endorse, guarantee, or take responsibility for the products, software, or services promoted inside these third-party display banners. Clicks on external advertisements constitute an agreement governed by the third-party advertiser's isolated Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2>6. Limitation of General Liability</h2>
                        <p>
                            The materials on AuraFile's web interfaces are provided strictly "as is" and "as available". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties of merchantability or fitness for a particular purpose.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
