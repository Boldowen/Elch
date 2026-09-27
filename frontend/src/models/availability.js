export function parseLocalDateTime(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const value = new Date(year, month - 1, day, hour, minute);
  if (value.getFullYear() !== year || value.getMonth() !== month - 1 || value.getDate() !== day || value.getHours() !== hour || value.getMinutes() !== minute) return null;
  return value;
}

export function isGuideTimeAvailable(calendar, startsAt, endsAt) {
  if (!calendar) return true;
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;
  const slots = calendar.slots || [];
  if ((calendar.busy || []).some((slot) => new Date(slot.startsAt).getTime() < end && new Date(slot.endsAt).getTime() > start)) return false;
  if (slots.some((slot) => slot.status === 'BLOCKED' && new Date(slot.startsAt).getTime() < end && new Date(slot.endsAt).getTime() > start)) return false;
  if (!calendar.configured) return true;
  const available = slots.filter((slot) => slot.status === 'AVAILABLE');
  // The API includes hasAvailableSlots because date filtering can return an
  // empty set even when the guide has configured an allow-list elsewhere.
  if (!available.length) return calendar.hasAvailableSlots !== true;
  return available.some((slot) => new Date(slot.startsAt).getTime() <= start && new Date(slot.endsAt).getTime() >= end);
}
