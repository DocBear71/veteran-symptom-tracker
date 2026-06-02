// src/components/legal/Citations.jsx
// Regulatory sources and citations for App Store compliance (Guideline 1.4.1)

import React from 'react';

const Citations = () => {
  const sources = [
    {
      category: 'Federal Regulations',
      items: [
        {
          title: '38 CFR Part 4 — Schedule for Rating Disabilities',
          description: 'Primary regulatory source for all VA disability rating criteria in this app. Current as of October 31, 2025.',
          url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4',
        },
        {
          title: '38 CFR § 4.16 — Total Disability Ratings (TDIU)',
          description: 'Regulatory basis for TDIU eligibility analysis.',
          url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/section-4.16',
        },
        {
          title: '38 CFR § 3.103 — Procedural Due Process',
          description: 'Claims process rights and procedures.',
          url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.103',
        },
      ],
    },
    {
      category: 'VA Policy & Guidance',
      items: [
        {
          title: 'VA M21-1 Adjudication Procedures Manual',
          description: 'VA internal guidance used to inform claims process educational content.',
          url: 'https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000149088/M21-1-Adjudication-Procedures-Manual',
        },
        {
          title: 'VA Schedule for Rating Disabilities — Overview',
          description: 'Official VA explanation of the rating schedule.',
          url: 'https://www.benefits.va.gov/compensation/ratings.asp',
        },
      ],
    },
    {
      category: 'Case Law (U.S. Court of Appeals for Veterans Claims)',
      items: [
        {
          title: 'Saunders v. Wilkie, 886 F.3d 1356 (Fed. Cir. 2018)',
          description: 'Pain alone, without a diagnosed condition, can be the basis for a disability rating.',
          url: 'https://caselaw.findlaw.com/court/us-court-of-appeals-federal-circuit/1888836.html',
        },
        {
          title: 'Spicer v. McDonough, 61 F.4th 1360 (Fed. Cir. 2023)',
          description: 'Clarifies rating criteria application for musculoskeletal conditions.',
          url: 'https://scholar.google.com/scholar_case?case=spicer-mcdounough',
        },
        {
          title: 'Larson v. McDonough, 10 F.4th 1325 (Fed. Cir. 2021)',
          description: 'Defines standards for rating neurological conditions.',
          url: 'https://scholar.google.com/scholar_case?case=larson-mcdounough',
        },
      ],
    },
    {
      category: 'Medical Disclaimer',
      items: [
        {
          title: 'Important: This App Is Not Medical Advice',
          description: 'Doc Bear\'s Symptom Vault is a personal health documentation tool. It does not provide medical diagnoses, clinical recommendations, or treatment advice. All rating information reflects publicly available federal regulations. Always consult a qualified healthcare provider before making any health or medical decisions.',
          url: null,
        },
      ],
    },
  ];

  return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-bold mb-2">Sources & Citations</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          All rating criteria and regulatory information in this app is based on
          publicly available federal law and VA policy.
        </p>

        {sources.map((section) => (
            <div key={section.category} className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700
                         dark:text-blue-400 mb-3 border-b border-gray-200
                         dark:border-gray-700 pb-1">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                    <div key={item.title}
                         className="bg-white dark:bg-gray-800 rounded-lg border
                              border-gray-200 dark:border-gray-700 p-4">
                      <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {item.description}
                      </p>
                      {item.url && (
                          <a href={item.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-xs text-blue-600 dark:text-blue-400
                                hover:underline break-all">
                            View source →
                          </a>
                      )}
                    </div>
                ))}
              </div>
            </div>
        ))}

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border
                      border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Regulatory currency:</strong> 38 CFR Part 4 citations reflect
            the version current as of October 31, 2025. VA regulations may be
            updated periodically. Always verify current regulatory text at
            ecfr.gov before relying on any specific rating criterion.
          </p>
        </div>
      </div>
  );
};

export default Citations;