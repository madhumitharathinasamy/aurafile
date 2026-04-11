import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export function MergePdfPower() {
    return (
        <article className="prose prose-slate max-w-none text-slate-600">
            <p className="lead text-xl text-slate-700 font-medium mb-10">
                Juggling multiple separate PDF attachments is chaotic, unprofessional, and significantly increases the chance of a client missing critical information. Whether you are assembling a legal portfolio, combining monthly financial invoices, or consolidating a university research thesis, our professional PDF Merger seamlessly stitches your individual files into a single, cohesive document directly within your browser.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="shield-check" className="text-[#00B4D8]" size={24} />
                Technology & Privacy: The Danger of Merging Online
            </h2>
            <p>
                When you merge sensitive files—like a signed employment contract paired with a scanned passport copy—using a random online compiler, you are uploading highly sensitive Personally Identifiable Information (PII) to an unknown third-party server. This is a severe liability, exploring exactly <Link href="/blog/managing-sensitive-legal-documents-without-cloud" className="text-[#00B4D8] hover:underline font-medium">why managing legal documents securely is a requirement</Link>. Most external servers keep copies of your combined documents in their temporary caches for hours, or even days, without your knowledge.
            </p>
            <p>
                AuraFile entirely eliminates this security gap. Our Merger operates natively on advanced WebAssembly architecture. When you select multiple PDFs, your computer’s local processor reads the internal data structures, aligns the pages, and mathematically bounds the files together locally. <strong>No data is sent over the internet.</strong> You get the professional utility of enterprise software without the privacy risks associated with traditional SaaS data collection.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="layers" className="text-[#00B4D8]" size={24} />
                Detailed How-To Guide: Assembling Your Master PDF
            </h2>
            <p>
                Combining files is physically straightforward, but ensuring the final document flows logically requires careful organization. Here is how to construct a flawless master file.
            </p>
            
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Step 1: Uploading and Ordering</h3>
            <p>
                Drag and drop all your separate PDF pieces into the interface. They will appear visually in the queue. The order in which they are arranged left-to-right (or top-to-bottom) will strictly dictate the page sequence of the final exported file. If a file is out of place, simply click and drag it to the correct sequential position. 
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Step 2: Checking Security Permissions</h3>
            <p>
                If one of the PDFs you are attempting to merge is secured with an "Owner Password" (which prevents editing or extracting pages), our merger will mathematically fail to stitch it together, because the data is cryptographically locked. If you own the file but forgot to remove the lock, run it through our <Link href="/unlock-pdf" className="text-[#00B4D8] hover:underline font-medium">PDF Unlocker</Link> first to strip the permissions.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Step 3: Post-Merge Optimization</h3>
            <p>
                When you merge five 10MB PDFs, the resulting file will logically be roughly 50MB. Submitting a 50MB file via email is often impossible due to server attachment limits. Therefore, immediately after you download your combined master file, we strongly advise dropping it straight into our <Link href="/compress-pdf" className="text-[#00B4D8] hover:underline font-medium">PDF Compressor</Link> to crush the total file size before distribution.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="briefcase" className="text-[#00B4D8]" size={24} />
                Use Cases & Professional Benefits
            </h2>
            <p>
                Consolidating documents isn't just about saving click-fatigue; it's about presentation and workflow integrity across industries:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Accounting & Finance:</strong> Financial controllers merge dozens of individual vendor invoices, expense receipts, and bank statements into a single cohesive monthly "packet" for secure archiving and auditing.</li>
                <li><strong>Real Estate:</strong> Brokers stitch together inspection reports, property disclosures, title histories, and executed contracts into an all-in-one closing portfolio for the buyer's permanent digital records.</li>
                <li><strong>Human Resources:</strong> HR managers combine scattered onboarding forms—like signed W-4s, I-9 direct deposit authorizations, and non-disclosure agreements—into a tidy master personnel file.</li>
                <li><strong>Job Apps & Portfolios:</strong> Graphic designers and engineers combine their separate text resumes, cover letters, and visual portfolio assets into one professional document to bypass archaic portal upload limits.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 border-b pb-2">
                Technical Specifications
            </h2>
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm my-6">
                <table className="min-w-full text-left border-collapse m-0">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 font-bold text-slate-900 w-1/3">Specification</th>
                            <th className="p-4 font-bold text-slate-900">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        <tr>
                            <td className="p-4 font-medium text-slate-700">Supported Formats</td>
                            <td className="p-4 text-slate-600">Strictly PDF (Any version)</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-slate-700">Page Limitations</td>
                            <td className="p-4 text-slate-600">Unlimited (Dependent on local machine RAM)</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-slate-700">Security Architecture</td>
                            <td className="p-4 text-slate-600 font-semibold text-emerald-600">100% Client-Side Local Assembly</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-slate-700">Metadata Handling</td>
                            <td className="p-4 text-slate-600">Consolidated logically into master wrapper</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
                Expanded FAQs
            </h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Will the page orientation (Landscape/Portrait) stay the same?</h3>
                    <p className="text-slate-600">Yes. The merger respects the original page layout parameters encoded within the individual files. If you merge a vertical text document with a horizontal schematic drawing, the final master file will simply contain mixed-orientation pages, preventing anything from being squashed.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Can I merge image files (JPGs) with a PDF using this tool?</h3>
                    <p className="text-slate-600">This specific tool is engineered exclusively to concatenate existing PDF objects. If you wish to combine image files, you must first convert those images into a PDF format using our <Link href="/image-to-pdf" className="text-[#00B4D8] hover:underline font-medium">Image to PDF tool</Link>, and then merge them together here.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Are bookmarks or hyperlinks preserved?</h3>
                    <p className="text-slate-600">Standard web links and internal hyperlinks are overwhelmingly maintained. However, complex navigational bookmarks (the table of contents tree) from the original individual files may sometimes be flattened or restructured during the concatenation process to ensure file stability.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Why does nothing happen when I click a file?</h3>
                    <p className="text-slate-600">If a file is heavily encrypted with a user-password or an edit-restriction password, the PDF stitching code cannot intercept and bind the pages. Ensure all inputted documents are fully decrypted before merging.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Where does the final merged file get saved?</h3>
                    <p className="text-slate-600">Because it combines strictly on your hard drive via WebAssembly, the final file will instantly download locally straight to your computer's designated "Downloads" folder, fully bypassing the cloud.</p>
                </div>
            </div>
        </article>
    );
}
