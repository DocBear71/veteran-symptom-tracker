import { useState } from 'react';
import { saveAppointment } from '../utils/storage';

// VA-relevant appointment types
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

const AppointmentForm = ({ onSave, onCancel }) => {
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

    const [errors, setErrors] = useState({});

    // Update form field
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Validate required fields
    const validate = () => {
        const newErrors = {};
        if (!formData.appointmentType) newErrors.appointmentType = 'Please select an appointment type';
        if (!formData.appointmentDate) newErrors.appointmentDate = 'Please enter the appointment date';
        if (!formData.discussed.trim()) newErrors.discussed = 'Please describe what was discussed';
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const appointment = saveAppointment(formData);
        if (appointment) {
            onSave?.(appointment);
            // Reset form
            setFormData({
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
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Log Appointment</h2>

            {/* Appointment Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Appointment Type *
                </label>
                <select
                    value={formData.appointmentType}
                    onChange={(e) => handleChange('appointmentType', e.target.value)}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.appointmentType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    aria-describedby={errors.appointmentType ? 'type-error' : undefined}
                >
                    <option value="">Select type...</option>
                    {APPOINTMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                {errors.appointmentType && (
                    <p id="type-error" className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.appointmentType}</p>
                )}
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date *
                    </label>
                    <input
                        type="date"
                        value={formData.appointmentDate}
                        onChange={(e) => handleChange('appointmentDate', e.target.value)}
                        className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            errors.appointmentDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                    />
                    {errors.appointmentDate && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.appointmentDate}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Time
                    </label>
                    <input
                        type="time"
                        value={formData.appointmentTime}
                        onChange={(e) => handleChange('appointmentTime', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Provider Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Provider Name
                </label>
                <input
                    type="text"
                    value={formData.providerName}
                    onChange={(e) => handleChange('providerName', e.target.value)}
                    placeholder="Dr. Smith"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* Facility */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Facility / Location
                </label>
                <input
                    type="text"
                    value={formData.facility}
                    onChange={(e) => handleChange('facility', e.target.value)}
                    placeholder="VA Medical Center, QTC, VES, etc."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* Reason for Visit */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason for Visit
                </label>
                <input
                    type="text"
                    value={formData.reasonForVisit}
                    onChange={(e) => handleChange('reasonForVisit', e.target.value)}
                    placeholder="Annual checkup, C&P for PTSD, etc."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* What Was Discussed - Main content area */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    What Was Discussed *
                </label>
                <textarea
                    value={formData.discussed}
                    onChange={(e) => handleChange('discussed', e.target.value)}
                    placeholder="Describe the conversation, symptoms discussed, examiner observations, tests performed, etc."
                    rows={4}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.discussed ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                />
                {errors.discussed && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.discussed}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Tip: Note specific phrases the examiner used, any range of motion measurements, and questions asked.
                </p>
            </div>

            {/* Documents / Notes Brought or Received */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Documents Brought / Received
                </label>
                <textarea
                    value={formData.documentsNotes}
                    onChange={(e) => handleChange('documentsNotes', e.target.value)}
                    placeholder="Buddy letters, medical records, imaging results, etc."
                    rows={2}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* Follow-up Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.followUpNeeded}
                        onChange={(e) => handleChange('followUpNeeded', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up needed</span>
                </label>

                {formData.followUpNeeded && (
                    <div className="mt-3 space-y-3 pl-7">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Follow-up Date
                            </label>
                            <input
                                type="date"
                                value={formData.followUpDate}
                                onChange={(e) => handleChange('followUpDate', e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Follow-up Notes
                            </label>
                            <input
                                type="text"
                                value={formData.followUpNotes}
                                onChange={(e) => handleChange('followUpNotes', e.target.value)}
                                placeholder="What needs to happen next"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700"
                >
                    Save Appointment
                </button>
            </div>
        </form>
    );
};

export default AppointmentForm;