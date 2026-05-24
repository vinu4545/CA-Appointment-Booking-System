export function buildModalMarkup({ title, message, actionLabel = 'Close' }) {
  return `
    <div class="appointment-modal" data-modal>
      <div class="appointment-modal__backdrop" data-modal-close></div>
      <div class="appointment-modal__panel">
        <button type="button" class="appointment-modal__close" data-modal-close aria-label="Close modal">&times;</button>
        <div class="appointment-modal__icon"><i class="fa fa-check"></i></div>
        <h3>${title}</h3>
        <p>${message}</p>
        <button type="button" class="theme-btn btn-style-one appointment-modal__action" data-modal-close>${actionLabel}</button>
      </div>
    </div>
  `;
}

export function showModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.add('is-visible');
}

export function hideModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.remove('is-visible');
}
