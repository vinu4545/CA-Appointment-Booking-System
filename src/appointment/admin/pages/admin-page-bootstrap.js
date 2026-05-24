import { initAdminDashboardApp } from '../components/admin-dashboard-app.js';
import { getAdminRouteKey, requireAdminRoute } from '../../shared/components/protected-admin-route.js';

export function initProtectedAdminPage({ activeSection } = {}) {
  if (!requireAdminRoute()) return;

  const root = document.querySelector('[data-admin-root]');
  if (!root) return;

  initAdminDashboardApp(root, {
    activeSection: activeSection || getAdminRouteKey(window.location.pathname),
  });
}