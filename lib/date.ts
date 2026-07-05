export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
