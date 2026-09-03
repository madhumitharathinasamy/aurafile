import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function HeicToJpgPower() {
    return (
        <article className="prose prose-slate max-w-none text-slate-600">
            <p className="lead text-xl text-slate-700 font-medium mb-10">
                If you use an iPhone, your photos are saved in Apple's High-Efficiency Image Container (HEIC) format by default. While this format saves space on your device, it creates massive compatibility headaches when you try to open these files on Windows, upload them to web forms, or share them with non-Apple users. The standard solution is to search for a free "HEIC to JPG converter," but almost every converter online requires you to upload your deeply personal, location-tagged photos to a cloud server. 
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-8 rounded-r-lg">
                <h3 className="text-amber-800 font-bold mt-0 mb-2 flex items-center gap-2">
                    <Icon name="alert-triangle" size={20} />
                    The Privacy Risk of Cloud Converters
                </h3>
                <p className="text-amber-700 mb-0">
                    When you upload an iPhone photo to a traditional converter website, you aren't just uploading the image. You are often uploading embedded metadata (EXIF data) which can contain the exact GPS coordinates of where the photo was taken, the date, and the device model. Once uploaded, you have zero control over how long that server keeps your photo.
                </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="shield-check" className="text-[#00B4D8]" size={24} />
                100% Client-Side Conversion
            </h2>
            <p>
                We built our HEIC to JPG tool using a <strong>Zero-Trust Architecture</strong>. By leveraging modern browser technologies, we bring the conversion engine directly into your web browser. 
            </p>
            <p>
                When you drag and drop a <code>.heic</code> file into our tool, it is processed entirely on your device's CPU. <strong>No data is ever transmitted over the network.</strong> The conversion happens offline, instantly, and securely.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="cpu" className="text-[#00B4D8]" size={24} />
                How Our Zero-Trust Converter Works
            </h2>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>You select a HEIC file from your device.</li>
                <li>Our conversion engine loads directly into your browser memory.</li>
                <li>The browser decodes the HEIC file locally and converts the pixel data to standard JPG format.</li>
                <li>The final JPG is saved back to your device. No server uploads occur.</li>
            </ol>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
                <Icon name="star" className="text-[#00B4D8]" size={24} />
                Why Use AuraFile for HEIC Conversion?
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>100% Private:</strong> Your photos never leave your device. Conversion happens completely offline.</li>
                <li><strong>Batch Processing:</strong> Convert up to 20 iPhone photos at once with a 50MB per-file limit.</li>
                <li><strong>Lightning Fast:</strong> By skipping the upload and download steps, conversion happens instantly.</li>
                <li><strong>High Quality:</strong> We preserve maximum image fidelity while converting to a universally compatible JPG.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 border-b pb-2">
                Frequently Asked Questions
            </h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Why can't I see a preview of my HEIC file?</h3>
                    <p className="text-slate-600">Most web browsers (like Chrome and Edge) do not natively support displaying HEIC files in image tags. To keep the tool fast and secure, we skip generating a heavy preview and proceed straight to converting the file into a universally viewable JPG.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Does this work on mobile?</h3>
                    <p className="text-slate-600">Yes! Our engine works entirely in your mobile browser. You can convert files directly on your phone without downloading an app.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Is there a file limit?</h3>
                    <p className="text-slate-600">Yes. Because the processing uses your device's memory, we cap uploads to 20 files at a time, with a maximum size of 50MB per file to prevent browser crashes.</p>
                </div>
            </div>
        </article>
    );
}
