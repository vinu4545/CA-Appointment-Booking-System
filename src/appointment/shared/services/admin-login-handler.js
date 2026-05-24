import { ADMIN_ROUTES, signInAdmin } from './auth.js';
import { hideModal, showModal } from '../components/modal.js';

const AUTO_OPEN_HASH = '#admin-login';

export function createAdminLoginState({ open = false } = {}) {
  return {
    open,
    fullName: '',
    password: '',
    loading: false,
    errorMessage: '',
    success: false,
    shake: false,
    focusRequested: open,
  };
}

export function shouldAutoOpenAdminLogin() {
  if (typeof window === 'undefined') return false;
  const queryValue = new URLSearchParams(window.location.search).get('admin-login');
  return window.location.hash === AUTO_OPEN_HASH || queryValue === '1';
}

export function openAdminLoginModal(state) {
  state.open = true;
  state.loading = false;
  state.success = false;
  state.errorMessage = ''; 
  state.shake = false;
  state.focusRequested = true;
}

export function closeAdminLoginModal(state) {
  state.open = false;
  state.loading = false;
  state.success = false;
  state.errorMessage = '';
  state.shake = false;
  state.focusRequested = false;
}

function clearAdminLoginMarkerFromUrl() {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = '';
  nextUrl.searchParams.delete('admin-login');
  window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}

function focusLoginField(container) {
  window.requestAnimationFrame(() => {
    container.querySelector('[data-admin-login-name]')?.focus();
  });
}

export function syncAdminLoginModal(container, state) {
  const modal = container.querySelector('[data-admin-login-modal]');
  if (!modal) return;

  if (state.open) {
    showModal(modal);
    modal.setAttribute('aria-hidden', 'false');
    clearAdminLoginMarkerFromUrl();
    if (state.focusRequested) {
      state.focusRequested = false;
      focusLoginField(container);
    }
  } else {
    hideModal(modal);
    modal.setAttribute('aria-hidden', 'true');
  }
}

export function bindAdminLoginInteractions(container, state, rerender, { redirectTo = ADMIN_ROUTES.appointments } = {}) {
  if (!container || container.dataset.adminLoginBound === 'true') return;
  container.dataset.adminLoginBound = 'true';

  container.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-admin-login-open]');
    const closeButton = event.target.closest('[data-admin-login-close]');

    if (openButton) {
      event.preventDefault();
      openAdminLoginModal(state);
      rerender();
      return;
    }

    if (closeButton) {
      closeAdminLoginModal(state);
      rerender();
    }
  });

  container.addEventListener('input', (event) => {
    const target = event.target;
    if (target.matches('[data-admin-login-name]')) {
      state.fullName = target.value;
    }
    if (target.matches('[data-admin-login-password]')) {
      state.password = target.value;
    }
  });

  container.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-admin-login-form]');
    if (!form) return;
    event.preventDefault();

    state.loading = true;
    state.errorMessage = '';
    state.success = false;
    state.shake = false;
    rerender();

    await new Promise((resolve) => window.setTimeout(resolve, 700));

    const result = await signInAdmin({ fullName: state.fullName, password: state.password });

    if (result.authenticated) {
      state.loading = false;
      state.success = true;
      rerender();
      window.setTimeout(() => {
        window.location.assign(redirectTo);
      }, 550);
      return;
    }

    state.loading = false;
    state.errorMessage = 'Invalid Password';
    state.shake = true;
    rerender();

    window.setTimeout(() => {
      state.shake = false;
      rerender();
    }, 420);
  });
}