// file: src/components/legal/Footer.jsx v2 - Doc Bear's Symptom Vault footer component
// Appears on all pages, provides access to legal pages and company info

import React, { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import AboutUs from './AboutUs';
import Contact from './Contact';
import Donations from './Donations';
import VATermsAndFAQ from '../VATermsAndFAQ';
import CPExamPrep from '../CPExamPrep';
import AfterActionReport from '../AfterActionReport';

/**
 * Footer Component
 *
 * Displays company info and legal links at the bottom of all pages.
 * Opens modal dialogs for legal content to keep users in the app.
 */
const Footer = () => {
  const [showModal, setShowModal] = useState(null);

  const openModal = (modalType) => {
    setShowModal(modalType);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  // Modal wrapper component for consistent styling
  const ModalWrapper = ({ children, title }) => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl">
          {/* Header - Fixed at top */}
          <div className="bg-blue-900 dark:bg-gray-800 text-white p-4 rounded-t-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl font-bold p-1 hover:bg-white hover:bg-opacity-20 rounded w-10 h-10 flex items-center justify-center"
                  aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
            {children}
          </div>

          {/* Footer with close button */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <button
                onClick={closeModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
  );

  return (
      <>
        {/* Footer */}
        <footer className="bg-blue-900 dark:bg-gray-800 text-white mt-8">
          <div className="max-w-lg mx-auto px-4 py-6">
            {/* Company Info */}
            <div className="text-center mb-4">
              <p className="text-blue-200 dark:text-gray-400 text-sm">
                © 2025 - {new Date().getFullYear()} Doc Bear Enterprises, LLC. All rights reserved.
              </p>
              <p className="text-blue-300 dark:text-gray-500 text-xs mt-1">
                🎖️ Built by a Veteran, for Veterans
              </p>
            </div>

            {/* Legal Links - First Row */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mb-3">
              <button
                  onClick={() => openModal('privacy')}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-blue-400 dark:text-gray-600">|</span>
              <button
                  onClick={() => openModal('terms')}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                Terms of Use
              </button>
              <span className="text-blue-400 dark:text-gray-600">|</span>
              <button
                  onClick={() => openModal('about')}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                About Us
              </button>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mb-3">
              <button
                  onClick={() => openModal('contact')}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                Contact Us
              </button>
              <span className="text-blue-400 dark:text-gray-600">|</span>
              <button
                  onClick={() => openModal('donations')}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                Support Us
              </button>
              <span className="text-blue-400 dark:text-gray-600">|</span>
              <button
                  onClick={() => openModal('va-terms')}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                VA Terms & FAQ
              </button>
            </div>

            {/* Third Row */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
              <a
                  href="https://www.docbear-ent.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
              >
                Doc Bear Enterprises
              </a>

            <span className="text-blue-400 dark:text-gray-600">|</span>

            <button
                onClick={() => openModal('cp-exam-prep')}
                className="text-blue-200 hover:text-white transition-colors"
            >
              C&P Exam Prep
            </button>
              <span className="text-blue-400 dark:text-gray-600">|</span>
              <button
                  onClick={() => openModal('after-action')}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                Exam Report
              </button>
            </div>

            {/* App Info */}
            <div className="mt-4 pt-4 border-t border-blue-800 dark:border-gray-700 text-center">
              <p className="text-blue-300 dark:text-gray-500 text-xs">
                Doc Bear's Symptom Vault v2.0 • Privacy-First Health Tracking
              </p>
              <p className="text-blue-400 dark:text-gray-600 text-xs mt-1">
                Your data stays on your device. Always.
              </p>
            </div>
          </div>
        </footer>

        {/* Modals */}
        {showModal === 'privacy' && (
            <ModalWrapper title="Privacy Policy">
              <PrivacyPolicy />
            </ModalWrapper>
        )}

        {showModal === 'terms' && (
            <ModalWrapper title="Terms of Use">
              <TermsOfUse />
            </ModalWrapper>
        )}

        {showModal === 'about' && (
            <ModalWrapper title="About Doc Bear's Symptom Vault">
              <AboutUs />
            </ModalWrapper>
        )}

        {showModal === 'contact' && (
            <ModalWrapper title="Contact Us">
              <Contact />
            </ModalWrapper>
        )}

        {showModal === 'donations' && (
            <ModalWrapper title="Support Our Mission">
              <Donations />
            </ModalWrapper>
        )}

        {showModal === 'va-terms' && (
            <ModalWrapper title="VA Terms, Definitions & FAQ">
              <VATermsAndFAQ embedded={true} />
            </ModalWrapper>
        )}
      </>
  );
};

export default Footer;