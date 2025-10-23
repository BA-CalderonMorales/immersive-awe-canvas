/**
 * Simple date utilities to replace date-fns dependencies
 * Lightweight alternatives for our specific use cases
 */

/**
 * Format a date as a relative time string (e.g., "2 hours ago", "3 days ago")
 * Replaces date-fns formatDistanceToNow
 */
export function formatDistanceToNow(
    date: Date | string | number,
    options?: { addSuffix?: boolean }
): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    const suffix = options?.addSuffix !== false ? ' ago' : '';

    if (diffSec < 60) return `${diffSec} seconds${suffix}`;
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'}${suffix}`;
    if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'}${suffix}`;
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'}${suffix}`;
    if (diffWeek < 4) return `${diffWeek} week${diffWeek === 1 ? '' : 's'}${suffix}`;
    if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? '' : 's'}${suffix}`;
    return `${diffYear} year${diffYear === 1 ? '' : 's'}${suffix}`;
}

/**
 * Format a date with timezone
 * Replaces date-fns-tz formatInTimeZone
 */
export function formatInTimeZone(
    date: Date,
    _timeZone: string,
    format: string
): string {
    // For build timestamps, we don't need actual timezone conversion
    // Just format the date in local time
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');

    // Support format: "MM-dd-yyyy-HH:mm:ss-z"
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    // Simple timezone offset
    const offset = -d.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMins = Math.abs(offset) % 60;
    const tz = `UTC${offset >= 0 ? '+' : '-'}${offsetHours}${offsetMins > 0 ? ':' + pad(offsetMins) : ''}`;

    return format
        .replace('MM', month)
        .replace('dd', day)
        .replace('yyyy', String(year))
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
        .replace('z', tz);
}
