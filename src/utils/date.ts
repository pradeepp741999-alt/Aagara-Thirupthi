export function nextDays(count: number, startOffset = 1) {
  const days = [];
  const base = new Date();
  for (let i = startOffset; i < startOffset + count; i += 1) {
    const dt = new Date(base);
    dt.setDate(base.getDate() + i);
    days.push(dt);
  }
  return days;
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(isoOrDate: string | Date) {
  const dt = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function formatLongDate(isoOrDate: string | Date) {
  if (!isoOrDate) return 'Not set';
  const dt = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(dt.getTime())) return 'Not set';
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function weekdayLabel(date: Date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}
