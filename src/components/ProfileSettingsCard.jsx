import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { updateProfile } from '../utils/profiles';

/**
 * ProfileSettingsCard
 *
 * Lets the user edit two profile fields in Settings:
 *
 *   1. profile.name          — display name shown in the profile switcher
 *   2. profile.metadata.patientName — legal / export name used in PDF exports
 *
 * Lives in the same Settings area as TDIUStatusCard and TDIUEligibilityCard.
 * Uses the same updateProfile() path that already handles duplicate-name
 * checking and fires the profileUpdated event so useProfile refreshes.
 *
 * patientName falls back to profile.name in exports when blank, so leaving
 * it empty is valid — the user only needs to fill it when their display name
 * differs from their legal name.
 */
const ProfileSettingsCard = () => {
  const { profile, refreshProfile } = useProfile();

  const [displayName, setDisplayName]   = useState('');
  const [legalName, setLegalName]       = useState('');
  const [saveStatus, setSaveStatus]     = useState('idle'); // idle | saving | saved | error
  const [errorMsg, setErrorMsg]         = useState('');
  const [isDirty, setIsDirty]           = useState(false);

  // Populate fields from profile on mount / profile change
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.name || '');
    setLegalName(profile.metadata?.patientName || '');
    setIsDirty(false);
    setSaveStatus('idle');
  }, [profile?.id]);

  if (!profile) return null;

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
    setIsDirty(true);
    setSaveStatus('idle');
    setErrorMsg('');
  };

  const handleLegalNameChange = (e) => {
    setLegalName(e.target.value);
    setIsDirty(true);
    setSaveStatus('idle');
    setErrorMsg('');
  };

  const handleSave = () => {
    const trimmedDisplay = displayName.trim();
    const trimmedLegal   = legalName.trim();

    if (!trimmedDisplay) {
      setErrorMsg('Display name cannot be empty.');
      return;
    }

    setSaveStatus('saving');
    setErrorMsg('');

    const result = updateProfile(profile.id, {
      name: trimmedDisplay,
      metadata: {
        // Preserve any existing metadata fields — only update patientName
        ...(profile.metadata || {}),
        patientName: trimmedLegal,
      },
    });

    if (result.success) {
      setSaveStatus('saved');
      setIsDirty(false);
      refreshProfile();
      // Auto-clear the "Saved" confirmation after 3 s
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
      setErrorMsg(result.message || 'Failed to save. Please try again.');
    }
  };

  const handleReset = () => {
    setDisplayName(profile.name || '');
    setLegalName(profile.metadata?.patientName || '');
    setIsDirty(false);
    setSaveStatus('idle');
    setErrorMsg('');
  };

  const inputCls =
      'w-full px-3 py-2 text-sm border rounded-lg ' +
      'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ' +
      'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ' +
      'transition-colors';

  const inputBorder = errorMsg && !displayName.trim()
      ? 'border-red-400 dark:border-red-500'
      : 'border-gray-300 dark:border-gray-600';

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">

        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base">
            Profile Settings
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Display name appears in the profile switcher. Legal name is used in PDF exports.
          </p>
        </div>

        <div className="p-5 space-y-5">

          {/* Display name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Display Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Shown in the profile switcher and app header. Must be unique.
            </p>
            <input
                type="text"
                value={displayName}
                onChange={handleDisplayNameChange}
                maxLength={50}
                placeholder="e.g. My Health, John's Profile"
                className={`${inputCls} ${inputBorder}`}
            />
          </div>

          {/* Legal / export name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Legal Name for Exports
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-2">
              (optional)
            </span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Used in PDF exports — claim package, 21-8940 worksheet, etc. Leave blank
              to use the display name. Enter your legal name as it appears on VA records.
            </p>
            <input
                type="text"
                value={legalName}
                onChange={handleLegalNameChange}
                maxLength={100}
                placeholder="e.g. John A. Smith"
                className={`${inputCls} border-gray-300 dark:border-gray-600`}
            />
          </div>

          {/* Error message */}
          {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                {errorMsg}
              </p>
          )}

          {/* Preview row */}
          {(displayName.trim() || legalName.trim()) && (
              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-3 space-y-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Preview
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span>
                <span className="text-gray-500 dark:text-gray-400">Switcher: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {displayName.trim() || '—'}
                </span>
              </span>
                  <span>
                <span className="text-gray-500 dark:text-gray-400">Exports: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {legalName.trim() || displayName.trim() || '—'}
                </span>
              </span>
                </div>
              </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between pt-1">
            {/* Save status indicator */}
            <div className="text-xs">
              {saveStatus === 'saved' && (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                Changes saved
              </span>
              )}
              {saveStatus === 'saving' && (
                  <span className="text-gray-400">Saving...</span>
              )}
              {saveStatus === 'error' && (
                  <span className="text-red-500">Save failed</span>
              )}
            </div>

            <div className="flex gap-2">
              {isDirty && (
                  <button
                      onClick={handleReset}
                      className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Discard
                  </button>
              )}
              <button
                  onClick={handleSave}
                  disabled={!isDirty || saveStatus === 'saving'}
                  className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                      !isDirty || saveStatus === 'saving'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                Save Changes
              </button>
            </div>
          </div>

        </div>
      </div>
  );
};

export default ProfileSettingsCard;