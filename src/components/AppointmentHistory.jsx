import { useState, useEffect } from 'react';
import { getAppointments, deleteAppointment } from '../utils/storage';
import EditAppointmentModal from './EditAppointmentModal';

// Map appointment type values to display labels
const TYPE_LABELS = {
    cp_exam: 'C&P Exam',
    primary_care: 'Primary Care',
    mental_health: 'Mental Health',
    specialty: 'Specialty Care',
    telehealth: 'Telehealth',
    physical_therapy: 'Physical Therapy',
    emergency: 'Emergency/Urgent Care',
    other: 'Other',
};

// Color coding for appointment types (VA claim relevance)
const TYPE_COLORS = {
    cp_exam: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    primary_care: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    mental_health: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
    specialty: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    telehealth: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300',
    physical_therapy: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300',
    emergency: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
    other: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
};

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);

    // Load appointments on mount
    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = () => {
        const data = getAppointments();
        setAppointments(data);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00'); // Prevent timezone issues
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Format time for display
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    // Handle delete with confirmation
    const handleDelete = (apt) => {
        const typeLabel = TYPE_LABELS[apt.appointmentType] || apt.appointmentType;
        if (window.confirm(`Delete this ${typeLabel} appointment from ${formatDate(apt.appointmentDate)}?`)) {
            deleteAppointment(apt.id);
            loadAppointments();
        }
    };

    // Handle edit save
    const handleEditSave = () => {
        loadAppointments();
    };

    if (appointments.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-4xl mb-2">📅</p>
                <p className="text-lg mb-2">No appointments logged yet</p>
                <p className="text-sm">Use the "Log New" tab to record your first appointment</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {appointments.map((apt) => {
                const typeLabel = TYPE_LABELS[apt.appointmentType] || apt.appointmentType;
                const typeColor = TYPE_COLORS[apt.appointmentType] || TYPE_COLORS.other;

                return (
                    <div key={apt.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        {/* Header row */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
                    {typeLabel}
                  </span>
                                    {apt.followUpNeeded && (
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                      Follow-up
                    </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(apt.appointmentDate)}
                                    {apt.appointmentTime && ` at ${formatTime(apt.appointmentTime)}`}
                                </p>
                                {apt.providerName && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{apt.providerName}</p>
                                )}
                                {apt.facility && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{apt.facility}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                                <button
                                    onClick={() => setEditingAppointment(apt)}
                                    className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                                    title="Edit"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(apt)}
                                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="mt-3 space-y-2 text-sm">
                            {apt.reasonForVisit && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Reason: </span>
                                    <span className="text-gray-600 dark:text-gray-400">{apt.reasonForVisit}</span>
                                </div>
                            )}

                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Discussed:</span>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-2 rounded">{apt.discussed}</p>
                            </div>

                            {apt.documentsNotes && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Documents:</span>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{apt.documentsNotes}</p>
                                </div>
                            )}

                            {apt.followUpNeeded && (
                                <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
                                    <span className="font-medium text-amber-800 dark:text-amber-300">Follow-up: </span>
                                    {apt.followUpDate && (
                                        <span className="text-amber-700 dark:text-amber-400">{formatDate(apt.followUpDate)}</span>
                                    )}
                                    {apt.followUpNotes && (
                                        <p className="text-amber-700 dark:text-amber-400 mt-1">{apt.followUpNotes}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Edit Modal */}
            {editingAppointment && (
                <EditAppointmentModal
                    appointment={editingAppointment}
                    onClose={() => setEditingAppointment(null)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
};

export default AppointmentHistory;