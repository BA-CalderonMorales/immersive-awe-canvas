import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function normalizeHexColor(hex: string): string {
    const sanitized = hex.replace("#", "");
    if (sanitized.length === 3) {
        return `#${sanitized[0]}${sanitized[0]}${sanitized[1]}${sanitized[1]}${sanitized[2]}${sanitized[2]}`;
    }
    return hex.startsWith("#") ? hex : `#${sanitized}`;
}

export function lightenColor(hex: string, amount: number): string {
    const normalized = normalizeHexColor(hex).replace("#", "");
    const num = parseInt(normalized, 16);
    const r = Math.min(
        255,
        Math.round((num >> 16) + (255 - (num >> 16)) * amount)
    );
    const g = Math.min(
        255,
        Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount)
    );
    const b = Math.min(
        255,
        Math.round((num & 0xff) + (255 - (num & 0xff)) * amount)
    );
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function darkenColor(hex: string, amount: number): string {
    const normalized = normalizeHexColor(hex).replace("#", "");
    const num = parseInt(normalized, 16);
    const r = Math.max(0, Math.round((num >> 16) * (1 - amount)));
    const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)));
    const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function isHexColor(value: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

export function getContrastingTextColor(hex: string): string {
    const normalized = normalizeHexColor(hex).replace("#", "");
    const r = parseInt(
        normalized.length === 3
            ? normalized[0] + normalized[0]
            : normalized.slice(0, 2),
        16
    );
    const g = parseInt(
        normalized.length === 3
            ? normalized[1] + normalized[1]
            : normalized.slice(2, 4),
        16
    );
    const b = parseInt(
        normalized.length === 3
            ? normalized[2] + normalized[2]
            : normalized.slice(4, 6),
        16
    );
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
}
