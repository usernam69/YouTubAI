export function fmt(t: number): string {
  if (!isFinite(t) || t < 0) t = 0;
  const s = Math.floor(t % 60);
  const m = Math.floor((t / 60) % 60);
  const h = Math.floor(t / 3600);
  const p = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${p(m)}:${p(s)}` : `${m}:${p(s)}`;
}

export function fmtLong(t: number): string {
  if (!isFinite(t) || t < 0) t = 0;
  const total = Math.round(t);
  const m = Math.round(total / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h} hr ${rem} min` : `${h} hr`;
}

export function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}

export function pct(n: number, d: number): number {
  return d > 0 ? clamp((n / d) * 100, 0, 100) : 0;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}