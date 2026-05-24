export const ADMIN_AUTH_STORAGE_KEY = 'ssar_admin_logged_in';

export const ADMIN_LOGIN_CREDENTIALS = {
  fullName: 'vinay gaddam',
  password: 'vinay1131',
};

export const ADMIN_ROUTES = {
  booking: '/book-appointment.html',
  dashboard: '/admin/dashboard/',
  appointments: '/admin/appointments.html',
  calendar: '/admin/calendar/',
};

function getStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

export function isAdminLoggedIn() {
  const storage = getStorage();
  return storage?.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true';
}

export function setAdminLoggedIn(isLoggedIn) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(ADMIN_AUTH_STORAGE_KEY, isLoggedIn ? 'true' : 'false');
}

export function clearAdminSession() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}

export async function signInAdmin({ fullName, password } = {}) {
  const normalizedName = `${fullName || ''}`.trim().toLowerCase();
  const normalizedPassword = `${password || ''}`.trim();

  if (
    normalizedName === ADMIN_LOGIN_CREDENTIALS.fullName &&
    normalizedPassword === ADMIN_LOGIN_CREDENTIALS.password
  ) {
    setAdminLoggedIn(true);
    return {
      authenticated: true,
      message: 'Admin session created.',
    };
  }

  return {
    authenticated: false,
    message: 'Invalid Password',
  };
}

export async function signOutAdmin() {
  clearAdminSession();
  return {
    authenticated: false,
    message: 'Admin session cleared.',
  };
}
