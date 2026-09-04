// file: src/components/legal/LegalPage.jsx  v2
// Standalone public legal page (e.g. docbearssymptomvault.com/legal)
// Serves the Privacy Policy, Terms of Use, and About page for Play Store / App Store review.
//
// v2 CHANGES (for attorney review):
//  - Deep linking: the active tab is driven by the URL hash (#privacy, #terms, #about),
//    so the app stores, your attorney, and support emails can link straight to a document.
//    Section anchors inside a document (e.g. #terms/disputes) also work.
//  - Added a separate, distinct "Consumer Health Data Privacy Policy" link in the header.
//    Washington's My Health My Data Act requires a regulated entity to publish such a link
//    on its homepage. We take the position that we are not a regulated entity, but the link
//    costs nothing and removes an argument. ATTORNEY REVIEW: confirm placement and wording.
//  - Added a Print / Save as PDF button so a reviewer can capture a dated copy.
//  - Added the effective date and document version to the footer.
//  - Header now also carries the "not a medical device" and "not affiliated with the VA"
//    statements, so those appear on the page an app store reviewer lands on.
//  - Removed a no-op inline CSS custom property from the content wrapper.
//  - Tab buttons are now a proper ARIA tablist with keyboard support.

import React, { useState, useEffect, useCallback } from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import AboutUs from './AboutUs';
import { COMPANY, LEGAL_EFFECTIVE_DATE, LEGAL_VERSION } from './legalMeta';

const TABS = [
    { id: 'privacy', label: 'Privacy Policy', component: PrivacyPolicy },
    { id: 'terms', label: 'Terms of Use', component: TermsOfUse },
    { id: 'about', label: 'About Us', component: AboutUs },
];

