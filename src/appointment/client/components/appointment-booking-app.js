import { buildModalMarkup, hideModal, showModal } from '../../shared/components/modal.js';
import { buildAdminLoginModalMarkup } from '../../shared/components/admin-login-modal.js';
import { bookingProcess, bookingTypes } from '../data/mock-booking-data.js';
import { createAppointmentRequest } from '../../shared/services/appointment-api.js';
import {
  bindAdminLoginInteractions,
  createAdminLoginState,
  shouldAutoOpenAdminLogin,
  syncAdminLoginModal,
} from '../../shared/services/admin-login-handler.js';
import {
  findFirstAvailableDate,
  findFirstAvailableSlot,
  getAvailabilityCalendar,
  getAvailableSlotsForDate,
  isDateAvailable,
} from '../../shared/services/availability-store.js';
import { formatAppointmentDate, validateAppointmentForm } from '../../shared/utils/validation.js';
import { slotTimes } from '../../shared/constants/appointment-data.js';

function getInitialState() {
  const selectedDate = findFirstAvailableDate() || getAvailabilityCalendar()[0]?.date || '';
  const initialSlots = getAvailableSlotsForDate(selectedDate);

  return {
    selectedDate,
    selectedTime: initialSlots[0] || '',
    appointmentType: bookingTypes[0]?.value || '',
    adminLogin: createAdminLoginState({ open: shouldAutoOpenAdminLogin() }),
    form: {
      fullName: '',
      email: '',
      phone: '',
      appointmentType: bookingTypes[0]?.value || '',
      preferredDate: selectedDate,
      preferredTime: initialSlots[0] || '',
      message: '',
    },
    errors: {},
    submitting: false,
  };
}

