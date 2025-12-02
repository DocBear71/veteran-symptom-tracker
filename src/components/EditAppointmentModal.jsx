import { useState, useEffect } from 'react';
import { updateAppointment } from '../utils/storage';

const APPOINTMENT_TYPES = [
    { value: 'cp_exam', label: 'C&P Exam' },
    { value: 'primary_care', label: 'Primary Care' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'specialty', label: 'Specialty Care' },
    { value: 'telehealth', label: 'Telehealth' },
    { value: 'physical_therapy', label: 'Physical Therapy' },
    { value: 'emergency', label: 'Emergency/Urgent Care' },
    { value: 'other', label: 'Other' },
];

const EditAppointmentModal = ({ appointment, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        appointmentType: '',
        appointmentDate: '',
        appointmentTime: '',
        providerName: '',
        facility: '',
        reasonForVisit: '',
        discussed: '',
        documentsNotes: '',
        followUpNeeded: false,
        followUpDate: '',
        followUpNotes: '',
    });

    // Populate form with existing appointment data
    useEffect(() => {
        if (appointment) {
            setFormData({
                appointmentType: appointment.appointmentType || '',
                appointmentDate: appointment.appointmentDate || '',
                appointmentTime: appointment.appointmentTime || '',
                providerName: appointment.providerName || '',
                facility: appointment.facility || '',
                reasonForVisit: appointment.reasonForVisit || '',
                discussed: appointment.discussed || '',
                documentsNotes: appointment.documentsNotes || '',
                followUpNeeded: appointment.followUpNeeded || false,
                followUpDate: appointment.followUpDate || '',
                followUpNotes: appointment.followUpNotes || '',
            });
        }
    }, [appointment]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.appointmentType || !formData.appointmentDate || !formData.discussed.trim()) {
            alert('Please fill in required fields (Type, Date, What Was Discussed)');
            return;
        }

        const updated = updateAppointment(appointment.id, formData);
        if (updated) {
            onSave?.(updated);
            onClose();
        }
    };

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Appointment Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Appointment Type *
                        </label>
                        <select
                            value={formData.appointmentType}
                            onChange={(e) => handleChange('appointmentType', e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Select type...</option>
                            {APPOINTMENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                            <input
                                type="date"
                                value={formData.appointmentDate}
                                onChange={(e) => handleChange('appointmentDate', e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                            <input
                                type="time"
                                value={formData.appointmentTime}
                                onChange={(e) => handleChange('appointmentTime', e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Provider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider Name</label>
                        <input
                            type="text"
                            value={formData.providerName}
                            onChange={(e) => handleChange('providerName', e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Facility */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facility / Location</label>
                        <input
                            type="text"
                            value={formData.facility}
                            onChange={(e) => handleChange('facility', e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit</label>
                        <input
                            type="text"
                            value={formData.reasonForVisit}
                            onChange={(e) => handleChange('reasonForVisit', e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* What Was Discussed */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What Was Discussed *</label>
                        <textarea
                            value={formData.discussed}
                            onChange={(e) => handleChange('discussed', e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Documents */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Documents Brought / Received</label>
                        <textarea
                            value={formData.documentsNotes}
                            onChange={(e) => handleChange('documentsNotes', e.target.value)}
                            rows={2}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Follow-up */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.followUpNeeded}
                                onChange={(e) => handleChange('followUpNeeded', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up needed</span>
                        </label>

                        {formData.followUpNeeded && (
                            <div className="mt-3 space-y-3 pl-7">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Follow-up Date</label>
                                    <input
                                        type="date"
                                        value={formData.followUpDate}
                                        onChange={(e) => handleChange('followUpDate', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Follow-up Notes</label>
                                    <input
                                        type="text"
                                        value={formData.followUpNotes}
                                        onChange={(e) => handleChange('followUpNotes', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                {/* Action buttons - outside scrollable area */}
                <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-3 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAppointmentModal;