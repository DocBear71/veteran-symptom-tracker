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
  cp_exam: 'bg-red-100 text-red-800',        // High importance - C&P exams are critical
  primary_care: 'bg-blue-100 text-blue-800',
  mental_health: 'bg-purple-100 text-purple-800',
  specialty: 'bg-green-100 text-green-800',
  telehealth: 'bg-cyan-100 text-cyan-800',
  physical_therapy: 'bg-orange-100 text-orange-800',
  emergency: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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
      if (expandedId === apt.id) setExpandedId(null);
    }
  };

  // Toggle expanded view
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle edit save
  const handleEditSave = () => {
    loadAppointments();
  };

  if (appointments.length === 0) {
    return (
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg mb-2">No appointments logged yet</p>
          <p className="text-sm">Use the "Log New" tab to record your first appointment</p>
        </div>
    );
  }

  return (
      <div className="divide-y">
        {appointments.map((apt) => {
          const isExpanded = expandedId === apt.id;
          const typeLabel = TYPE_LABELS[apt.appointmentType] || apt.appointmentType;
          const typeColor = TYPE_COLORS[apt.appointmentType] || TYPE_COLORS.other;

          return (
              <div key={apt.id} className="p-4">
                {/* Header row - always visible */}
                <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleExpanded(apt.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
                    {typeLabel}
                  </span>
                      {apt.followUpNeeded && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Follow-up
                    </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(apt.appointmentDate)}
                      {apt.appointmentTime && ` at ${formatTime(apt.appointmentTime)}`}
                    </p>
                    {apt.providerName && (
                        <p className="text-sm text-gray-500">{apt.providerName}</p>
                    )}
                    {apt.facility && (
                        <p className="text-sm text-gray-500">{apt.facility}</p>
                    )}
                  </div>
                  <button
                      className="text-gray-400 text-xl ml-2"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                    <div className="mt-4 space-y-3 text-sm">
                      {apt.reasonForVisit && (
                          <div>
                            <span className="font-medium text-gray-700">Reason: </span>
                            <span className="text-gray-600">{apt.reasonForVisit}</span>
                          </div>
                      )}

                      <div>
                        <span className="font-medium text-gray-700">Discussed:</span>
                        <p className="text-gray-600 mt-1 whitespace-pre-wrap">{apt.discussed}</p>
                      </div>

                      {apt.documentsNotes && (
                          <div>
                            <span className="font-medium text-gray-700">Documents:</span>
                            <p className="text-gray-600 mt-1">{apt.documentsNotes}</p>
                          </div>
                      )}

                      {apt.followUpNeeded && (
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <span className="font-medium text-amber-800">Follow-up: </span>
                            {apt.followUpDate && (
                                <span className="text-amber-700">{formatDate(apt.followUpDate)}</span>
                            )}
                            {apt.followUpNotes && (
                                <p className="text-amber-700 mt-1">{apt.followUpNotes}</p>
                            )}
                          </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAppointment(apt);
                            }}
                            className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(apt);
                            }}
                            className="flex-1 py-2 px-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                )}
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