function renderCalendarButtons(state) {
  return getAvailabilityCalendar()
    .map((day) => {
      const isSelected = state.selectedDate === day.date;
      const isAvailable = day.available;
      const classes = [
        'calendar-day',
        isSelected ? 'is-selected' : '',
        !isAvailable ? 'is-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <button type="button" class="${classes}" data-date="${day.date}" ${!isAvailable ? 'disabled' : ''}>
          <span class="calendar-day__label">${day.label}</span>
          <strong class="calendar-day__date">${day.date.split('-')[2]}</strong>
          <small>${isAvailable ? 'Open' : 'Blocked'}</small>
        </button>
      `;
    })
    .join('');
}

function renderTimeSlots(state) {
  const selectedSlots = getAvailableSlotsForDate(state.selectedDate);
  return slotTimes
    .map((slot) => {
      const isAvailable = selectedSlots.includes(slot);
      const isSelected = state.selectedTime === slot;
      const classes = [
        'slot-chip',
        isSelected ? 'is-selected' : '',
        !isAvailable ? 'is-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <button type="button" class="${classes}" data-slot="${slot}" ${!isAvailable ? 'disabled' : ''}>
          ${slot}
        </button>
      `;
    })
    .join('');
}

function renderProcessCards() {
  return bookingProcess
    .map(
      (step, index) => `
        <div class="process-card reveal">
          <div class="process-card__icon"><i class="fa ${step.icon}"></i></div>
          <span class="process-card__step">Step 0${index + 1}</span>
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </div>
      `,
    )
    .join('');
}

function renderBookingPageMarkup(state) {
  const selectedSlots = getAvailableSlotsForDate(state.selectedDate);
  const isSelectedDateAvailable = isDateAvailable(state.selectedDate);
  return `
    <section class="appointment-hero section-hero" style="background-image:url('images/background/8.jpg')">
      <div class="appointment-overlay"></div>
      <div class="auto-container">
        <div class="appointment-hero__content reveal">
          <span class="eyebrow">Appointment Booking</span>
          <h1>Schedule Your Consultation</h1>
          <p>Reserve a consultation with SSAR & Co for audits, taxation, compliance, and advisory support. The booking flow is designed to feel native to the existing site while staying ready for backend integration.</p>
          <div class="appointment-hero__actions">
            <a href="#appointment-form-section" class="theme-btn btn-style-one">Book now <span class="fa fa-calendar"></span></a>
            <a href="tel:+919665945287" class="theme-btn btn-style-thirteen">Call the office <span class="fa fa-phone"></span></a>
            <button type="button" class="theme-btn btn-style-thirteen appointment-hero__admin-btn" data-admin-login-open>Admin Login <span class="fa fa-lock"></span></button>
          </div>
        </div>
      </div>
    </section>

    <section class="appointment-intro section-pad">
      <div class="auto-container">
        <div class="section-title centered reveal">
          <span class="sub-title">Simple process</span>
          <h2>How the consultation flow works</h2>
        </div>
        <div class="appointment-grid appointment-grid--three">${renderProcessCards()}</div>
      </div>
    </section>

    <section class="appointment-booking section-pad section-pad--tight">
      <div class="auto-container">
        <div class="appointment-grid appointment-grid--two align-start">
          <div class="appointment-panel reveal">
            <div class="panel-heading">
              <span class="sub-title">Interactive calendar</span>
              <h3>Select a preferred date</h3>
            </div>
            <div class="calendar-picker" data-calendar-grid>${renderCalendarButtons(state)}</div>
            <div class="slot-panel">
              <div class="slot-panel__header">
                <h4>Available slots</h4>
                <p>${isSelectedDateAvailable ? `${selectedSlots.length} slots available for ${formatAppointmentDate(state.selectedDate)}` : 'This date is blocked.'}</p>
              </div>
              <div class="slot-chip-group" data-slot-grid>${renderTimeSlots(state)}</div>
            </div>
          </div>

          <aside class="appointment-summary reveal">
            <div class="summary-card">
              <div class="summary-card__header">
                <span class="sub-title">Appointment summary</span>
                <h3>Review your selection</h3>
              </div>
              <ul class="summary-list">
                <li><span>Date</span><strong data-summary-date>${formatAppointmentDate(state.selectedDate)}</strong></li>
                <li><span>Time</span><strong data-summary-time>${state.selectedTime || 'Select a slot'}</strong></li>
                <li><span>Type</span><strong data-summary-type>${bookingTypes.find((type) => type.value === state.appointmentType)?.label || 'Consultation'}</strong></li>
              </ul>
              <div class="summary-note">
                <i class="fa fa-info-circle"></i>
                <p>Our team will confirm the request after reviewing calendar availability and your notes.</p>
              </div>
            </div>

            <div class="summary-card summary-card--light">
              <div class="summary-card__header">
                <span class="sub-title">Appointment types</span>
                <h3>Choose the right service</h3>
              </div>
              <div class="service-tags">
                ${bookingTypes
                  .map(
                    (type) => `
                      <button type="button" class="service-tag ${state.appointmentType === type.value ? 'is-selected' : ''}" data-type="${type.value}">${type.label}</button>
                    `,
                  )
                  .join('')}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section id="appointment-form-section" class="appointment-form-section section-pad">
      <div class="auto-container">
        <div class="section-title centered reveal">
          <span class="sub-title">Request details</span>
          <h2>Tell us a little about your requirement</h2>
        </div>
        <div class="appointment-grid appointment-grid--two align-start">
          <form class="appointment-form reveal" data-appointment-form novalidate>
            <div class="form-grid">
              <div class="floating-field">
                <input type="text" name="fullName" id="fullName" value="${state.form.fullName}" placeholder=" " autocomplete="name">
                <label for="fullName">Full Name</label>
                <span class="field-error" data-error-for="fullName">${state.errors.fullName || ''}</span>
              </div>
              <div class="floating-field">
                <input type="email" name="email" id="email" value="${state.form.email}" placeholder=" " autocomplete="email">
                <label for="email">Email Address</label>
                <span class="field-error" data-error-for="email">${state.errors.email || ''}</span>
              </div>
              <div class="floating-field">
                <input type="tel" name="phone" id="phone" value="${state.form.phone}" placeholder=" " autocomplete="tel">
                <label for="phone">Phone Number</label>
                <span class="field-error" data-error-for="phone">${state.errors.phone || ''}</span>
              </div>
              <div class="floating-field">
                <select name="appointmentType" id="appointmentType">
                  ${bookingTypes
                    .map(
                      (type) => `<option value="${type.value}" ${state.form.appointmentType === type.value ? 'selected' : ''}>${type.label}</option>`,
                    )
                    .join('')}
                </select>
                <label for="appointmentType">Appointment Type</label>
                <span class="field-error" data-error-for="appointmentType">${state.errors.appointmentType || ''}</span>
              </div>
              <div class="floating-field">
                <input type="date" name="preferredDate" id="preferredDate" value="${state.form.preferredDate}">
                <label for="preferredDate">Preferred Date</label>
                <span class="field-error" data-error-for="preferredDate">${state.errors.preferredDate || ''}</span>
              </div>
              <div class="floating-field">
                <select name="preferredTime" id="preferredTime">
                  <option value="">Select a slot</option>
                  ${slotTimes
                    .map(
                      (slot) => `<option value="${slot}" ${state.form.preferredTime === slot ? 'selected' : ''} ${selectedSlots.includes(slot) ? '' : 'disabled'}>${slot}</option>`,
                    )
                    .join('')}
                </select>
                <label for="preferredTime">Preferred Time Slot</label>
                <span class="field-error" data-error-for="preferredTime">${state.errors.preferredTime || ''}</span>
              </div>
            </div>
            <div class="floating-field floating-field--full">
              <textarea name="message" id="message" rows="5" placeholder=" ">${state.form.message}</textarea>
              <label for="message">Message / Notes</label>
              <span class="field-error" data-error-for="message">${state.errors.message || ''}</span>
            </div>
            <div class="form-actions">
              <button type="submit" class="theme-btn btn-style-one" data-submit-btn>${state.submitting ? 'Submitting...' : 'Submit Appointment Request'}</button>
              <button type="button" class="theme-btn btn-style-thirteen" data-reset-btn>Reset form</button>
            </div>
            <div class="form-feedback" data-form-feedback></div>
          </form>

          <div class="appointment-side-column reveal">
            <div class="service-note-card">
              <span class="sub-title">Why clients book here</span>
              <ul class="reason-list">
                <li><i class="fa fa-check"></i> Quick consultation scheduling for audits and tax matters</li>
                <li><i class="fa fa-check"></i> Professional appointment request flow with validation</li>
                <li><i class="fa fa-check"></i> Ready for Google Calendar, email, and admin API wiring</li>
              </ul>
            </div>
            <div class="appointment-summary-card">
              <span class="sub-title">Live snapshot</span>
              <h3>Selected appointment details</h3>
              <div class="snapshot-item">
                <small>Date</small>
                <strong data-summary-date-inline>${formatAppointmentDate(state.selectedDate)}</strong>
              </div>
              <div class="snapshot-item">
                <small>Slot</small>
                <strong data-summary-time-inline>${state.selectedTime || 'Select a slot'}</strong>
              </div>
              <div class="snapshot-item">
                <small>Service</small>
                <strong data-summary-type-inline>${bookingTypes.find((type) => type.value === state.appointmentType)?.label || 'Consultation'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function updateSummary(container, state) {
  const dateLabel = formatAppointmentDate(state.selectedDate);
  const typeLabel = bookingTypes.find((type) => type.value === state.appointmentType)?.label || 'Consultation';

  container.querySelectorAll('[data-summary-date]').forEach((node) => {
    node.textContent = dateLabel;
  });
  container.querySelectorAll('[data-summary-time]').forEach((node) => {
    node.textContent = state.selectedTime || 'Select a slot';
  });
  container.querySelectorAll('[data-summary-type]').forEach((node) => {
    node.textContent = typeLabel;
  });
  container.querySelectorAll('[data-summary-date-inline]').forEach((node) => {
    node.textContent = dateLabel;
  });
  container.querySelectorAll('[data-summary-time-inline]').forEach((node) => {
    node.textContent = state.selectedTime || 'Select a slot';
  });
  container.querySelectorAll('[data-summary-type-inline]').forEach((node) => {
    node.textContent = typeLabel;
  });
}

function updateFieldErrors(container, errors) {
  container.querySelectorAll('[data-error-for]').forEach((node) => {
    const fieldName = node.getAttribute('data-error-for');
    node.textContent = errors[fieldName] || '';
  });
}

function setFormFeedback(container, message, tone = 'success') {
  const feedback = container.querySelector('[data-form-feedback]');
  if (!feedback) return;
  feedback.className = `form-feedback is-${tone}`;
  feedback.textContent = message;
}

function bindCalendarInteraction(container, state, rerender) {
  container.querySelector('[data-calendar-grid]')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-date]');
    if (!button || button.disabled) return;
    const selectedDate = button.getAttribute('data-date');
    if (!isDateAvailable(selectedDate)) return;
    state.selectedDate = selectedDate;
    const nextSlots = getAvailableSlotsForDate(state.selectedDate);
    state.selectedTime = nextSlots[0] || '';
    state.form.preferredDate = state.selectedDate;
    state.form.preferredTime = state.selectedTime;
    rerender();
  });

  container.querySelector('[data-slot-grid]')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-slot]');
    if (!button || button.disabled) return;
    state.selectedTime = button.getAttribute('data-slot');
    state.form.preferredTime = state.selectedTime;
    rerender();
  });

  container.querySelector('.service-tags')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-type]');
    if (!button) return;
    state.appointmentType = button.getAttribute('data-type');
    state.form.appointmentType = state.appointmentType;
    rerender();
  });
}

function bindForm(container, state, rerender) {
  const form = container.querySelector('[data-appointment-form]');
  if (!form) return;

  form.addEventListener('input', (event) => {
    const { name, value } = event.target;
    if (!name) return;
    state.form[name] = value;
    if (name === 'preferredDate') {
      state.selectedDate = value;
      if (isDateAvailable(value)) {
        const nextSlots = getAvailableSlotsForDate(value);
        state.selectedTime = nextSlots[0] || '';
        state.form.preferredTime = state.selectedTime;
      } else {
        state.selectedTime = '';
        state.form.preferredTime = '';
      }
    }
    if (name === 'appointmentType') {
      state.appointmentType = value;
    }
    updateSummary(container, state);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = container.querySelector('[data-submit-btn]');
    const payload = { ...state.form, preferredDate: state.selectedDate, preferredTime: state.selectedTime };
    const errors = validateAppointmentForm(payload, {
      isDateAvailable,
      isTimeAvailable: (dateKey, slot) => getAvailableSlotsForDate(dateKey).includes(slot),
    });
    state.errors = errors;
    updateFieldErrors(container, errors);

    if (Object.keys(errors).length) {
      setFormFeedback(container, 'Please fix the highlighted fields before submitting.', 'danger');
      return;
    }

    state.submitting = true;
    if (submitButton) submitButton.textContent = 'Submitting...';

    const request = await createAppointmentRequest(payload);

    state.submitting = false;
    if (submitButton) submitButton.textContent = 'Submit Appointment Request';
    setFormFeedback(container, 'Appointment request submitted successfully.', 'success');

    state.form.message = '';
    state.form.fullName = '';
    state.form.email = '';
    state.form.phone = '';
    state.form.appointmentType = state.appointmentType;
    state.form.preferredDate = state.selectedDate;
    state.form.preferredTime = state.selectedTime;
    state.errors = {};

    if (!isDateAvailable(state.selectedDate)) {
      state.selectedDate = findFirstAvailableDate();
    }
    state.selectedTime = findFirstAvailableSlot(state.selectedDate);
    state.form.preferredDate = state.selectedDate;
    state.form.preferredTime = state.selectedTime;

    rerender();

    const modal = container.querySelector('[data-modal]');
    if (modal) {
      const modalBody = modal.querySelector('p');
      if (modalBody) {
        modalBody.textContent = `Appointment Request Submitted Successfully. Request ID: ${request.id}. Our team will contact you shortly.`;
      }
      showModal(modal);
    }

    setFormFeedback(container, 'Appointment request submitted successfully.', 'success');
  });

  container.querySelector('[data-reset-btn]')?.addEventListener('click', () => {
    state.form.fullName = '';
    state.form.email = '';
    state.form.phone = '';
    state.form.message = '';
    state.form.appointmentType = bookingTypes[0]?.value || '';
    state.appointmentType = state.form.appointmentType;
    state.errors = {};
    state.selectedDate = findFirstAvailableDate() || getAvailabilityCalendar()[0]?.date || '';
    state.selectedTime = findFirstAvailableSlot(state.selectedDate);
    state.form.preferredDate = state.selectedDate;
    state.form.preferredTime = state.selectedTime;
    rerender();
    setFormFeedback(container, 'Form reset to the default consultation state.', 'neutral');
  });
}

function bindModal(container) {
  const modal = container.querySelector('[data-modal]');
  if (!modal) return;
  modal.addEventListener('click', (event) => {
    if (event.target.matches('[data-modal-close]')) {
      hideModal(modal);
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
    { threshold: 0.16 },
  );

  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${index * 70}ms`;
    observer.observe(node);
  });
}

