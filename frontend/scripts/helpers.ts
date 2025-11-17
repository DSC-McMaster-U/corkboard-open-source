export function formatEventDateTime(iso?: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const date = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(d);
    const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(d);
    return `${date} • ${time}`;
  }