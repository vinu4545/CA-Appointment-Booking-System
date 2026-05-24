import { appointmentProcessSteps, appointmentTypes, slotTimes } from '../../shared/constants/appointment-data.js';

export const bookingProcess = appointmentProcessSteps;
export const bookingTypes = appointmentTypes;
export const bookingSlots = slotTimes;

export const bookingCalendar = [
  { date: '2026-05-25', label: 'Mon', available: true },
  { date: '2026-05-26', label: 'Tue', available: true },
  { date: '2026-05-27', label: 'Wed', available: true },
  { date: '2026-05-28', label: 'Thu', available: true },
  { date: '2026-05-29', label: 'Fri', available: true },
  { date: '2026-05-30', label: 'Sat', available: false },
  { date: '2026-05-31', label: 'Sun', available: false },
];

export const bookingSlotMatrix = {
  '2026-05-25': ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  '2026-05-26': ['10:00 AM', '11:00 AM', '11:30 AM'],
  '2026-05-27': ['10:30 AM', '11:00 AM', '12:00 PM'],
  '2026-05-28': ['10:00 AM', '10:30 AM', '11:30 AM'],
  '2026-05-29': ['10:00 AM', '11:00 AM', '11:30 AM'],
  '2026-05-30': [],
  '2026-05-31': [],
};
