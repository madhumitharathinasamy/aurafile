import { Metadata } from 'next';
import { PageTitle, SectionDescription } from '@/components/ui/typography';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description: 'General disclaimer regarding the functionality and guarantees of AuraFile.',
};

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-white pt-16 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <PageTitle>Disclaimer</PageTitle>
                    <SectionDescription className="mt-4">
                        Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </SectionDescription>
                </div>

                <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-[#00B4D8]">
                    <h2>1. General Information</h2>
                    <p>
                        The information and tools provided by AuraFile (aurafile.net) are for general operational and utility purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any files processed through our platform.
                    </p>

                    <h2>2. File Processing Liability</h2>
                    <p>
                        AuraFile is designed to operate strictly on the client-side, executing logic via your browser&apos;s WebAssembly API. Because we do not upload or store your data on cloud servers:
                    </p>
                    <ul>
                        <li>We cannot act as a data backup service or a recovery tool.</li>
                        <li>Any modifications, compressions, background removals, or data formatting changes made to your files are inherently irreversible once you overwrite your original file on your local machine.</li>
                        <li>We strongly advise all users to retain a secure backup copy of their original documents before utilizing our web tools.</li>
                    </ul>
                    <p>
                        UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR WEB TOOLS. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY FEATURE ON THE SITE IS SOLELY AT YOUR OWN RISK.
                    </p>

                    <h2>3. External Links Disclaimer</h2>
                    <p>
                        The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not continuously investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                    </p>
                    <p>
                        WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
                    </p>

                    <h2>4. Professional Legal/Medical Disclaimer</h2>
                    <p>
                        The tools provided on AuraFile cannot and do not contain legal or medical advice. The utilities (such as our PDF encryptor or PDF merger) are intended strictly to assist users with file structuring and transport. Utilizing our password-protection features does not inherently guarantee compliance with complex industry regulations like HIPAA, GDPR, or Attorney-Client privilege criteria unless holistically implemented alongside your organization&apos;s broader, certified IT workflows.
                    </p>

                    <h2>5. Affiliates Disclaimer</h2>
                    <p>
                        The Site may contain links to affiliate websites (or Google AdSense placements), and we may receive an affiliate commission or advertising revenue for any clicks or purchases made by you on the affiliate website using such links or advertisements. This dynamic monetization model allows us to keep the core AuraFile utility suite 100% free for all end users.
                    </p>

                    <h2>6. Contact Us</h2>
                    <p>
                        If you have any questions about this disclaimer or require technical support understanding our zero-trust architecture, you can contact us at: <strong>team@aurafile.net</strong>.
                    </p>
                </article>
            </div>
        </main>
    );
}
