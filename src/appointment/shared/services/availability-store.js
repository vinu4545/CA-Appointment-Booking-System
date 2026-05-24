import { slotTimes } from '../constants/appointment-data.js';

const STORE_KEY = 'ssar_appointment_availability';

export const availabilityData = {
  '2026-05-25': {
    available: true,
    slots: {
      '10:00 AM': true,
      '10:30 AM': true,
      '11:00 AM': true,
      '11:30 AM': true,
    },
  },
  '2026-05-26': {
    available: true,
    slots: {
      '10:00 AM': true,
      '11:00 AM': true,
      '11:30 AM': true,
    },
  },
  '2026-05-27': {
    available: true,
    slots: {
      '10:30 AM': true,
      '11:00 AM': true,
      '12:00 PM': true,
    },
  },
  '2026-05-28': {
    available: true,
    slots: {
      '10:00 AM': true,
      '10:30 AM': true,
      '11:30 AM': true,
    },
  },
  '2026-05-29': {
    available: true,
    slots: {
      '10:00 AM': true,
      '11:00 AM': true,
      '11:30 AM': true,
    },
  },
  '2026-05-30': {
    available: false,
    slots: {},
  },
  '2026-05-31': {
    available: false,
    slots: {},
  },
  '2026-06-01': {
    available: false,
    slots: {},
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createFullSlotMap() {
  return slotTimes.reduce((accumulator, slot) => {
    accumulator[slot] = true;
    return accumulator;
  }, {});
}

function toLocalDate(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function formatWeekday(dateKey) {
  return toLocalDate(dateKey).toLocaleDateString('en-IN', { weekday: 'short' });
}

function normalizeSlotMap(slotMap = {}) {
  return slotTimes.reduce((accumulator, slot) => {
    accumulator[slot] = Boolean(slotMap[slot]);
    return accumulator;
  }, {});
}

function normalizeRecord(record) {
  if (!record || typeof record !== 'object') {
    return { available: false, slots: {} };
  }

  if (!record.available) {
    return { available: false, slots: {} };
  }

  return {
    available: true,
    slots: normalizeSlotMap(record.slots),
  };
}

function normalizeStore(store = {}) {
  return Object.entries(store).reduce((accumulator, [dateKey, record]) => {
    accumulator[dateKey] = normalizeRecord(record);
    return accumulator;
  }, {});
}

function seedStore() {
  return clone(availabilityData);
}

function readRawStore() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return seedStore();
  }

  try {
    const rawValue = window.localStorage.getItem(STORE_KEY);
    if (!rawValue) return seedStore();
    return normalizeStore(JSON.parse(rawValue));
  } catch (error) {
    return seedStore();
  }
}

function writeRawStore(store) {
  const normalized = normalizeStore(store);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(normalized));
    } catch (error) {
      return normalized;
    }
  }
  return normalized;
}

export function getAvailabilityStore() {
  return readRawStore();
}

export function getAvailabilityRecord(dateKey) {
  const store = readRawStore();
  return store[dateKey] ? normalizeRecord(store[dateKey]) : { available: false, slots: {} };
}

export function getAvailabilityCalendar() {
  return Object.entries(readRawStore())
    .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
    .map(([dateKey, record]) => ({
      date: dateKey,
      label: formatWeekday(dateKey),
      available: Boolean(record.available),
    }));
}

export function getBlockedDates() {
  return getAvailabilityCalendar()
    .filter((item) => !item.available)
    .map((item) => item.date);
}

export function isDateAvailable(dateKey) {
  return getAvailabilityRecord(dateKey).available;
}

export function getAvailableSlotsForDate(dateKey) {
  const record = getAvailabilityRecord(dateKey);
  if (!record.available) return [];
  return slotTimes.filter((slot) => Boolean(record.slots[slot]));
}

export function findFirstAvailableDate() {
  return getAvailabilityCalendar().find((item) => item.available)?.date || '';
}

export function findFirstAvailableSlot(dateKey) {
  return getAvailableSlotsForDate(dateKey)[0] || '';
}

export function setDateAvailability(dateKey, available, slots = null) {
  const store = readRawStore();
  store[dateKey] = available
    ? {
        available: true,
        slots: normalizeSlotMap(slots ?? createFullSlotMap()),
      }
    : {
        available: false,
        slots: {},
      };

  return writeRawStore(store)[dateKey];
}

export function setSlotAvailability(dateKey, slot, available) {
  const store = readRawStore();
  const existingRecord = store[dateKey] || { available: true, slots: createFullSlotMap() };
  const nextSlots = normalizeSlotMap(existingRecord.slots);
  nextSlots[slot] = Boolean(available);

  const hasOpenSlot = Object.values(nextSlots).some(Boolean);
  store[dateKey] = hasOpenSlot
    ? {
        available: true,
        slots: nextSlots,
      }
    : {
        available: false,
        slots: {},
      };

  return writeRawStore(store)[dateKey];
}

export function reserveAppointmentSlot(dateKey, slot) {
  return setSlotAvailability(dateKey, slot, false);
}