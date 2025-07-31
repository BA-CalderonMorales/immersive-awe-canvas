/**
 * Shared Security Utilities for Database Operations
 * @module DatabaseSecurity
 * @description Provides common security utilities and validation functions
 */

import { isDefined, isValidString } from "./typeguards";

/**
 * Sanitize a string by removing potential malicious content
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: unknown): string {
    if (!isValidString(input)) {
        return "";
    }

    // Remove HTML tags
    const sanitizedInput = input.replace(/<[^>]*>?/gm, "");

    // Remove potential SQL injection characters
    return sanitizedInput.replace(/['";\\]/g, "");
}

/**
 * Validate email address format
 * @param email - The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: unknown): boolean {
    if (!isValidString(email)) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Mask sensitive data for logging or display
 * @param data - The data to mask
 * @param visibleChars - Number of characters to leave unmasked at the end
 * @returns Masked data
 */
export function maskSensitiveData(data: unknown, visibleChars = 4): string {
    if (!isValidString(data)) {
        return "[INVALID DATA]";
    }

    if (data.length <= visibleChars) {
        return data;
    }

    const maskedPart = "*".repeat(data.length - visibleChars);
    return `${maskedPart}${data.slice(-visibleChars)}`;
}

/**
 * Generate a cryptographically secure random string
 * @param length - Length of the random string
 * @returns Randomly generated secure string
 */
export function generateSecureRandomString(length = 32): string {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
        .map(x => charset[x % charset.length])
        .join("");
}

/**
 * Secure comparison function to prevent timing attacks
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns Boolean indicating if strings are equal
 */
export function secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}
