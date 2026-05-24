export function formatAppointmentDate(dateValue) {
  if (!dateValue) return '';
  const parsedDate = new Date(dateValue);
  return parsedDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimeLabel(value) {
  return value || 'Select a slot';
}

export function validateAppointmentForm(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;

  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!phonePattern.test(values.phone.trim())) errors.phone = 'Enter a 10 digit phone number.';
  if (!values.appointmentType) errors.appointmentType = 'Choose an appointment type.';
  if (!values.preferredDate) errors.preferredDate = 'Select a preferred date.';
  if (!values.preferredTime) errors.preferredTime = 'Select an available time slot.';
  if (!values.message.trim()) errors.message = 'Add a short note for the CA team.';

  return errors;
}

export function buildCalendarRange(startDate, count) {
  const range = [];
  const base = new Date(startDate);
  for (let index = 0; index < count; index += 1) {
    const nextDate = new Date(base);
    nextDate.setDate(base.getDate() + index);
    range.push(nextDate);
  }
  return range;
}

export function toDateKey(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
