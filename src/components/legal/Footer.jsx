// file: src/components/legal/Footer.jsx v2 - Doc Bear's Symptom Vault footer component
// Appears on all pages, provides access to legal pages and company info

import React, { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import AboutUs from './AboutUs';
import Contact from './Contact';
import Donations from './Donations';
import VATermsAndFAQ from '../VATermsAndFAQ';

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
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700
                    text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <img
                    src="../../../public/icon-512.png"
                    alt="Doc Bear"
                    className="w-8 h-8 rounded-lg"
                />
                <span className="font-semibold text-gray-900 dark:text-white">
          Doc Bear's Symptom Vault
        </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version 3.0.0
              </p>
              <div className="flex flex-col items-center gap-2 text-xs
        text-gray-500 dark:text-gray-500">
                <span>📊 158,000+ lines of code</span>
                <span>🏥 240+ diagnostic codes</span>
                <span>📈 960+ symptoms</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Built with ❤️ by a Marine Corps veteran
              </p>
            </div>
            <div className="text-center mb-4">
              <p className="text-blue-200 dark:text-gray-400 text-sm">
                © 2023 - {new Date().getFullYear()} Doc Bear Enterprises, LLC. <br/>All rights reserved.
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

            </div>

            {/* App Info */}
            <div className="mt-4 pt-4 border-t border-blue-800 dark:border-gray-700 text-center">
              <p className="text-blue-300 dark:text-gray-500 text-xs">
                Doc Bear's Symptom Vault v3.0.0 <br/> Privacy-First Health Tracking
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