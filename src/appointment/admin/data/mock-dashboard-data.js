import { adminSidebarItems, dashboardStats } from '../../shared/constants/appointment-data.js';

export const sidebarItems = adminSidebarItems;
export const statsCards = dashboardStats;

export const adminAppointments = [
  {
    id: 'APT-1001',
    clientName: 'Rahul Patil',
    email: 'rahul@example.com',
    phone: '9876543210',
    date: '2026-05-25',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'Pending',
    notes: 'Need guidance on annual tax planning and business compliance.',
  },
  {
    id: 'APT-1002',
    clientName: 'Sneha Kulkarni',
    email: 'sneha@example.com',
    phone: '9123456780',
    date: '2026-05-26',
    time: '11:00 AM',
    type: 'Audit Review',
    status: 'Approved',
    notes: 'Review of company audit readiness and documentation workflow.',
  },
  {
    id: 'APT-1003',
    clientName: 'Vikas Sharma',
    email: 'vikas@example.com',
    phone: '9988776655',
    date: '2026-05-27',
    time: '11:30 AM',
    type: 'Company Compliance',
    status: 'Rejected',
    notes: 'Requested slot overlaps with annual filing deadline block.',
  },
  {
    id: 'APT-1004',
    clientName: 'Neha Joshi',
    email: 'neha@example.com',
    phone: '9012345678',
    date: '2026-05-28',
    time: '10:30 AM',
    type: 'Secretarial Support',
    status: 'Pending',
    notes: 'Company secretarial support and board meeting documentation.',
  },
];

export const slotManagementDefaults = {
  workingHours: '09:30 - 18:30',
  interval: '30 minutes',
  blockedDates: ['2026-05-30', '2026-06-01'],
};

export const calendarLegend = ['Pending', 'Approved', 'Rejected'];
