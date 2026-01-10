/**
 * QuickActionsMenu.jsx
 *
 * Floating Action Button (FAB) component that provides quick access to
 * common logging tasks from any screen in the application.
 *
 * Features:
 * - Expandable menu with smooth animations
 * - Quick symptom logging from chronic symptoms
 * - One-tap medication logging
 * - Quick appointment creation
 * - Recent symptoms shortcut
 * - Accessibility support (screen readers, keyboard navigation)
 * - Respects reduced motion preferences
 *
 * V2.5 User Experience Improvements
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  X,
  Activity,
  Pill,
  Calendar,
  Clock,
  Zap,
  CheckCircle
} from 'lucide-react';
import {
  getChronicSymptoms,
  saveSymptomLog,
  getMedications,
  logMedicationTaken,
  getSymptomLogs
} from '../utils/storage';
import { useProfile } from '../hooks/useProfile';
import { stripDCCode } from '../data/symptoms';

// ============================================
// SEVERITY COLOR HELPER
// ============================================
const getSeverityColor = (severity) => {
  if (severity <= 3) return 'bg-green-500';
  if (severity <= 5) return 'bg-yellow-500';
  if (severity <= 7) return 'bg-orange-500';
  return 'bg-red-500';
};

// ============================================
// MAIN COMPONENT
// ============================================
const QuickActionsMenu = ({
                            onNavigate,
                            currentView,
                            onLogSaved,
                            // Views where FAB should be hidden (it's redundant on Log view)
                            hiddenViews = ['log']
                          }) => {
  // ==========================================
  // STATE
  // ==========================================
  const [isOpen, setIsOpen] = useState(false);
  const [chronicSymptoms, setChronicSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showMedLog, setShowMedLog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [logSeverity, setLogSeverity] = useState(5);
  const [showSuccess, setShowSuccess] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { isVeteran } = useProfile();
  const menuRef = useRef(null);
  const fabRef = useRef(null);

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    loadData();

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const loadData = useCallback(() => {
    // Load chronic symptoms (favorites)
    const chronic = getChronicSymptoms();
    setChronicSymptoms(chronic.slice(0, 5)); // Limit to 5 for quick menu

    // Load active medications
    const meds = getMedications().filter(m => m.active !== false);
    setMedications(meds.slice(0, 5)); // Limit to 5 for quick menu

    // Load recent symptoms (last 5 unique)
    const logs = getSymptomLogs();
    const uniqueSymptoms = [];
    const seen = new Set();

    for (const log of logs.slice().reverse()) {
      if (!seen.has(log.symptomId) && uniqueSymptoms.length < 5) {
        seen.add(log.symptomId);
        uniqueSymptoms.push({
          symptomId: log.symptomId,
          symptomName: log.symptomName,
          category: log.category,
          lastSeverity: log.severity
        });
      }
    }
    setRecentSymptoms(uniqueSymptoms);
  }, []);

  // Reload data when menu opens
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  // ==========================================
  // CLICK OUTSIDE HANDLER
  // ==========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          menuRef.current &&
          !menuRef.current.contains(event.target) &&
          fabRef.current &&
          !fabRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // ==========================================
  // KEYBOARD NAVIGATION
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowQuickLog(false);
        setShowMedLog(false);
        fabRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ==========================================
  // QUICK LOG SYMPTOM
  // ==========================================
  const handleQuickSymptomLog = async (symptom) => {
    const logEntry = {
      id: Date.now().toString(),
      symptomId: symptom.symptomId,
      symptomName: symptom.symptomName,
      category: symptom.category,
      severity: symptom.defaultSeverity || logSeverity,
      notes: 'Quick logged',
      occurredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      saveSymptomLog(logEntry);
      setShowSuccess(symptom.symptomId);

      // Notify parent
      if (onLogSaved) {
        onLogSaved();
      }

      // Clear success after animation
      setTimeout(() => {
        setShowSuccess(null);
        setShowQuickLog(false);
        setIsOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving quick log:', error);
    }
  };

  // ==========================================
  // QUICK LOG MEDICATION
  // ==========================================
  const handleQuickMedLog = async (medication) => {
    try {
      logMedicationTaken(medication.id);
      setShowSuccess(medication.id);

      if (onLogSaved) {
        onLogSaved();
      }

      setTimeout(() => {
        setShowSuccess(null);
        setShowMedLog(false);
        setIsOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Error logging medication:', error);
    }
  };

  // ==========================================
  // NAVIGATION ACTIONS
  // ==========================================
  const handleNavigateToLog = () => {
    setIsOpen(false);
    onNavigate('log');
  };

  const handleNavigateToMeds = () => {
    setIsOpen(false);
    onNavigate('meds');
  };

  const handleNavigateToHistory = () => {
    setIsOpen(false);
    onNavigate('history');
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  // Don't render on hidden views
  if (hiddenViews.includes(currentView)) {
    return null;
  }

  const animationClass = prefersReducedMotion
      ? ''
      : 'transition-all duration-200 ease-out';

  return (
      <>
        {/* Backdrop when menu is open */}
        {isOpen && (
            <div
                className={`fixed inset-0 bg-black/20 dark:bg-black/40 z-40 ${animationClass}`}
                aria-hidden="true"
            />
        )}

        {/* Main FAB Container */}
        <div className="fixed bottom-20 right-4 z-50" ref={menuRef}>

          {/* Expanded Menu */}
          {isOpen && !showQuickLog && !showMedLog && (
              <div
                  className={`absolute bottom-16 right-0 mb-2 ${animationClass}`}
                  role="menu"
                  aria-label="Quick actions menu"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[200px]">
                  {/* Menu Header */}
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Quick Actions
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {/* Quick Symptom Log */}
                    {chronicSymptoms.length > 0 && (
                        <button
                            onClick={() => setShowQuickLog(true)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            role="menuitem"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Quick Log Symptom
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {chronicSymptoms.length} chronic symptom{chronicSymptoms.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </button>
                    )}

                    {/* Quick Medication Log */}
                    {medications.length > 0 && (
                        <button
                            onClick={() => setShowMedLog(true)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            role="menuitem"
                        >
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Pill className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Log Medication
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {medications.length} active med{medications.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </button>
                    )}

                    {/* New Symptom Entry */}
                    <button
                        onClick={handleNavigateToLog}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New Symptom Entry
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Full logging form
                        </p>
                      </div>
                    </button>

                    {/* Recent Symptoms */}
                    {recentSymptoms.length > 0 && (
                        <button
                            onClick={handleNavigateToHistory}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            role="menuitem"
                        >
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Recent History
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              View recent logs
                            </p>
                          </div>
                        </button>
                    )}

                    {/* Empty State */}
                    {chronicSymptoms.length === 0 && medications.length === 0 && (
                        <div className="px-4 py-3 text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add chronic symptoms or medications to enable quick logging
                          </p>
                          <button
                              onClick={handleNavigateToLog}
                              className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium"
                          >
                            Go to Log →
                          </button>
                        </div>
                    )}
                  </div>
                </div>
              </div>
          )}

          {/* Quick Symptom Selection */}
          {showQuickLog && (
              <div
                  className={`absolute bottom-16 right-0 mb-2 ${animationClass}`}
                  role="menu"
                  aria-label="Select symptom to log"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[240px] max-w-[300px]">
                  {/* Header */}
                  <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      Quick Log Symptom
                    </p>
                    <button
                        onClick={() => setShowQuickLog(false)}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                        aria-label="Back to menu"
                    >
                      <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>

                  {/* Symptom List */}
                  <div className="py-1 max-h-[300px] overflow-y-auto">
                    {chronicSymptoms.map((symptom) => (
                        <button
                            key={symptom.symptomId}
                            onClick={() => handleQuickSymptomLog(symptom)}
                            disabled={showSuccess === symptom.symptomId}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            role="menuitem"
                        >
                          {showSuccess === symptom.symptomId ? (
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                          ) : (
                              <div
                                  className={`w-8 h-8 rounded-full ${getSeverityColor(symptom.defaultSeverity || 5)} flex items-center justify-center`}
                              >
                        <span className="text-white text-sm font-bold">
                          {symptom.defaultSeverity || 5}
                        </span>
                              </div>
                          )}
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {symptom.symptomName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {stripDCCode(symptom.category)}
                            </p>
                          </div>
                          {showSuccess === symptom.symptomId && (
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Logged!
                      </span>
                          )}
                        </button>
                    ))}
                  </div>

                  {/* Add More Link */}
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                        onClick={handleNavigateToLog}
                        className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      + Add more chronic symptoms
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Quick Medication Selection */}
          {showMedLog && (
              <div
                  className={`absolute bottom-16 right-0 mb-2 ${animationClass}`}
                  role="menu"
                  aria-label="Select medication to log"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[240px] max-w-[300px]">
                  {/* Header */}
                  <div className="px-4 py-2 bg-green-50 dark:bg-green-900/30 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      Log Medication Taken
                    </p>
                    <button
                        onClick={() => setShowMedLog(false)}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                        aria-label="Back to menu"
                    >
                      <X className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </button>
                  </div>

                  {/* Medication List */}
                  <div className="py-1 max-h-[300px] overflow-y-auto">
                    {medications.map((med) => (
                        <button
                            key={med.id}
                            onClick={() => handleQuickMedLog(med)}
                            disabled={showSuccess === med.id}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            role="menuitem"
                        >
                          {showSuccess === med.id ? (
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                          ) : (
                              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <Pill className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                          )}
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {med.name}
                            </p>
                            {med.dosage && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {med.dosage}
                                </p>
                            )}
                          </div>
                          {showSuccess === med.id && (
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Logged!
                      </span>
                          )}
                        </button>
                    ))}
                  </div>

                  {/* Add More Link */}
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                        onClick={handleNavigateToMeds}
                        className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline"
                    >
                      + Manage medications
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Main FAB Button */}
          <button
              ref={fabRef}
              onClick={() => {
                setIsOpen(!isOpen);
                setShowQuickLog(false);
                setShowMedLog(false);
              }}
              className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${animationClass} ${
                  isOpen
                      ? 'bg-gray-600 dark:bg-gray-500 rotate-45'
                      : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              aria-label={isOpen ? 'Close quick actions menu' : 'Open quick actions menu'}
          >
            {isOpen ? (
                <X className="w-6 h-6 text-white" />
            ) : (
                <Plus className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </>
  );
};

export default QuickActionsMenu;