// Parse "#terms" or "#terms/disputes" into { tab, section }
const parseHash = () => {
    const raw = (typeof window !== 'undefined' ? window.location.hash : '').replace(/^#/, '');
    if (!raw) return { tab: 'privacy', section: null };
    const [tabPart, sectionPart] = raw.split('/');
    const match = TABS.find(t => t.id === tabPart);
    return { tab: match ? match.id : 'privacy', section: sectionPart || null };
};

const LegalPage = () => {
    const [activeTab, setActiveTab] = useState(() => parseHash().tab);

    // Keep the tab in sync with the URL hash (back button, pasted deep links)
    useEffect(() => {
        const onHashChange = () => {
            const { tab, section } = parseHash();
            setActiveTab(tab);
            if (section) {
                // Let the new tab render before scrolling to the anchor
                window.setTimeout(() => {
                    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }
        };
        window.addEventListener('hashchange', onHashChange);
        onHashChange();
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const selectTab = useCallback((tabId, section = null) => {
        setActiveTab(tabId);
        window.location.hash = section ? `${tabId}/${section}` : tabId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Left/Right arrow navigation across the tablist
    const handleTabKeyDown = (e, index) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        const next = TABS[(index + delta + TABS.length) % TABS.length];
        selectTab(next.id);
    };

    const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || PrivacyPolicy;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif' }}>

            {/* Header */}
            <div style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '30px 40px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img src="/icon-512.png" alt="" style={{ width: '48px', height: '48px', borderRadius: '10px' }} />
                    <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 'bold' }}>
                        {COMPANY.appName}
                    </h1>
                </div>
                <p style={{ fontSize: '16px', color: '#bfdbfe', margin: 0 }}>
                    Legal Information &amp; Privacy Policy
                </p>
                <p style={{ fontSize: '14px', color: '#93c5fd', marginTop: '8px' }}>
                    🔒 No Accounts · No AI · No Analytics · Stored Locally · No Server-Side Copy
                </p>

                {/* Store-facing disclaimers, visible on the landing page itself */}
                <p style={{ fontSize: '13px', color: '#dbeafe', marginTop: '12px', maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                    This app is <strong>not a medical device</strong> and does not diagnose, treat, cure, or
                    prevent any medical condition. It is <strong>not affiliated with the U.S. Department of
                    Veterans Affairs</strong>. Consult a qualified healthcare professional for medical advice,
                    diagnosis, or treatment.
                </p>

                {/* Separate, distinct consumer health data link (Washington MHMDA) */}
                <p style={{ fontSize: '13px', marginTop: '14px' }}>
                    <a
                        href="#privacy/us-rights"
                        onClick={(e) => { e.preventDefault(); selectTab('privacy', 'us-rights'); }}
                        style={{ color: '#fff', textDecoration: 'underline' }}
                    >
                        Consumer Health Data Privacy Policy
                    </a>
                </p>
            </div>

            {/* Tab Navigation */}
            <div style={{ backgroundColor: '#fff', borderBottom: '2px solid #e5e7eb', padding: '0 40px' }}>
                <div
                    role="tablist"
                    aria-label="Legal documents"
                    style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '8px', paddingTop: '16px', flexWrap: 'wrap' }}
                >
                    {TABS.map((tab, index) => (
                        <button
                            key={tab.id}
                            id={`legal-tab-${tab.id}`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls="legal-tabpanel"
                            tabIndex={activeTab === tab.id ? 0 : -1}
                            onClick={() => selectTab(tab.id)}
                            onKeyDown={(e) => handleTabKeyDown(e, index)}
                            style={{
                                padding: '10px 20px',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: activeTab === tab.id ? '#fff' : '#1e3a8a',
                                backgroundColor: activeTab === tab.id ? '#1e3a8a' : '#fff',
                                border: `2px solid ${activeTab === tab.id ? '#1e3a8a' : '#e5e7eb'}`,
                                borderBottom: 'none',
                                borderRadius: '8px 8px 0 0',
                                cursor: 'pointer',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}

                    {/* Print / Save as PDF -- useful for attorney review and store submissions */}
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="legal-page-noprint"
                        style={{
                            marginLeft: 'auto',
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e3a8a',
                            backgroundColor: '#fff',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            alignSelf: 'center',
                            marginBottom: '8px',
                        }}
                    >
                        🖨️ Print / Save as PDF
                    </button>
                </div>
            </div>

            {/* Content -- force light styling, since the child components use Tailwind
            dark-mode classes that do not apply in this standalone context */}
            <div
                id="legal-tabpanel"
                role="tabpanel"
                aria-labelledby={`legal-tab-${activeTab}`}
                style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 300px)', color: '#111827' }}
            >
                <style>{`
            .legal-page-content,
            .legal-page-content * {
              color: #111827 !important;
            }
            .legal-page-content h1,
            .legal-page-content h2,
            .legal-page-content h3 {
              color: #000000 !important;
            }
            .legal-page-content a {
              color: #1d4ed8 !important;
            }
            /* Override dark background boxes coming from Tailwind dark-mode classes */
            .legal-page-content .bg-gray-800,
            .legal-page-content .bg-gray-900,
            .legal-page-content .bg-gray-700,
            .legal-page-content .dark\\:bg-gray-800,
            .legal-page-content .dark\\:bg-gray-900,
            .legal-page-content [class*="bg-gray-8"],
            .legal-page-content [class*="bg-gray-9"],
            .legal-page-content [class*="bg-blue-9"],
            .legal-page-content [class*="bg-slate-8"],
            .legal-page-content [class*="bg-slate-9"] {
              background-color: #f0f4ff !important;
              border: 1px solid #c7d2fe !important;
            }
            /* Override inline dark styles used in some sections */
            .legal-page-content [style*="background-color: rgb(17"],
            .legal-page-content [style*="background-color: rgb(30"],
            .legal-page-content [style*="background-color: rgb(31"],
            .legal-page-content [style*="background-color: #1e"] {
              background-color: #f0f4ff !important;
              border: 1px solid #c7d2fe !important;
            }
            /* Keep the warning boxes visually distinct rather than flattening them */
            .legal-page-content .bg-green-900,
            .legal-page-content .bg-green-900\\/20 {
              background-color: #f0fdf4 !important;
              border: 1px solid #86efac !important;
            }
            .legal-page-content .bg-red-900,
            .legal-page-content .bg-red-900\\/20 {
              background-color: #fef2f2 !important;
              border: 1px solid #fca5a5 !important;
            }
            .legal-page-content .bg-yellow-900,
            .legal-page-content .bg-yellow-900\\/20,
            .legal-page-content .bg-amber-900 {
              background-color: #fffbeb !important;
              border: 1px solid #fcd34d !important;
            }
            .legal-page-content .bg-purple-900,
            .legal-page-content .bg-purple-900\\/20 {
              background-color: #faf5ff !important;
              border: 1px solid #d8b4fe !important;
            }
            /* Anchor targets should not hide under any sticky chrome */
            .legal-page-content section[id] {
              scroll-margin-top: 24px;
            }
            @media print {
              .legal-page-noprint { display: none !important; }
              .legal-page-content { font-size: 11pt; }
            }
          `}</style>
                <div className="legal-page-content">
                    <ActiveComponent />
                </div>
            </div>

            {/* Footer */}
            <div style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '30px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
                    {COMPANY.legalName}
                </p>
                <p style={{ fontSize: '14px', color: '#bfdbfe', marginBottom: '8px' }}>
                    {COMPANY.street}, {COMPANY.cityStateZip}
                </p>
                <p style={{ fontSize: '14px', color: '#bfdbfe', marginBottom: '16px' }}>
                    Email: {COMPANY.privacyEmail}
                </p>
                <p style={{ fontSize: '13px', color: '#93c5fd', marginBottom: '6px' }}>
                    Document version {LEGAL_VERSION} · Effective {LEGAL_EFFECTIVE_DATE}
                </p>
                <p style={{ fontSize: '13px', color: '#93c5fd' }}>
                    Built by a Marine Corps veteran · © 2023–{new Date().getFullYear()} {COMPANY.legalName}
                </p>
            </div>
        </div>
    );
};

export default LegalPage;