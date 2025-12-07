import { useState, useEffect } from 'react';
import {
  getProfiles,
  getActiveProfile,
  setActiveProfile,
  deleteProfile,
  getProfileIcon,
  getColorById,
  getProfileStats,
} from '../utils/profiles';
import AddProfileModal from './AddProfileModal';

/**
 * ProfileManagement Component
 *
 * Displays list of profiles with ability to:
 * - View active profile
 * - Switch profiles
 * - Add new profiles
 * - Delete profiles
 */
const ProfileManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfileState] = useState(null);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Load profiles
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const allProfiles = getProfiles();
    const active = getActiveProfile();
    setProfiles(allProfiles);
    setActiveProfileState(active);
  };

  const handleSwitchProfile = (profileId) => {
    const result = setActiveProfile(profileId);
    if (result.success) {
      setActiveProfileState(result.profile);
      // Reload page to refresh all data
      window.location.reload();
    }
  };

  const handleDeleteProfile = () => {
    if (!profileToDelete) return;

    // Check confirmation text
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      return;
    }

    const result = deleteProfile(profileToDelete.id);
    if (result.success) {
      setProfileToDelete(null);
      setDeleteConfirmText('');
      loadProfiles();
      // If we deleted the active profile, page will reload
      if (profileToDelete.id === activeProfile?.id) {
        window.location.reload();
      }
    }
  };

  const handleProfileCreated = (newProfile) => {
    loadProfiles();
    // Auto-switch to new profile
    handleSwitchProfile(newProfile.id);
  };

  if (!activeProfile) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <p className="text-gray-500 dark:text-gray-400">Loading profiles...</p>
        </div>
    );
  }

  const activeColor = getColorById(activeProfile.color);
  const activeStats = getProfileStats(activeProfile.id);

  return (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Profiles</h3>

          {/* Active Profile Card */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-300 mb-2 font-medium">ACTIVE PROFILE</p>
            <div className="flex items-start gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${activeColor.class}`}>
              {getProfileIcon(activeProfile.type)}
            </span>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-bold text-gray-900 dark:text-white">{activeProfile.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activeStats.logs} logs • {activeStats.medications} medications • {activeStats.appointments} appointments
                </p>
              </div>
            </div>
          </div>

          {/* All Profiles List */}
          <div className="space-y-3 mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">All Profiles ({profiles.length}/10)</p>

            {profiles.map((profile) => {
              const isActive = profile.id === activeProfile.id;
              const color = getColorById(profile.color);
              const stats = getProfileStats(profile.id);

              return (
                  <div
                      key={profile.id}
                      className={`p-4 rounded-lg border-2 ${
                          isActive
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${color.class}`}>
                    {getProfileIcon(profile.type)}
                  </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                          {isActive && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Active
                        </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
                          {stats.logs} logs • {stats.medications} medications • {stats.appointments} appointments
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-left">
                          Created {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>


                    {/* Actions */}
                    {!isActive && (
                        <div className="flex gap-2 mt-3">
                          <button
                              onClick={() => handleSwitchProfile(profile.id)}
                              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium"
                          >
                            Switch to This Profile
                          </button>
                          <button
                              onClick={() => setProfileToDelete(profile)}
                              className="px-3 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Delete
                          </button>
                        </div>
                    )}
                  </div>
              );
            })}
          </div>

          {/* Add Profile Button */}
          {profiles.length < 10 && (
              <button
                  onClick={() => setShowAddProfile(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg
                     text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400
                     font-medium transition-colors"
              >
                + Add New Profile
              </button>
          )}

          {profiles.length >= 10 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Maximum 10 profiles reached. Delete a profile to add a new one.
                </p>
              </div>
          )}
        </div>

        {/* Add Profile Modal */}
        {showAddProfile && (
            <AddProfileModal
                onClose={() => setShowAddProfile(false)}
                onProfileCreated={handleProfileCreated}
                quickMode={true}
            />
        )}

        {/* Delete Confirmation Modal */}
        {profileToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Profile?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This will permanently delete <strong>{profileToDelete.name}</strong> and all its data:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                  <li>• All symptom logs</li>
                  <li>• All medications</li>
                  <li>• All appointments</li>
                  <li>• All custom symptoms</li>
                </ul>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                    This action cannot be undone!
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Type "delete" to confirm:
                  </label>
                  <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="delete"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500"
                      autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                      onClick={() => {
                        setProfileToDelete(null);
                        setDeleteConfirmText('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleDeleteProfile}
                      disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                          deleteConfirmText.toLowerCase() === 'delete'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default ProfileManagement;