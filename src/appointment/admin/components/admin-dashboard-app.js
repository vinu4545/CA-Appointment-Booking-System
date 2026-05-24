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
    // calendar view state
    viewYear: new Date().getFullYear(),
    viewMonth: new Date().getMonth(),
    selectedDay: null,
    notificationsEnabled: true,
    notificationsPanelOpen: false,
    notifications: [
      {
        id: 1,
        title: 'Booking Confirmed',
        message: 'Your slot at 10:00 AM is confirmed',
        seen: false,
        timestamp: '2026-05-25T10:00:00',
      },
      {
        id: 2,
        title: 'Reminder',
        message: 'Audit review starts in 30 minutes',
        seen: false,
        timestamp: '2026-05-24T11:15:00',
      },
      {
        id: 3,
        title: 'Status Updated',
        message: 'A client request was marked approved',
        seen: true,
        timestamp: '2026-05-24T09:40:00',
      },
    ],
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

function getUnseenCount(notifications) {
  return notifications.filter((notification) => !notification.seen).length;
}

function formatRelativeTime(timestamp) {
  const now = Date.now();
  const target = new Date(timestamp).getTime();
  const diffMs = Math.max(0, now - target);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'Just now';
  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute);
    return `${mins} min ago`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hr ago`;
  }
  const days = Math.floor(diffMs / day);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function addNotification(state, payload) {
  if (!state.notificationsEnabled) return;
  const nextId = state.notifications.length ? Math.max(...state.notifications.map((item) => Number(item.id) || 0)) + 1 : 1;
  state.notifications = [
    {
      id: nextId,
      title: payload.title,
      message: payload.message,
      seen: false,
      timestamp: new Date().toISOString(),
    },
    ...state.notifications,
  ];
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

function formatMonthLabel(year, monthIndex) {
  const d = new Date(year, monthIndex, 1);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function renderCalendarGrid(state) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const { viewYear, viewMonth } = state;

  // first day of month and number of days
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeek = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // build cells (leading blanks + days)
  const cells = [];
  for (let i = 0; i < startWeek; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(viewYear, viewMonth, d));
  }

  const today = new Date();

  return `
    <div class="calendar-header">
      <button type="button" class="month-nav" data-month-prev aria-label="Previous month">&larr;</button>
      <div class="month-title">${formatMonthLabel(viewYear, viewMonth)}</div>
      <button type="button" class="month-nav" data-month-next aria-label="Next month">&rarr;</button>
    </div>
    <div class="month-grid month-grid--labels">
      ${days.map((day) => `<span>${day}</span>`).join('')}
    </div>
    <div class="month-grid">
      ${cells
        .map((cell) => {
          if (!cell) return `<div class="month-day month-day--empty"></div>`;
          const iso = cell.toISOString().slice(0, 10);
          const isBlocked = state.blockedDates.includes(iso);
          const hasMeeting = state.appointments.some((appointment) => appointment.date === iso);
          const isToday = cell.toDateString() === today.toDateString();
          const isSelected = state.selectedDay === iso;
          const classes = [
            'month-day',
            isBlocked ? 'is-blocked' : '',
            hasMeeting ? 'has-meeting' : '',
            isToday ? 'is-today' : '',
            isSelected ? 'is-selected' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return `<button type="button" class="${classes}" data-day="${iso}"><span>${cell.getDate()}</span></button>`;
        })
        .join('')}
    </div>
  `;
}

function renderNotificationPanel(state) {
  return `
    <div class="notification-panel ${state.notificationsPanelOpen ? 'is-open' : ''}" data-notification-panel>
      <div class="notification-panel__header">
        <h4>Notifications</h4>
        <button
          type="button"
          class="notif-toggle ${state.notificationsEnabled ? 'is-on' : 'is-off'}"
          data-toggle-notifications
          aria-label="Toggle notifications"
          aria-pressed="${state.notificationsEnabled ? 'true' : 'false'}"
        >
          <span class="notif-toggle__knob"></span>
        </button>
      </div>
      <div class="notification-panel__body">
        ${
          state.notifications.length === 0
            ? '<p class="notification-empty">No notifications</p>'
            : state.notifications
                .map(
                  (notification) => `
                    <article class="notification-item ${notification.seen ? 'is-seen' : 'is-unseen'}" data-notification-id="${notification.id}">
                      <div class="notification-item__head">
                        <strong>${notification.title}</strong>
                        <span>${formatRelativeTime(notification.timestamp)}</span>
                      </div>
                      <p>${notification.message}</p>
                      <div class="notification-item__meta">
                        <span class="notification-dot ${notification.seen ? 'is-seen' : 'is-unseen'}"></span>
                        <button type="button" class="text-link" data-mark-seen="${notification.id}">${notification.seen ? 'Seen' : 'Mark as seen'}</button>
                      </div>
                    </article>
                  `,
                )
                .join('')
        }
      </div>
    </div>
  `;
}

function renderNotificationBell(state) {
  const unseenCount = getUnseenCount(state.notifications);
  return `
    <div class="notification-wrap" data-notification-root>
      <button type="button" class="icon-chip notification-bell" data-notification-bell aria-label="Open notifications" aria-expanded="${state.notificationsPanelOpen ? 'true' : 'false'}">
        <i class="fa fa-bell-o"></i>
        ${unseenCount > 0 ? `<span class="notification-badge">${unseenCount}</span>` : ''}
      </button>
      ${renderNotificationPanel(state)}
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
            ${renderNotificationBell(state)}
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
              ${renderCalendarGrid(state)}
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
    addNotification(state, {
      title: 'Date Blocked',
      message: `Blocked date ${dateValue} was added to slot management.`,
    });
    rerender();
  });

  container.querySelector('[data-blocked-list]')?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-remove-block]');
    if (!button) return;
    const blockedDate = button.getAttribute('data-remove-block');
    state.blockedDates = state.blockedDates.filter((date) => date !== blockedDate);
    addNotification(state, {
      title: 'Date Unblocked',
      message: `Blocked date ${blockedDate} was removed from slot management.`,
    });
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
      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (appointment) {
        addNotification(state, {
          title: 'Appointment Approved',
          message: `${appointment.clientName} at ${appointment.time} was marked approved.`,
        });
      }
      rerender();
      return;
    }

    if (rejectButton) {
      const appointmentId = rejectButton.getAttribute('data-reject');
      state.appointments = state.appointments.map((appointment) => (appointment.id === appointmentId ? { ...appointment, status: 'Rejected' } : appointment));
      await updateAppointmentStatus(appointmentId, 'Rejected');
      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (appointment) {
        addNotification(state, {
          title: 'Appointment Rejected',
          message: `${appointment.clientName} at ${appointment.time} was marked rejected.`,
        });
      }
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

  container.querySelector('[data-modal]')?.addEventListener('click', async (event) => {
    const accept = event.target.closest('[data-accept]');
    const reject = event.target.closest('[data-reject]');
    if (accept) {
      const id = accept.getAttribute('data-accept');
      state.appointments = state.appointments.map((appointment) => (appointment.id === id ? { ...appointment, status: 'Approved' } : appointment));
      await updateAppointmentStatus(id, 'Approved');
      const appointment = state.appointments.find((item) => item.id === id);
      if (appointment) {
        addNotification(state, {
          title: 'Appointment Approved',
          message: `${appointment.clientName} at ${appointment.time} was marked approved.`,
        });
      }
      rerender();
      return;
    }
    if (reject) {
      const id = reject.getAttribute('data-reject');
      state.appointments = state.appointments.map((appointment) => (appointment.id === id ? { ...appointment, status: 'Rejected' } : appointment));
      await updateAppointmentStatus(id, 'Rejected');
      const appointment = state.appointments.find((item) => item.id === id);
      if (appointment) {
        addNotification(state, {
          title: 'Appointment Rejected',
          message: `${appointment.clientName} at ${appointment.time} was marked rejected.`,
        });
      }
      rerender();
      return;
    }

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

  container.querySelector('[data-notification-bell]')?.addEventListener('click', () => {
    const opening = !state.notificationsPanelOpen;
    state.notificationsPanelOpen = opening;
    if (opening) {
      state.notifications = state.notifications.map((notification) => ({ ...notification, seen: true }));
    }
    rerender(false);
  });

  container.querySelector('[data-toggle-notifications]')?.addEventListener('click', () => {
    state.notificationsEnabled = !state.notificationsEnabled;
    rerender(false);
  });

  container.querySelector('[data-notification-panel]')?.addEventListener('click', (event) => {
    const markSeenButton = event.target.closest('[data-mark-seen]');
    if (!markSeenButton) return;
    const id = Number(markSeenButton.getAttribute('data-mark-seen'));
    state.notifications = state.notifications.map((notification) =>
      notification.id === id ? { ...notification, seen: true } : notification,
    );
    rerender(false);
  });

  // Calendar interactions: month navigation and day selection
  container.querySelector('.calendar-board')?.addEventListener('click', (event) => {
    const prev = event.target.closest('[data-month-prev]');
    const next = event.target.closest('[data-month-next]');
    const dayBtn = event.target.closest('[data-day]');

    if (prev) {
      // previous month
      if (state.viewMonth === 0) {
        state.viewMonth = 11;
        state.viewYear -= 1;
      } else {
        state.viewMonth -= 1;
      }
      state.selectedDay = null;
      rerender(false);
      return;
    }

    if (next) {
      // next month
      if (state.viewMonth === 11) {
        state.viewMonth = 0;
        state.viewYear += 1;
      } else {
        state.viewMonth += 1;
      }
      state.selectedDay = null;
      rerender(false);
      return;
    }

    if (dayBtn) {
      const iso = dayBtn.getAttribute('data-day');
      state.selectedDay = iso;
      const appointmentsForDay = state.appointments.filter((a) => a.date === iso);
      const modal = container.querySelector('[data-modal]');
      const modalPanel = modal?.querySelector('.appointment-modal__panel');
      if (modalPanel) {
        if (appointmentsForDay.length === 0) {
          modalPanel.innerHTML = `
            <button type="button" class="appointment-modal__close" data-modal-close aria-label="Close modal">&times;</button>
            <h3>No bookings on ${iso}</h3>
            <p>There are no appointment requests for the selected date.</p>
            <div class="modal-actions"><button type="button" class="theme-btn btn-style-one" data-modal-close>Close</button></div>
          `;
        } else {
          modalPanel.innerHTML = `
            <button type="button" class="appointment-modal__close" data-modal-close aria-label="Close modal">&times;</button>
            <h3>Appointments for ${iso}</h3>
            <div class="detail-list">
              ${appointmentsForDay
                .map(
                  (appt) => `
                    <div class="detail-item">
                      <div>
                        <strong>${appt.clientName}</strong>
                        <div class="muted">${appt.time} • ${appt.type}</div>
                      </div>
                      <div class="action-group">
                        <button type="button" class="mini-btn mini-btn--success" data-accept="${appt.id}">Accept</button>
                        <button type="button" class="mini-btn mini-btn--danger" data-reject="${appt.id}">Reject</button>
                      </div>
                    </div>
                  `,
                )
                .join('')}
            </div>
            <div class="modal-actions"><button type="button" class="theme-btn btn-style-one" data-modal-close>Close</button></div>
          `;
        }
        showModal(modal);
      }
    }
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
