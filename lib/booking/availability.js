function startOfDay(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function buildSlotId(professionalSlug, startTime) {
  return `slot_${professionalSlug}_${startTime
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, '')
    .replace('T', '_')}`;
}

export function parseBookingDate(dateValue) {
  if (!dateValue) {
    return startOfDay(new Date());
  }

  const parsed = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return startOfDay(new Date());
  }

  return startOfDay(parsed);
}

export function getMonthDays(dateValue) {
  const current = startOfDay(dateValue);
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return {
    monthLabel: firstDay.toLocaleDateString('es-PE', {
      month: 'long',
      year: 'numeric',
    }),
    days: Array.from({ length: daysInMonth }).map((_, index) => {
      const value = new Date(year, month, index + 1);
      return {
        day: index + 1,
        value,
      };
    }),
  };
}

export function generateAvailableSlots(dateValue, professional, service) {
  const selectedDate = startOfDay(dateValue);
  const now = new Date();
  const hours = professional?.schedule?.[selectedDate.getDay()] || [];
  const durationMinutes = service?.durationMinutes || 40;

  return hours
    .map((hour) => {
      const startTime = new Date(selectedDate);
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + durationMinutes);

      return {
        id: buildSlotId(professional.slug, startTime),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        formattedTime: startTime.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    })
    .filter((slot) => new Date(slot.startTime).getTime() > now.getTime());
}
