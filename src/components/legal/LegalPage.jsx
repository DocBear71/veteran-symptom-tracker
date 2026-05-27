// src/components/legal/LegalPage.jsx
// Standalone public legal page for docbearssymptomvault.com/privacy-policy
// Mirrors the Comfort Kitchen pattern for Play Store / App Store compliance

import React, { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import AboutUs from './AboutUs';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', component: PrivacyPolicy },
    { id: 'terms', label: 'Terms of Use', component: TermsOfUse },
    { id: 'about', label: 'About Us', component: AboutUs },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || PrivacyPolicy;

  return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '30px 40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <img src="/icon-512.png" alt="Doc Bear" style={{ width: '48px', height: '48px', borderRadius: '10px' }} />
            <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 'bold' }}>
              Doc Bear's Symptom Vault
            </h1>
          </div>
          <p style={{ fontSize: '16px', color: '#bfdbfe', margin: 0 }}>
            Legal Information &amp; Privacy Policy
          </p>
          <p style={{ fontSize: '14px', color: '#93c5fd', marginTop: '8px' }}>
            🔒 No Cloud · No AI · No Analytics · 100% Local Storage
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ backgroundColor: '#fff', borderBottom: '2px solid #e5e7eb', padding: '0 40px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '8px', paddingTop: '16px' }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
          </div>
        </div>

        {/* Content */}
        <div style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 300px)' }}>
          <ActiveComponent />
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '30px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
            Doc Bear Enterprises, LLC.
          </p>
          <p style={{ fontSize: '14px', color: '#bfdbfe', marginBottom: '8px' }}>
            5249 N Park Pl NE, PMB 4011, Cedar Rapids, IA 52402
          </p>
          <p style={{ fontSize: '14px', color: '#bfdbfe', marginBottom: '16px' }}>
            Email: privacy@docbear-ent.com
          </p>
          <p style={{ fontSize: '13px', color: '#93c5fd' }}>
            Built with ❤️ by a Marine Corps veteran · © 2023–{new Date().getFullYear()} Doc Bear Enterprises, LLC.
          </p>
        </div>
      </div>
  );
};

export default LegalPage;