// CaregiverProgramsGuide.jsx
// Educational guide: VA Caregiver Programs — VDC vs PCAFC
// Helps veterans and caregivers understand available support programs

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { jsPDF } from 'jspdf';

// ─── Collapsible Section ─────────────────────────────────────────────────────

const GuideSection = ({ title, icon, children, defaultOpen = false, accentColor = 'blue' }) => {
  const [expanded, setExpanded] = useState(defaultOpen);

  const colorMap = {
    blue:   'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    green:  'border-green-500 bg-green-50 dark:bg-green-900/20',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    amber:  'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
    teal:   'border-teal-500 bg-teal-50 dark:bg-teal-900/20',
    red:    'border-red-500 bg-red-50 dark:bg-red-900/20',
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
            onClick={() => setExpanded(!expanded)}
            className={`w-full px-4 py-3 flex items-center justify-between border-l-4 ${colorMap[accentColor] || colorMap.blue} hover:opacity-90 transition-opacity`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm text-left">
              {title}
            </h3>
          </div>
          {expanded
              ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
              : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
          }
        </button>

        {expanded && (
            <div className="px-4 pb-4 pt-3 space-y-3">
              {children}
            </div>
        )}
      </div>
  );
};

// ─── Comparison Row ───────────────────────────────────────────────────────────

const CompareRow = ({ label, vdc, pcafc }) => (
    <div className="grid grid-cols-3 gap-2 text-xs py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="font-medium text-gray-700 dark:text-gray-300">{label}</div>
      <div className="text-blue-700 dark:text-blue-300">{vdc}</div>
      <div className="text-purple-700 dark:text-purple-300">{pcafc}</div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CaregiverProgramsGuide({ onBack }) {

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    const usableWidth = pageWidth - margin * 2;
    let y = 18;

    const addPageIfNeeded = (space = 20) => {
      if (y + space > 275) { doc.addPage(); y = 18; }
    };

    const sectionHeader = (title, rgb) => {
      addPageIfNeeded(14);
      doc.setFillColor(...rgb);
      doc.roundedRect(margin, y, usableWidth, 8, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin + 3, y + 5.5);
      y += 12;
      doc.setTextColor(40);
      doc.setFont(undefined, 'normal');
    };

    const bodyText = (text) => {
      addPageIfNeeded(10);
      doc.setFontSize(8.5);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(text, usableWidth - 2);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 2;
    };

    const bulletItem = (text) => {
      addPageIfNeeded(8);
      doc.setFontSize(8.5);
      doc.text('•', margin + 2, y);
      const lines = doc.splitTextToSize(text, usableWidth - 10);
      doc.text(lines, margin + 7, y);
      y += lines.length * 4.5 + 1;
    };

    const labeledLine = (label, text) => {
      addPageIfNeeded(8);
      doc.setFontSize(8.5);
      doc.setFont(undefined, 'bold');
      doc.text(`${label}: `, margin + 2, y);
      const labelWidth = doc.getTextWidth(`${label}: `);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(text, usableWidth - labelWidth - 4);
      doc.text(lines, margin + 2 + labelWidth, y);
      y += lines.length * 4.5 + 1;
    };

    // ── Header ──
    doc.setFillColor(13, 148, 136); // teal
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont(undefined, 'bold');
    doc.text('VA CAREGIVER PROGRAMS GUIDE', pageWidth / 2, 11, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('VDC vs PCAFC — Understanding Your Options', pageWidth / 2, 19, { align: 'center' });
    y = 32;

    doc.setTextColor(40);
    bodyText('Two separate VA programs help veterans stay in their homes. Understanding the difference — and which you qualify for — can significantly affect your monthly support.');
    y += 3;

    // ── VDC ──
    sectionHeader('VETERAN DIRECTED CARE (VDC)', [37, 99, 235]);
    bodyText('VDC is part of VA health care. If approved, the VA provides a monthly care budget used to hire caregivers and arrange help at home.');
    labeledLine('Who controls the money', 'Veteran directs the budget');
    labeledLine('Who gets paid', 'Caregivers hired by the veteran (may include some family members)');
    labeledLine('Typical budget range', '$2,000 – $5,000+ per month depending on needs and location');
    labeledLine('Program type', 'VA health care benefit');
    labeledLine('How to apply', 'Contact your VA primary care team or VA social worker');
    y += 3;

    // ── PCAFC ──
    sectionHeader('PROGRAM OF COMPREHENSIVE ASSISTANCE FOR FAMILY CAREGIVERS (PCAFC)', [147, 51, 234]);
    bodyText('PCAFC provides a monthly stipend paid directly to the caregiver — usually a spouse or family member providing personal care because of the veteran\'s service-connected disabilities.');
    labeledLine('Who gets paid', 'The caregiver directly (not the veteran)');
    labeledLine('Stipend basis', 'Federal GS-4 pay scale adjusted for location');
    labeledLine('Level 1 stipend', 'Approximately $1,000 – $1,800/month');
    labeledLine('Level 2 stipend', 'Approximately $2,000 – $3,500/month');
    labeledLine('Program type', 'Caregiver support benefit');
    labeledLine('How to apply', 'Contact your VA primary care team or VA social worker');
    y += 3;

    // ── Key Difference ──
    sectionHeader('THE CRITICAL DIFFERENCE', [13, 148, 136]);
    bodyText('Veterans generally cannot receive both VDC and PCAFC at the same time for the same caregiving needs — VA considers them overlapping programs.');
    bodyText('However:');
    bulletItem('VDC is often used when a veteran does not qualify for PCAFC');
    bulletItem('VDC may be used when additional in-home help is needed beyond what PCAFC covers');
    bulletItem('Both programs exist to help veterans remain safely at home instead of needing assisted living or nursing home care');
    y += 3;

    // ── How to Apply ──
    sectionHeader('NEXT STEPS', [22, 101, 52]);
    bodyText('If you think you may qualify for either program:');
    bulletItem('Talk to your VA primary care provider');
    bulletItem('Ask specifically for a VA social worker referral');
    bulletItem('Request information about both Veteran Directed Care AND the Caregiver Program');
    bulletItem('Visit va.gov/GERIATRICS/pages/Veteran-Directed_Care.asp for VDC details');
    bulletItem('Visit va.gov/family-member-benefits/comprehensive-assistance-for-family-caregivers/ for PCAFC');

    // ── Footer ──
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(
          `VA Caregiver Programs Guide — Page ${i} of ${pageCount} — Doc Bear's Symptom Vault — Educational purposes only`,
          pageWidth / 2,
          doc.internal.pageSize.height - 8,
          { align: 'center' }
      );
    }

    doc.save(`VA-Caregiver-Programs-Guide-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
      <div className="pb-20 space-y-4">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-500 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 text-white">
          <div className="text-center">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
              <span>❤️</span>
              VA Caregiver Programs
            </h2>
            <p className="text-teal-100 dark:text-gray-300 text-sm mt-1">
              VDC vs PCAFC — Understanding Your Options
            </p>
          </div>
        </div>

        {/* Export Button */}
        <button
            onClick={exportToPDF}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          📄 Export Guide to PDF
        </button>

        {/* Intro */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <p className="text-sm text-teal-800 dark:text-teal-300">
            Two separate VA programs help veterans stay safely in their homes.
            They serve different purposes, pay different people, and generally
            cannot be received simultaneously for the same caregiving needs.
          </p>
        </div>

        {/* Quick Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
            Quick Comparison
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold mb-2">
            <div className="text-gray-500 dark:text-gray-400"></div>
            <div className="text-blue-600 dark:text-blue-400">VDC</div>
            <div className="text-purple-600 dark:text-purple-400">PCAFC</div>
          </div>
          <CompareRow
              label="Who gets paid"
              vdc="Caregivers hired by veteran"
              pcafc="Family caregiver directly"
          />
          <CompareRow
              label="Monthly amount"
              vdc="~$2,000–$5,000+ budget"
              pcafc="~$1,000–$3,500 stipend"
          />
          <CompareRow
              label="Program type"
              vdc="VA health care benefit"
              pcafc="Caregiver support benefit"
          />
          <CompareRow
              label="Veteran directs?"
              vdc="Yes — veteran controls budget"
              pcafc="No — paid to caregiver"
          />
        </div>

        {/* VDC */}
        <GuideSection
            title="Veteran Directed Care (VDC)"
            icon="🏠"
            accentColor="blue"
            defaultOpen={true}
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            VDC is part of <strong>VA health care</strong>. If approved, the VA provides
            a monthly care budget that the veteran directs to hire caregivers and
            arrange in-home help.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Typical budget:</span>
              <span className="font-semibold text-blue-800 dark:text-blue-300">$2,000 – $5,000+/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Money goes to:</span>
              <span className="font-semibold text-blue-800 dark:text-blue-300">Care services (not veteran directly)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Can hire family?</span>
              <span className="font-semibold text-blue-800 dark:text-blue-300">Sometimes — varies by situation</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Budget varies based on the veteran's needs and location. The veteran
            directs how the funds are used for approved care services.
          </p>
        </GuideSection>

        {/* PCAFC */}
        <GuideSection
            title="Program of Comprehensive Assistance for Family Caregivers (PCAFC)"
            icon="👨‍👩‍👧"
            accentColor="purple"
            defaultOpen={true}
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            PCAFC provides a <strong>monthly stipend paid directly to the caregiver</strong> —
            usually a spouse or family member providing personal care because of the
            veteran's service-connected disabilities.
          </p>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stipend basis:</span>
              <span className="font-semibold text-purple-800 dark:text-purple-300">Federal GS-4 pay scale + location</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Level 1:</span>
              <span className="font-semibold text-purple-800 dark:text-purple-300">~$1,000 – $1,800/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Level 2:</span>
              <span className="font-semibold text-purple-800 dark:text-purple-300">~$2,000 – $3,500/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Paid to:</span>
              <span className="font-semibold text-purple-800 dark:text-purple-300">Caregiver — not the veteran</span>
            </div>
          </div>
        </GuideSection>

        {/* Critical Difference */}
        <GuideSection
            title="The Critical Difference — Can You Receive Both?"
            icon="⚖️"
            accentColor="amber"
            defaultOpen={true}
        >
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-3">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Generally — No.
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Veterans generally <strong>cannot receive both VDC and PCAFC</strong> at
              the same time for the same caregiving needs. VA considers them
              overlapping programs.
            </p>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            However, the programs serve different situations:
          </p>

          <div className="space-y-2 text-sm text-left">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 font-bold">→</span>
              <span className="text-gray-700 dark:text-gray-300">
              <strong>VDC</strong> is often used when a veteran does not qualify for PCAFC
            </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 font-bold">→</span>
              <span className="text-gray-700 dark:text-gray-300">
              <strong>VDC</strong> may supplement when additional in-home help is needed
            </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5 font-bold">✓</span>
              <span className="text-gray-700 dark:text-gray-300">
              Both programs exist to help veterans remain safely at home instead of
              needing assisted living or nursing home care
            </span>
            </div>
          </div>
        </GuideSection>

        {/* How to Apply */}
        <GuideSection
            title="How to Get Started"
            icon="📋"
            accentColor="teal"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If you think you or a family member may qualify:
          </p>

          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-left">
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-600 dark:text-teal-400 mt-0.5">1.</span>
              <span>Talk to your <strong>VA primary care provider</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-600 dark:text-teal-400 mt-0.5">2.</span>
              <span>Ask specifically for a <strong>VA social worker referral</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-600 dark:text-teal-400 mt-0.5">3.</span>
              <span>Request information about <strong>both programs</strong> — ask which one fits your situation</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p className="font-medium text-gray-700 dark:text-gray-300">Official VA Resources:</p>
            <p>• VDC: va.gov/GERIATRICS/pages/Veteran-Directed_Care.asp</p>
            <p>• PCAFC: va.gov/family-member-benefits/comprehensive-assistance-for-family-caregivers/</p>
          </div>
        </GuideSection>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">
          Stipend amounts and program details may change. This guide is for
          educational purposes only. Contact your VA social worker or primary
          care team for current eligibility requirements and benefit amounts
          specific to your situation.
        </p>

      </div>
  );
}