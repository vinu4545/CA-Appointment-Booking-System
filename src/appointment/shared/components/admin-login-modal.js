function escapeHtml(value) {
  return `${value || ''}`
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildAdminLoginModalMarkup(state = {}) {
  const isOpen = Boolean(state.open);
  const isLoading = Boolean(state.loading);
  const isSuccess = Boolean(state.success);
  const errorMessage = state.errorMessage || '';

  return `
    <div class="appointment-modal admin-login-modal ${isOpen ? 'is-visible' : ''}" data-admin-login-modal aria-hidden="${isOpen ? 'false' : 'true'}">
      <div class="appointment-modal__backdrop" data-admin-login-close></div>
      <div class="appointment-modal__panel admin-login-modal__panel ${isSuccess ? 'is-success' : ''} ${state.shake ? 'is-shaking' : ''}">
        <button type="button" class="appointment-modal__close" data-admin-login-close aria-label="Close admin login">&times;</button>
        <div class="admin-login-modal__eyebrow">Secure Access</div>
        <h3>Admin Access</h3>
        <p class="admin-login-modal__subtitle">Authorized personnel only</p>

        <form class="admin-login-modal__form" data-admin-login-form novalidate>
          <div class="admin-login-modal__grid">
            <div class="floating-field">
              <input type="text" name="fullName" id="adminFullName" value="${escapeHtml(state.fullName)}" placeholder=" " autocomplete="name" data-admin-login-name>
              <label for="adminFullName">Full Name</label>
            </div>
            <div class="floating-field">
              <input type="password" name="password" id="adminPassword" value="${escapeHtml(state.password)}" placeholder=" " autocomplete="current-password" data-admin-login-password>
              <label for="adminPassword">Password</label>
            </div>
          </div>

          <div class="admin-login-modal__error ${errorMessage ? 'is-visible' : ''}" data-admin-login-error aria-live="polite">${escapeHtml(errorMessage)}</div>

          <button type="submit" class="theme-btn btn-style-one admin-login-modal__submit ${isLoading ? 'is-loading' : ''}" data-admin-login-submit ${isLoading ? 'disabled' : ''}>
            ${isLoading ? '<span class="admin-login-modal__spinner" aria-hidden="true"></span> Verifying...' : isSuccess ? 'Access granted' : 'Submit'}
          </button>

          <p class="admin-login-modal__note">This frontend-only gate is ready for JWT-based backend authentication later.</p>
        </form>
      </div>
    </div>
  `;
}