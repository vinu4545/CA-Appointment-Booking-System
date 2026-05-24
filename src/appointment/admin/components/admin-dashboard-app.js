import { buildModalMarkup, hideModal, showModal } from '../../shared/components/modal.js';
import { adminAppointments, calendarLegend, sidebarItems, slotManagementDefaults, statsCards } from '../data/mock-dashboard-data.js';
import { updateAppointmentStatus } from '../../shared/services/appointment-api.js';

function getInitialState() {
  return {
    searchTerm: '',
    activeSection: 'Dashboard',
    selectedAppointment: adminAppointments[0] || null,
    appointments: [...adminAppointments],
    blockedDates: [...slotManagementDefaults.blockedDates],
    workingHours: slotManagementDefaults.workingHours,
    interval: slotManagementDefaults.interval,
  };
}

function formatDateLabel(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function getStatusClass(status) {
  return `status-badge status-badge--${status.toLowerCase()}`;
}

function renderStats() {
  return statsCards
    .map(
      (card) => `
        <div class="admin-stat-card reveal" data-counter-card>
          <span class="admin-stat-card__label">${card.label}</span>
          <strong class="admin-stat-card__value" data-counter-value="${card.value}">0</strong>
          <span class="admin-stat-card__tone tone-${card.tone}"></span>
        </div>
      `,
    )
    .join('');
}

function renderSidebar(activeSection) {
  return sidebarItems
    .map(
      (item) => `
        <button type="button" class="sidebar-link ${activeSection === item ? 'is-active' : ''}" data-nav-item="${item}">${item}</button>
      `,
    )
    .join('');
}

function renderAppointmentsTable(state) {
  const filteredAppointments = state.appointments.filter((appointment) => {
    const searchValue = state.searchTerm.toLowerCase();
    return [appointment.clientName, appointment.type, appointment.status, appointment.date, appointment.time]
      .join(' ')
      .toLowerCase()
      .includes(searchValue);
  });

  return filteredAppointments
    .map(
      (appointment) => `
        <tr>
          <td>
            <div class="client-cell">
              <strong>${appointment.clientName}</strong>
              <span>${appointment.email}</span>
            </div>
          </td>
          <td>${formatDateLabel(appointment.date)}</td>
          <td>${appointment.time}</td>
          <td>${appointment.type}</td>
          <td><span class="${getStatusClass(appointment.status)}">${appointment.status}</span></td>
          <td>
            <div class="action-group">
              <button type="button" class="mini-btn mini-btn--success" data-accept="${appointment.id}">Accept</button>
              <button type="button" class="mini-btn mini-btn--danger" data-reject="${appointment.id}">Reject</button>
              <button type="button" class="mini-btn mini-btn--ghost" data-view="${appointment.id}">View Details</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join('');
}

function renderBlockedDates(blockedDates) {
  return blockedDates
    .map(
      (date) => `
        <li>
          <span>${date}</span>
          <button type="button" class="text-link" data-remove-block="${date}">Remove</button>
        </li>
      `,
    )
    .join('');
}

function renderCalendarGrid() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = [];
  const base = new Date('2026-05-01T00:00:00');
  for (let index = 0; index < 30; index += 1) {
    const next = new Date(base);
    next.setDate(base.getDate() + index);
    dates.push(next);
  }

  return `
    <div class="month-grid month-grid--labels">
      ${days.map((day) => `<span>${day}</span>`).join('')}
    </div>
    <div class="month-grid">
      ${dates
        .map((date) => {
          const label = date.getDate();
          const hasMeeting = adminAppointments.some((appointment) => appointment.date === date.toISOString().slice(0, 10));
          return `<button type="button" class="month-day ${hasMeeting ? 'has-meeting' : ''}"><span>${label}</span></button>`;
        })
        .join('')}
    </div>
  `;
}

function renderAdminMarkup(state) {
  return `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <img src="../images/sticky-logo.png" alt="SSAR & Co Chartered Accountant">
          <div>
            <strong>SSAR & Co</strong>
            <span>Appointment Admin</span>
          </div>
        </div>
        <nav class="admin-menu">${renderSidebar(state.activeSection)}</nav>
        <div class="admin-sidebar__meta">
          <span class="sub-title">Mock authentication</span>
          <p>Frontend-only admin surface prepared for future role-based access control.</p>
        </div>
      </aside>

      <section class="admin-main">
        <header class="admin-topbar reveal">
          <div class="admin-search">
            <i class="fa fa-search"></i>
            <input type="search" data-search-input placeholder="Search appointments, status, or date" value="${state.searchTerm}">
          </div>
          <div class="admin-topbar__actions">
            <button type="button" class="icon-chip"><i class="fa fa-bell-o"></i></button>
            <div class="admin-profile">
              <span>RU</span>
              <div>
                <strong>Rushikesh</strong>
                <small>Admin</small>
              </div>
            </div>
          </div>
        </header>

        <div class="admin-section admin-hero reveal">
          <div>
            <span class="sub-title">Dashboard overview</span>
            <h1>Appointment Management</h1>
            <p>Track consultation requests, manage slots, and inspect client details from one premium dashboard shell.</p>
          </div>
          <div class="admin-hero__pill">
            <i class="fa fa-lock"></i>
            <span>Mock auth enabled</span>
          </div>
        </div>

        <section class="admin-section stats-grid">${renderStats()}</section>

        <section class="admin-section admin-card reveal">
          <div class="section-head">
            <div>
              <span class="sub-title">Appointments</span>
              <h3>Incoming requests</h3>
            </div>
            <div class="legend-row">
              ${calendarLegend.map((label) => `<span class="legend-pill">${label}</span>`).join('')}
            </div>
          </div>
          <div class="table-wrap">
            <table class="appointments-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Appointment Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody data-appointments-body>
                ${renderAppointmentsTable(state)}
              </tbody>
            </table>
          </div>
        </section>

        <div class="admin-grid admin-grid--two">
          <section class="admin-section admin-card reveal">
            <div class="section-head">
              <div>
                <span class="sub-title">Slot management</span>
                <h3>Working hours and blocks</h3>
              </div>
            </div>
            <div class="slot-form-grid">
              <label class="field-box">
                <span>Working Hours</span>
                <select data-working-hours>
                  <option ${state.workingHours === '09:30 - 18:30' ? 'selected' : ''}>09:30 - 18:30</option>
                  <option ${state.workingHours === '10:00 - 19:00' ? 'selected' : ''}>10:00 - 19:00</option>
                  <option ${state.workingHours === '09:00 - 17:00' ? 'selected' : ''}>09:00 - 17:00</option>
                </select>
              </label>
              <label class="field-box">
                <span>Slot Interval</span>
                <select data-slot-interval>
                  <option ${state.interval === '30 minutes' ? 'selected' : ''}>30 minutes</option>
                  <option ${state.interval === '45 minutes' ? 'selected' : ''}>45 minutes</option>
                  <option ${state.interval === '60 minutes' ? 'selected' : ''}>60 minutes</option>
                </select>
              </label>
              <label class="field-box field-box--full">
                <span>Block Date</span>
                <div class="inline-inputs">
                  <input type="date" data-block-date>
                  <button type="button" class="theme-btn btn-style-one admin-small-btn" data-add-block>Date Block</button>
                </div>
              </label>
            </div>
            <div class="blocked-list">
              <h4>Blocked dates</h4>
              <ul data-blocked-list>${renderBlockedDates(state.blockedDates)}</ul>
            </div>
          </section>

          <section class="admin-section admin-card reveal">
            <div class="section-head">
              <div>
                <span class="sub-title">Calendar view</span>
                <h3>Monthly appointment grid</h3>
              </div>
            </div>
            <div class="calendar-board">
              ${renderCalendarGrid()}
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function updateStats(container) {
  container.querySelectorAll('[data-counter-value]').forEach((counter) => {
    const target = Number(counter.getAttribute('data-counter-value'));
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      current = Math.min(target, current + increment);
      counter.textContent = current.toString();
      if (current < target) {
        requestAnimationFrame(tick);
      }
    };
    tick();
  });
}

function bindAdminInteractions(container, state, rerender) {
  container.querySelector('[data-search-input]')?.addEventListener('input', (event) => {
    state.searchTerm = event.target.value;
    rerender(false);
  });

  container.querySelector('[data-working-hours]')?.addEventListener('change', (event) => {
    state.workingHours = event.target.value;
  });

  container.querySelector('[data-slot-interval]')?.addEventListener('change', (event) => {
    state.interval = event.target.value;
  });

  container.querySelector('[data-add-block]')?.addEventListener('click', () => {
    const dateInput = container.querySelector('[data-block-date]');
    const dateValue = dateInput?.value;
    if (!dateValue || state.blockedDates.includes(dateValue)) return;
    state.blockedDates = [dateValue, ...state.blockedDates];
    rerender();
  });

  container.querySelector('[data-blocked-list]')?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-remove-block]');
    if (!button) return;
    const blockedDate = button.getAttribute('data-remove-block');
    state.blockedDates = state.blockedDates.filter((date) => date !== blockedDate);
    rerender();
  });

  container.querySelector('[data-appointments-body]')?.addEventListener('click', async (event) => {
    const acceptButton = event.target.closest('[data-accept]');
    const rejectButton = event.target.closest('[data-reject]');
    const viewButton = event.target.closest('[data-view]');

    if (acceptButton) {
      const appointmentId = acceptButton.getAttribute('data-accept');
      state.appointments = state.appointments.map((appointment) => (appointment.id === appointmentId ? { ...appointment, status: 'Approved' } : appointment));
      await updateAppointmentStatus(appointmentId, 'Approved');
      rerender();
      return;
    }

    if (rejectButton) {
      const appointmentId = rejectButton.getAttribute('data-reject');
      state.appointments = state.appointments.map((appointment) => (appointment.id === appointmentId ? { ...appointment, status: 'Rejected' } : appointment));
      await updateAppointmentStatus(appointmentId, 'Rejected');
      rerender();
      return;
    }

    if (viewButton) {
      const appointment = state.appointments.find((record) => record.id === viewButton.getAttribute('data-view'));
      state.selectedAppointment = appointment || null;
      const modal = container.querySelector('[data-modal]');
      const modalPanel = modal?.querySelector('.appointment-modal__panel');
      if (modalPanel && appointment) {
        modalPanel.innerHTML = `
          <button type="button" class="appointment-modal__close" data-modal-close aria-label="Close modal">&times;</button>
          <div class="appointment-modal__icon"><i class="fa fa-id-card"></i></div>
          <h3>${appointment.clientName}</h3>
          <div class="detail-grid">
            <div><span>Email</span><strong>${appointment.email}</strong></div>
            <div><span>Phone</span><strong>${appointment.phone}</strong></div>
            <div><span>Date</span><strong>${formatDateLabel(appointment.date)}</strong></div>
            <div><span>Time</span><strong>${appointment.time}</strong></div>
            <div><span>Type</span><strong>${appointment.type}</strong></div>
            <div><span>Status</span><strong>${appointment.status}</strong></div>
          </div>
          <p class="detail-notes">${appointment.notes}</p>
          <div class="modal-actions">
            <button type="button" class="theme-btn btn-style-one" data-modal-close>Close</button>
          </div>
        `;
        showModal(modal);
      }
    }
  });

  container.querySelector('[data-modal]')?.addEventListener('click', (event) => {
    if (event.target.matches('[data-modal-close]')) {
      hideModal(container.querySelector('[data-modal]'));
    }
  });

  container.querySelectorAll('.sidebar-link').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeSection = button.getAttribute('data-nav-item');
      rerender(false);
    });
  });
}

function applyRevealEffects(container) {
  const nodes = container.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${index * 70}ms`;
    observer.observe(node);
  });
}

export function initAdminDashboardApp(container) {
  if (!container) return;
  const state = getInitialState();

  const rerender = (animateCounters = true) => {
    container.innerHTML = `
      <div class="admin-shell">
        ${renderAdminMarkup(state)}
        <div class="appointment-modal-layer">
          ${buildModalMarkup({
            title: 'Appointment Details',
            message: 'Select a request in the table to inspect the full client record.',
            actionLabel: 'Close',
          })}
        </div>
      </div>
    `;
    bindAdminInteractions(container, state, rerender);
    applyRevealEffects(container);
    if (animateCounters) {
      updateStats(container);
    } else {
      container.querySelectorAll('[data-counter-value]').forEach((counter) => {
        counter.textContent = counter.getAttribute('data-counter-value');
      });
    }
  };

  rerender();
}
