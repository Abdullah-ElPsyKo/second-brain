const API_URL = "http://localhost:3000/api/captures";

export async function removeCapture(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

export function formatRelativeTime(date: string): string {
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return "Unknown date";

  const seconds = Math.round((timestamp - Date.now()) / 1000);
  if (Math.abs(seconds) < 45) return "just now";

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
  ];

  let value = seconds;
  for (const [threshold, unit] of units) {
    if (Math.abs(value) < threshold) {
      return formatter.format(Math.round(value), unit);
    }
    value /= threshold;
  }

  return formatter.format(Math.round(value), "year");
}
