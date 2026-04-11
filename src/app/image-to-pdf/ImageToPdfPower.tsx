import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export function ImageToPdfPower() {
    return (
        <article className="prose prose-slate max-w-none text-slate-600">
            <p className="lead text-xl text-slate-700 font-medium mb-10">
                Emailing ten separate JPEG photographs from a whiteboard session or architectural site visit creates a chaotic, disorganized experience for the recipient. By converting your individual image files into a single, structured PDF portfolio, you guarantee that your documents are viewed exactly in the sequence you intended. Our professional Image to PDF converter handles this natively in your browser, completely avoiding external servers and maintaining crisp image quality.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="shield-check" className="text-[#00B4D8]" size={24} />
                Technology & Privacy: Local Assembly Architecture
            </h2>
            <p>
                A severe security problem arises when professionals upload photographs of whiteboards—which often contain proprietary company roadmaps or confidential architecture—to generic conversion websites. These sites compile the PDF on a remote server, meaning your intellectual property is temporarily downloaded onto a machine you do not own. This fundamental danger is precisely <Link href="/blog/why-professionals-should-avoid-uploading-sensitive-files" className="text-[#00B4D8] hover:underline font-medium">why uploading sensitive corporate assets is restricted</Link> in strict corporate environments.
            </p>
            <p>
                AuraFile's processing completely eradicates this risk. Our image-to-PDF compiler is built on advanced WebAssembly. When you drag your photos into the dashboard, your local web browser dynamically generates the PDF container on your own machine. <strong>None of your photographs are transmitted across the internet.</strong> The conversion happens offline inside your device's memory pool, ensuring mathematical privacy and incredibly fast PDF generation.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="image" className="text-[#00B4D8]" size={24} />
                Detailed How-To Guide: Constructing Your Portfolio
            </h2>
            <p>
                Converting images to a PDF is highly dependent on sequential organization and page formatting. Follow these technical steps to ensure your final document presents flawlessly.
            </p>
            
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Step 1: Auditing Your Images</h3>
            <p>
                Before compiling the PDF, verify that all your source photographs are correctly oriented. A PDF compiler cannot "know" that a photograph of a receipt was taken sideways. If your image needs rotating or trimming, process it through our <Link href="/crop-image" className="text-[#00B4D8] hover:underline font-medium">Image Cropper</Link> beforehand to ensure the dimensions are uniform and the borders are clean.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Step 2: Sequential Ordering and Margins</h3>
            <p>
                Drop your batch of JPEGs, PNGs, or WebP files into the uploader. You can visually drag the thumbnails left and right to establish exactly which image becomes Page 1, Page 2, and so forth. Use the margin controls to dictate how the image sits on the digital "paper." Setting zero margins stretches the image to the absolute borders, which is ideal for scanned documents, while adding a small margin creates a more professional, "framed" look suitable for photography portfolios.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Step 3: Compression Management</h3>
            <p>
                If you compile twenty 5MB high-resolution camera photos into one PDF, the resulting PDF will weigh 100MB, making it technically impossible to email. Once your master PDF is generated, we strongly advise placing it directly into our <Link href="/compress-pdf" className="text-[#00B4D8] hover:underline font-medium">PDF Compressor</Link> to logically scale down the internal imagery to a web-friendly size while keeping the document structurally intact.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="briefcase" className="text-[#00B4D8]" size={24} />
                Use Cases & Professional Benefits
            </h2>
            <p>
                Converting loose image files into bound PDF documents is standard practice across dozens of administrative scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Expense Reporting:</strong> Traveling professionals photograph dozens of individual taxi, hotel, and restaurant receipts. Consolidating all these disconnected JPEGs into a single "March_Expenses.pdf" makes life infinitely easier for the corporate accounting department.</li>
                <li><strong>Creative Portfolios:</strong> Photographers and digital illustrators compile their disparate PNG artworks into a single cohesive portfolio deck to securely email to prospective advertising agencies or clients.</li>
                <li><strong>Construction & Architecture:</strong> Site inspectors take hundreds of unorganized photos on their tablets. Converting a batch from one specific room into a unified PDF ensures that the context of the photos remains intact when reviewed by upper management.</li>
                <li><strong>Legal Discovery:</strong> Attorneys who receive hundreds of scanned photographs of physical evidence convert them into batched PDF dossiers, allowing them to utilize standard PDF-stamping and bates-numbering tools later.</li>
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
                            <td className="p-4 font-medium text-slate-700">Image Support</td>
                            <td className="p-4 text-slate-600">JPG, PNG, WebP, AVIF, BMP</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-slate-700">Page Formatting Options</td>
                            <td className="p-4 text-slate-600">A4 standard sizing paired with customizable border margins</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-slate-700">Privacy Execution</td>
                            <td className="p-4 text-slate-600 font-semibold text-emerald-600">100% Client-Side Assembly (Zero Upload)</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-slate-700">Batch Processing</td>
                            <td className="p-4 text-slate-600">Combine virtually unlimited images per export</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
                Expanded FAQs
            </h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Are the images downscaled during the PDF creation?</h3>
                    <p className="text-slate-600">No. During the image-to-PDF compile step, our engine natively embeds your image without altering its fundamental pixels or lowering its quality, preserving absolute high-fidelity rendering. To reduce the file footprint, you must explicitly use a compression tool post-generation.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Can I place multiple images on a single PDF page?</h3>
                    <p className="text-slate-600">Currently, the compiler operates strictly on a one-image-per-page logic. If you wish to compile a complex grid of images on a single sheet, we recommend using a photo collage layout tool beforehand, and then converting that single collage into your PDF.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">What happens to a PNG's transparent background?</h3>
                    <p className="text-slate-600">The PDF standard inherently supports alpha channels. If you convert a PNG logo that has a transparent background, the resulting PDF will maintain that transparency naturally.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Why does the system ask me how to select paper size?</h3>
                    <p className="text-slate-600">PDFs were originally invented specifically for physical printers. Therefore, a PDF must be bound to a "virtual paper size" (most commonly A4 internationally or US Letter domestically). If your image is a long panorama, placing it on A4 paper will force the image to significantly scale down to fit the page boundaries.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Is there any risk of the PDF containing a virus?</h3>
                    <p className="text-slate-600">Because the final PDF file is physically forged by your own web browser acting on your direct input imagery—and not downloaded from a remote third-party server—it is mathematically impossible for external malware payloads to be injected into the document during the conversion process.</p>
                </div>
            </div>
        </article>
    );
}
