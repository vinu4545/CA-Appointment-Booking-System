import { ADMIN_ROUTES, isAdminLoggedIn } from '../services/auth.js';

export function getAdminRouteKey(pathname = '') {
  const normalizedPath = pathname.replace(/\/+$/, '');

  if (normalizedPath.endsWith('/admin/calendar')) return 'Calendar';
  if (normalizedPath.endsWith('/admin/dashboard')) return 'Dashboard';
  return 'Appointments';
}

export function requireAdminRoute({ redirectTo = ADMIN_ROUTES.booking } = {}) {
  if (isAdminLoggedIn()) return true;

  if (typeof window !== 'undefined') {
    window.location.replace(`${redirectTo}#admin-login`);
  }

  return false;
}