/** Validate JSON at display boundaries. Missing money stays unavailable, never zero. */
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Unexpected response from the server.');
  return value as Record<string, unknown>;
}
export function rows(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) throw new Error('Expected a list from the server.');
  return value.map(object);
}
export function amount(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const number = typeof value === 'number' ? value : typeof value === 'string' && /^-?\d+$/.test(value) ? Number(value) : NaN;
  return Number.isSafeInteger(number) ? number : null;
}
export function label(value: unknown, fallback = 'Unavailable'): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}
