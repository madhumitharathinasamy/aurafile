import { Metadata } from "next";

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Privacy Policy | AuraFile",
    description:
        "AuraFile's Privacy Policy explains how we handle your data and keep your files private through 100% client-side processing. No files are ever uploaded to our servers.",
    alternates: {
        canonical: "https://aurafile.net/privacy-policy",
    },
};

const SECTIONS = [
    {
        id: "introduction",
        number: "1",
        title: "Introduction",
        content: (
            <p>
                Welcome to <strong>AuraFile</strong> (&quot;we&quot;, &quot;our&quot;, or
                &quot;us&quot;), accessible at{" "}
                <a href="https://aurafile.net" className="text-[#00B4D8] hover:underline">
                    https://aurafile.net
                </a>
                . We are committed to protecting your privacy and handling any information we
                encounter with care and respect. This Privacy Policy explains what data we collect,
                why we collect it, how we use it, and the rights you have over your information.
                Please read it carefully. By using AuraFile, you agree to the practices described in
                this policy. If you do not agree, please discontinue use of the service.
            </p>
        ),
    },
    {
        id: "client-side-processing",
        number: "2",
        title: "Client-Side File Processing — Your Files Never Leave Your Device",
        content: (
            <>
                <p className="mb-4">
                    AuraFile is built on a strict{" "}
                    <strong>100% client-side processing architecture</strong>. This is the most
                    important privacy guarantee we offer:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                        All file operations — including PDF editing, image conversion, compression,
                        background removal, OCR, and more — are performed{" "}
                        <strong>entirely within your web browser</strong> using JavaScript and
                        WebAssembly technologies.
                    </li>
                    <li>
                        <strong>
                            We do not upload, transmit, or store your files on any server.
                        </strong>{" "}
                        Your files never leave your device during processing.
                    </li>
                    <li>
                        No account or login is required; we do not collect file names, file
                        contents, or any metadata from the files you process.
                    </li>
                    <li>
                        Once you close or refresh the browser tab, any file data held temporarily
                        in browser memory is immediately discarded.
                    </li>
                    <li>
                        This design means we are{" "}
                        <strong>technically incapable</strong> of accessing, reading, or sharing
                        your files — because they never reach our infrastructure.
                    </li>
                </ul>
                <p>
                    If any future tool requires server-side processing, we will clearly disclose
                    this before you use it and update this policy accordingly.
                </p>
            </>
        ),
    },
    {
        id: "information-collected",
        number: "3",
        title: "Information We Collect",
        content: (
            <>
                <p className="mb-3">
                    Because AuraFile does not require accounts and does not process your files on our
                    servers, the data we collect is limited to standard website analytics:
                </p>
                <h3 className="font-semibold text-foreground mt-5 mb-2">
                    3.1 Automatically Collected Usage Data
                </h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Pages visited and features used on AuraFile.</li>
                    <li>Browser type, version, and operating system.</li>
                    <li>Approximate geographic region (country/city level, derived from IP).</li>
                    <li>Referring website or search query that led you to AuraFile.</li>
                    <li>Time and duration of your visit.</li>
                    <li>Device type (desktop, mobile, tablet).</li>
                </ul>
                <p className="mb-4">
                    This data is collected in <strong>aggregated and anonymized</strong> form via
                    third-party analytics services (see Section 5). We cannot use this data to
                    identify you personally.
                </p>
                <h3 className="font-semibold text-foreground mt-5 mb-2">
                    3.2 Data You Voluntarily Provide
                </h3>
                <p>
                    If you contact us via email (e.g., at{" "}
                    <a
                        href="mailto:team@aurafile.net"
                        className="text-[#00B4D8] hover:underline"
                    >
                        team@aurafile.net
                    </a>
                    ), we will receive your email address and the content of your message. We use
                    this solely to respond to your inquiry and do not add you to any mailing list
                    without explicit consent.
                </p>
            </>
        ),
    },
    {
        id: "cookies",
        number: "4",
        title: "Cookies & Tracking Technologies",
        content: (
            <>
                <p className="mb-4">
                    AuraFile uses cookies and similar tracking technologies. A{" "}
                    <strong>cookie</strong> is a small text file placed on your device by a website
                    you visit. We use the following categories of cookies:
                </p>

                <div className="space-y-5">
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">
                            4.1 Strictly Necessary Cookies
                        </h3>
                        <p>
                            These cookies are essential for the website to function correctly. They
                            do not collect personal information and cannot be switched off. Examples
                            include cookies that remember your cookie consent preference.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">
                            4.2 Analytics Cookies (Google Analytics)
                        </h3>
                        <p>
                            We use <strong>Google Analytics</strong> to understand how visitors
                            interact with our website. Google Analytics places cookies on your
                            device to collect anonymized usage statistics (pages viewed, session
                            duration, traffic sources). This helps us improve AuraFile. Google may
                            transfer this information to servers in the United States or other
                            countries. You can opt out of Google Analytics tracking via the{" "}
                            <a
                                href="https://tools.google.com/dlpage/gaoptout"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00B4D8] hover:underline"
                            >
                                Google Analytics Opt-out Browser Add-on
                            </a>
                            .
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">
                            4.3 Advertising Cookies (Google AdSense)
                        </h3>
                        <p className="mb-3">
                            Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to AuraFile.net and/or other sites on the Internet.
                        </p>
                        <p className="mb-3">
                            Specifically, Google AdSense may:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-3">
                            <li>
                                Place cookies (such as the DoubleClick cookie) on your
                                device to track your browsing behavior across websites in the Google
                                Display Network.
                            </li>
                            <li>
                                Use identifiers stored in cookies to build a profile of your
                                interests and display relevant ads.
                            </li>
                            <li>
                                Collect data such as your IP address, browser type, and pages
                                visited on AuraFile for ad targeting and fraud prevention.
                            </li>
                            <li>
                                Share this data with Google LLC and its advertising partners, who
                                may be located outside your country of residence.
                            </li>
                        </ul>
                        <p>
                            You can opt out of personalized advertising by visiting Google's Ads
                            Settings or the Network Advertising Initiative opt-out page. Note that
                            opting out means you will still see ads — they will just be less
                            personalized.
                        </p>
                        <p className="mt-3">
                            Google's use of advertising cookies is governed by Google's Privacy Policy.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">
                            4.4 Managing Cookies
                        </h3>
                        <p>
                            You can control and delete cookies via your browser settings. Please
                            note that disabling certain cookies may affect the functionality of
                            AuraFile or the ads you see. Common browser cookie management links:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>
                                <a
                                    href="https://support.google.com/chrome/answer/95647"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00B4D8] hover:underline"
                                >
                                    Google Chrome
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00B4D8] hover:underline"
                                >
                                    Mozilla Firefox
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00B4D8] hover:underline"
                                >
                                    Apple Safari
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00B4D8] hover:underline"
                                >
                                    Microsoft Edge
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        ),
    },
    {
        id: "third-party-services",
        number: "5",
        title: "Third-Party Services",
        content: (
            <>
                <p className="mb-4">
                    AuraFile integrates the following third-party services. Each has its own privacy
                    policy and data practices that are independent of ours:
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-foreground/20">
                                <th className="text-left py-2 pr-4 font-semibold text-foreground">
                                    Service
                                </th>
                                <th className="text-left py-2 pr-4 font-semibold text-foreground">
                                    Purpose
                                </th>
                                <th className="text-left py-2 font-semibold text-foreground">
                                    Privacy Policy
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/10">
                            <tr>
                                <td className="py-3 pr-4 font-medium">Google AdSense</td>
                                <td className="py-3 pr-4">Displaying personalized and contextual advertisements</td>
                                <td className="py-3">
                                    <a
                                        href="https://policies.google.com/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00B4D8] hover:underline"
                                    >
                                        Google Privacy Policy
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 font-medium">Google Analytics</td>
                                <td className="py-3 pr-4">Anonymized website usage analytics</td>
                                <td className="py-3">
                                    <a
                                        href="https://policies.google.com/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00B4D8] hover:underline"
                                    >
                                        Google Privacy Policy
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 font-medium">Vercel Analytics</td>
                                <td className="py-3 pr-4">Performance monitoring and Core Web Vitals tracking</td>
                                <td className="py-3">
                                    <a
                                        href="https://vercel.com/legal/privacy-policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00B4D8] hover:underline"
                                    >
                                        Vercel Privacy Policy
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="mt-4">
                    We are not responsible for the privacy practices of these third-party services.
                    We encourage you to review their privacy policies before using AuraFile.
                </p>
            </>
        ),
    },
    {
        id: "how-we-use-data",
        number: "6",
        title: "How We Use Your Information",
        content: (
            <>
                <p className="mb-3">
                    The limited data we collect is used solely for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Improving AuraFile:</strong> Analyzing usage patterns to understand
                        which tools are most popular, identify bugs, and prioritize new features.
                    </li>
                    <li>
                        <strong>Website Performance:</strong> Monitoring page load times, error
                        rates, and Core Web Vitals to ensure a fast and reliable experience.
                    </li>
                    <li>
                        <strong>Displaying Advertisements:</strong> Serving ads via Google AdSense
                        to fund the free availability of AuraFile's tools.
                    </li>
                    <li>
                        <strong>Legal Compliance:</strong> Complying with applicable laws and
                        responding to lawful requests from public authorities.
                    </li>
                    <li>
                        <strong>Communication:</strong> Responding to emails or support inquiries
                        you send us.
                    </li>
                </ul>
                <p className="mt-4">
                    We do <strong>not</strong> sell your personal data to any third party. We do not
                    use your data for automated decision-making or profiling.
                </p>
            </>
        ),
    },
    {
        id: "data-retention",
        number: "7",
        title: "Data Retention",
        content: (
            <>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Your files:</strong> Not retained at all — they are never uploaded
                        to our servers. Any temporary in-browser memory is cleared when you close
                        the tab or refresh the page.
                    </li>
                    <li>
                        <strong>Analytics data:</strong> Retained by Google Analytics in accordance
                        with Google&apos;s data retention settings (typically 14–26 months before
                        automatic deletion).
                    </li>
                    <li>
                        <strong>AdSense data:</strong> Retained and managed by Google in accordance
                        with Google's own data retention policies.
                    </li>
                    <li>
                        <strong>Email communications:</strong> Retained for as long as necessary to
                        resolve your inquiry, then deleted.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "your-rights",
        number: "8",
        title: "Your Privacy Rights",
        content: (
            <>
                <p className="mb-4">
                    Depending on your location, you may have the following rights regarding your
                    personal data:
                </p>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">
                            8.1 GDPR Rights (EEA / UK Residents)
                        </h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>
                                <strong>Right of Access:</strong> Request a copy of the personal
                                data we hold about you.
                            </li>
                            <li>
                                <strong>Right to Rectification:</strong> Request correction of
                                inaccurate data.
                            </li>
                            <li>
                                <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request
                                deletion of your personal data where we are no longer justified in
                                holding it.
                            </li>
                            <li>
                                <strong>Right to Restrict Processing:</strong> Ask us to restrict
                                how we use your data.
                            </li>
                            <li>
                                <strong>Right to Data Portability:</strong> Receive your data in a
                                structured, machine-readable format.
                            </li>
                            <li>
                                <strong>Right to Object:</strong> Object to the processing of your
                                personal data, including for direct marketing.
                            </li>
                            <li>
                                <strong>Right to Withdraw Consent:</strong> Where processing is
                                based on consent, withdraw it at any time without affecting the
                                lawfulness of prior processing.
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">
                            8.2 CCPA Rights (California Residents)
                        </h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>
                                <strong>Right to Know:</strong> Request information about the
                                categories and specific pieces of personal information we collect.
                            </li>
                            <li>
                                <strong>Right to Delete:</strong> Request deletion of personal
                                information we have collected from you.
                            </li>
                            <li>
                                <strong>Right to Opt-Out of Sale:</strong> We do not sell personal
                                information. However, you may opt out of Google&apos;s
                                interest-based advertising as described in Section 4.3.
                            </li>
                            <li>
                                <strong>Right to Non-Discrimination:</strong> We will not
                                discriminate against you for exercising your CCPA rights.
                            </li>
                        </ul>
                    </div>
                </div>
                <p className="mt-4">
                    Since AuraFile does not store personal files or require account registration,
                    most of the above rights are satisfied by design. To exercise any right, contact
                    us at{" "}
                    <a
                        href="mailto:team@aurafile.net"
                        className="text-[#00B4D8] hover:underline"
                    >
                        team@aurafile.net
                    </a>
                    . We will respond within 30 days.
                </p>
            </>
        ),
    },
    {
        id: "childrens-privacy",
        number: "9",
        title: "Children's Privacy",
        content: (
            <p>
                AuraFile is not directed to children under the age of 13 (or 16 in the EEA). We do
                not knowingly collect personal information from children. If you believe a child has
                provided us with personal information, please contact us at{" "}
                <a href="mailto:team@aurafile.net" className="text-[#00B4D8] hover:underline">
                    team@aurafile.net
                </a>{" "}
                and we will take steps to delete such information promptly.
            </p>
        ),
    },
    {
        id: "international-transfers",
        number: "10",
        title: "International Data Transfers",
        content: (
            <p>
                AuraFile is hosted on Vercel infrastructure, which may be located in various
                countries including the United States. Analytics and advertising data collected by
                Google may also be processed in the United States or other countries where Google
                operates. By using AuraFile, you consent to the transfer of your information to
                these countries, which may have different data protection laws than your country of
                residence. Where required, we rely on Standard Contractual Clauses (SCCs) or other
                approved transfer mechanisms to safeguard your data.
            </p>
        ),
    },
    {
        id: "security",
        number: "11",
        title: "Data Security",
        content: (
            <p>
                Since your files never leave your device, the primary security boundary for file
                processing is your own browser and device — which is the strongest possible
                protection. For the limited analytics and advertising data managed by third-party
                services, we select reputable providers (Google, Vercel) that implement
                industry-standard security measures including encryption in transit and at rest.
                However, no method of transmission over the internet is 100% secure, and we cannot
                guarantee absolute security of data transmitted to third-party services.
            </p>
        ),
    },
    {
        id: "policy-changes",
        number: "12",
        title: "Changes to This Privacy Policy",
        content: (
            <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices, technology, legal requirements, or other factors. When we make changes,
                we will update the &quot;Last Updated&quot; date at the top of this page. For
                significant changes, we may add a prominent notice on our website. We encourage you
                to review this policy periodically. Your continued use of AuraFile after any changes
                constitutes your acceptance of the updated policy.
            </p>
        ),
    },
    {
        id: "contact",
        number: "13",
        title: "Contact Us",
        content: (
            <>
                <p className="mb-3">
                    If you have any questions, concerns, or requests regarding this Privacy Policy
                    or our data practices, please contact us:
                </p>
                <div className="bg-foreground/5 rounded-lg p-4 space-y-1">
                    <p>
                        <strong>AuraFile</strong>
                    </p>
                    <p>
                        Email:{" "}
                        <a
                            href="mailto:team@aurafile.net"
                            className="text-[#00B4D8] hover:underline"
                        >
                            team@aurafile.net
                        </a>
                    </p>
                    <p>
                        Website:{" "}
                        <a
                            href="https://aurafile.net"
                            className="text-[#00B4D8] hover:underline"
                        >
                            https://aurafile.net
                        </a>
                    </p>
                </div>
                <p className="mt-4">
                    We aim to respond to all privacy-related inquiries within{" "}
                    <strong>30 days</strong>. If you are in the EEA and are not satisfied with our
                    response, you have the right to lodge a complaint with your local data
                    protection authority.
                </p>
            </>
        ),
    },
];

