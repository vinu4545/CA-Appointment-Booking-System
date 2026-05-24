const STORE_KEY = 'ssar_appointment_requests';

function readStore() {
  try {
    const rawValue = window.localStorage.getItem(STORE_KEY);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch (error) {
    return [];
  }
}

function writeStore(records) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(records));
  } catch (error) {
    return records;
  }
  return records;
}

export async function listAppointments() {
  return readStore();
}

export async function createAppointmentRequest(payload) {
  const currentRecords = readStore();
  const nextRecord = {
    id: `appt-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    ...payload,
  };
  writeStore([nextRecord, ...currentRecords]);
  return nextRecord;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const updatedRecords = readStore().map((appointment) => {
    if (appointment.id !== appointmentId) return appointment;
    return { ...appointment, status };
  });
  writeStore(updatedRecords);
  return updatedRecords.find((appointment) => appointment.id === appointmentId) || null;
}

export async function fetchAvailableSlots() {
  return [
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
  ];
}