export function initClientAppointmentApp(container) {
  if (!container) return;
  const state = getInitialState();
  container.innerHTML = `
    <div class="appointment-shell">
      ${renderBookingPageMarkup(state)}
      <div class="appointment-modal-layer" data-modal-layer>
        ${buildModalMarkup({
          title: 'Appointment Request Submitted Successfully',
          message: 'Your consultation request has been captured. Our team will review the timing and contact you shortly.',
          actionLabel: 'Got it',
        })}
      </div>
    </div>
  `;

  const rerender = () => {
    container.innerHTML = `
      <div class="appointment-shell">
        ${renderBookingPageMarkup(state)}
        <div class="appointment-modal-layer" data-admin-login-layer>
          ${buildAdminLoginModalMarkup(state.adminLogin)}
        </div>
        <div class="appointment-modal-layer" data-admin-login-layer>
          ${buildAdminLoginModalMarkup(state.adminLogin)}
        </div>
        <div class="appointment-modal-layer" data-modal-layer>
          ${buildModalMarkup({
            title: 'Appointment Request Submitted Successfully',
            message: 'Your consultation request has been captured. Our team will review the timing and contact you shortly.',
            actionLabel: 'Got it',
          })}
        </div>
      </div>
    `;
    bindCalendarInteraction(container, state, rerender);
    bindForm(container, state, rerender);
    bindModal(container);
    syncAdminLoginModal(container, state.adminLogin);
    updateSummary(container, state);
    applyRevealEffects(container);
    container.querySelector('[data-modal]')?.classList.remove('is-visible');
  };

  bindCalendarInteraction(container, state, rerender);
  bindForm(container, state, rerender);
  bindModal(container);
  bindAdminLoginInteractions(container, state.adminLogin, rerender);
  syncAdminLoginModal(container, state.adminLogin);
  updateSummary(container, state);
  applyRevealEffects(container);
}
