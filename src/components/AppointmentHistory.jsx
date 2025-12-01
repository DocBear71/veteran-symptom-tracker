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
  cp_exam: 'bg-red-100 text-red-800',
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

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const data = getAppointments();
    setAppointments(data);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

  const handleDelete = (apt) => {
    const typeLabel = TYPE_LABELS[apt.appointmentType] || apt.appointmentType;
    if (window.confirm(`Delete this ${typeLabel} appointment from ${formatDate(apt.appointmentDate)}?`)) {
      deleteAppointment(apt.id);
      loadAppointments();
    }
  };

  const handleEditSave = () => {
    loadAppointments();
  };

  if (appointments.length === 0) {
    return (
        <div className="p-8 text-center text-gray-500">
          <p className="text-4xl mb-2">📅</p>
          <p className="text-lg mb-2">No appointments logged yet</p>
          <p className="text-sm">Use the "Log New" tab to record your first appointment</p>
        </div>
    );
  }

  return (
      <div className="space-y-3 p-4">
        <p className="text-sm text-gray-500 mb-4">
          {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
        </p>

        {appointments.map((apt) => {
          const typeLabel = TYPE_LABELS[apt.appointmentType] || apt.appointmentType;
          const typeColor = TYPE_COLORS[apt.appointmentType] || TYPE_COLORS.other;

          return (
              <div key={apt.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Header with type badge */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
                    {typeLabel}
                  </span>
                      {apt.followUpNeeded && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Follow-up needed
                    </span>
                      )}
                      {apt.updatedAt && <span className="text-xs text-gray-400">(edited)</span>}
                    </div>

                    {/* Date/Time and Provider info */}
                    <p className="text-sm text-gray-600">
                      {formatDate(apt.appointmentDate)}
                      {apt.appointmentTime && ` at ${formatTime(apt.appointmentTime)}`}
                    </p>
                    {apt.providerName && (
                        <p className="text-sm text-gray-500">{apt.providerName}</p>
                    )}
                    {apt.facility && (
                        <p className="text-sm text-gray-500">{apt.facility}</p>
                    )}

                    {/* Reason for visit */}
                    {apt.reasonForVisit && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Reason: </span>
                          <span className="text-sm text-gray-600">{apt.reasonForVisit}</span>
                        </div>
                    )}

                    {/* What was discussed */}
                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Discussed:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{apt.discussed}</p>
                    </div>

                    {/* Documents */}
                    {apt.documentsNotes && (
                        <div className="mt-2 bg-blue-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-blue-800 mb-1">Documents:</p>
                          <p className="text-sm text-blue-700">{apt.documentsNotes}</p>
                        </div>
                    )}

                    {/* Follow-up details */}
                    {apt.followUpNeeded && (apt.followUpDate || apt.followUpNotes) && (
                        <div className="mt-2 bg-amber-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-amber-800 mb-1">Follow-up:</p>
                          {apt.followUpDate && (
                              <p className="text-sm text-amber-700">{formatDate(apt.followUpDate)}</p>
                          )}
                          {apt.followUpNotes && (
                              <p className="text-sm text-amber-700">{apt.followUpNotes}</p>
                          )}
                        </div>
                    )}
                  </div>

                  {/* Edit/Delete icons - matching symptom history style */}
                  <div className="flex flex-col gap-1 ml-2">
                    <button
                        onClick={() => setEditingAppointment(apt)}
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                        onClick={() => handleDelete(apt)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
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