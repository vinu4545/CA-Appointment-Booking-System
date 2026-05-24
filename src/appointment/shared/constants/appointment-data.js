export const appointmentTypes = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'audit-review', label: 'Audit Review' },
  { value: 'tax-planning', label: 'Tax Planning' },
  { value: 'company-compliance', label: 'Company Compliance' },
  { value: 'secretarial-support', label: 'Secretarial Support' },
];

export const appointmentProcessSteps = [
  {
    title: 'Pick a date',
    description: 'Choose a consultation date from the live calendar view.',
    icon: 'fa-calendar-check-o',
  },
  {
    title: 'Select a slot',
    description: 'Review available time windows and reserve the best fit.',
    icon: 'fa-clock-o',
  },
  {
    title: 'Confirm details',
    description: 'Share your contact details and brief notes for the CA team.',
    icon: 'fa-file-text-o',
  },
];

export const slotTimes = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'];

export const adminSidebarItems = [
  'Dashboard',
  'Appointments',
  'Slot Management',
  'Calendar',
  'Notifications',
  'Settings',
  'Logout',
];

export const dashboardStats = [
  { label: 'Total Appointments', value: 128, tone: 'primary' },
  { label: 'Pending Requests', value: 18, tone: 'warning' },
  { label: 'Approved', value: 92, tone: 'success' },
  { label: 'Rejected', value: 18, tone: 'danger' },
];

export const adminStatusLegend = ['Pending', 'Approved', 'Rejected'];