export default function PrivacyPolicy() {
    const lastUpdated = "March 2026";

    return (
        <main className="container mx-auto max-w-4xl px-4 py-16 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="mb-4 text-[#00B4D8] font-extrabold text-4xl md:text-5xl tracking-tight">
                    Privacy Policy
                </h1>
                <p className="text-foreground/60 text-sm">Last Updated: {lastUpdated}</p>
                <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">
                    Your privacy matters to us. AuraFile processes all your files directly in your
                    browser — we never see or store your files. Below we explain exactly what data
                    we do collect and how it is used.
                </p>
            </div>

            {/* Quick Summary Card */}
            <div className="mb-10 rounded-xl border border-[#00B4D8]/30 bg-[#00B4D8]/5 p-6">
                <h2 className="text-lg font-bold text-[#00B4D8] mb-3">
                    🔒 Privacy at a Glance
                </h2>
                <ul className="space-y-2 text-foreground/80 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                        <span>
                            <strong>Your files stay on your device.</strong> All processing happens
                            in your browser — no uploads to our servers.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                        <span>
                            <strong>No account required.</strong> We don&apos;t collect your name,
                            email, or any personal information to use our tools.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5 shrink-0">⚠</span>
                        <span>
                            <strong>We use Google AdSense.</strong> Ads are displayed on AuraFile.
                            Google uses cookies to show relevant ads based on your browsing history.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5 shrink-0">⚠</span>
                        <span>
                            <strong>We use analytics cookies.</strong> Google Analytics and Vercel
                            Analytics collect anonymized usage data to help us improve the site.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                        <span>
                            <strong>We never sell your data.</strong> Your information is never
                            sold to third parties.
                        </span>
                    </li>
                </ul>
            </div>

            {/* Table of Contents */}
            <nav className="mb-10 rounded-xl border border-foreground/10 bg-foreground/5 p-6">
                <h2 className="font-semibold text-foreground mb-3">Table of Contents</h2>
                <ol className="space-y-1 text-sm text-[#00B4D8]">
                    {SECTIONS.map((s) => (
                        <li key={s.id}>
                            <a href={`#${s.id}`} className="hover:underline">
                                {s.number}. {s.title}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Sections */}
            <div className="space-y-10 text-foreground/80">
                {SECTIONS.map((section) => (
                    <section key={section.id} id={section.id} className="scroll-mt-20">
                        <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-foreground/10">
                            {section.number}. {section.title}
                        </h2>
                        <div className="text-sm leading-relaxed">{section.content}</div>
                    </section>
                ))}
            </div>

            {/* Footer note */}
            <div className="mt-16 pt-8 border-t border-foreground/10 text-center text-xs text-foreground/50">
                <p>
                    This Privacy Policy is effective as of {lastUpdated} and applies to all users of{" "}
                    <a href="https://aurafile.net" className="text-[#00B4D8] hover:underline">
                        aurafile.net
                    </a>
                    .
                </p>
            </div>
        </main>
    );
}
