/**
 * Database API Validation Utilities
 *
 * Validation functions specific to database API operations
 */

import { isValidString, isDefined } from "../../shared/typeguards.js";
import { isValidEmail } from "../../shared/security.js";

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Issue data validation
 */
export interface IssueValidationData {
    issueLocation: string;
    device: string[];
    inUS: "yes" | "no";
    frequency: "always" | "sometimes" | "rarely";
    expectedBehavior: string;
    workaround?: string;
    canContact: "yes" | "no";
    email?: string;
}

/**
 * Validate issue data for GitHub issue creation
 */
export function validateIssueData(data: any): ValidationResult {
    const errors: string[] = [];

    // Check if data exists and is an object
    if (!data || typeof data !== "object") {
        return { isValid: false, errors: ["Invalid issue data format"] };
    }

    // Validate required fields
    if (!isValidString(data.issueLocation)) {
        errors.push("Issue location is required");
    } else if (data.issueLocation.length < 3) {
        errors.push("Issue location must be at least 3 characters");
    }

    if (!Array.isArray(data.device) || data.device.length === 0) {
        errors.push("At least one device must be selected");
    } else {
        const invalidDevices = data.device.filter(
            (device: any) => !isValidString(device)
        );
        if (invalidDevices.length > 0) {
            errors.push("All device entries must be valid strings");
        }
    }

    if (!["yes", "no"].includes(data.inUS)) {
        errors.push('inUS must be either "yes" or "no"');
    }

    if (!["always", "sometimes", "rarely"].includes(data.frequency)) {
        errors.push('Frequency must be "always", "sometimes", or "rarely"');
    }

    if (!isValidString(data.expectedBehavior)) {
        errors.push("Expected behavior is required");
    } else if (data.expectedBehavior.length < 10) {
        errors.push("Expected behavior must be at least 10 characters");
    }

    if (!["yes", "no"].includes(data.canContact)) {
        errors.push('canContact must be either "yes" or "no"');
    }

    // Validate email if contact is allowed
    if (data.canContact === "yes") {
        if (!isValidString(data.email)) {
            errors.push("Email is required when contact is permitted");
        } else if (!isValidEmail(data.email)) {
            errors.push("Invalid email format");
        }
    }

    // Validate optional workaround
    if (isDefined(data.workaround) && !isValidString(data.workaround)) {
        errors.push("Workaround must be a valid string if provided");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate log entry data
 */
export interface LogEntryValidationData {
    event_type: string;
    event_source: string;
    metadata?: Record<string, any>;
}

/**
 * Validate log entry data
 */
export function validateLogEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== "object") {
        return { isValid: false, errors: ["Invalid log entry data format"] };
    }

    if (!isValidString(data.event_type)) {
        errors.push("Event type is required and must be a string");
    }

    if (!isValidString(data.event_source)) {
        errors.push("Event source is required and must be a string");
    }

    if (
        isDefined(data.metadata) &&
        (typeof data.metadata !== "object" || Array.isArray(data.metadata))
    ) {
        errors.push("Metadata must be an object if provided");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate user data
 */
export interface UserValidationData {
    email?: string;
    [key: string]: any;
}

/**
 * Validate user data
 */
export function validateUserData(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== "object") {
        return { isValid: false, errors: ["Invalid user data format"] };
    }

    if (isDefined(data.email)) {
        if (!isValidString(data.email)) {
            errors.push("Email must be a valid string if provided");
        } else if (!isValidEmail(data.email)) {
            errors.push("Invalid email format");
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate pagination parameters
 */
export interface PaginationParams {
    page?: number;
    per_page?: number;
    limit?: number;
    offset?: number;
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(params: any): ValidationResult {
    const errors: string[] = [];

    if (!params || typeof params !== "object") {
        return { isValid: true, errors: [] }; // Pagination is optional
    }

    if (isDefined(params.page)) {
        if (!Number.isInteger(params.page) || params.page < 1) {
            errors.push("Page must be a positive integer");
        }
    }

    if (isDefined(params.per_page)) {
        if (
            !Number.isInteger(params.per_page) ||
            params.per_page < 1 ||
            params.per_page > 100
        ) {
            errors.push("Per page must be an integer between 1 and 100");
        }
    }

    if (isDefined(params.limit)) {
        if (
            !Number.isInteger(params.limit) ||
            params.limit < 1 ||
            params.limit > 1000
        ) {
            errors.push("Limit must be an integer between 1 and 1000");
        }
    }

    if (isDefined(params.offset)) {
        if (!Number.isInteger(params.offset) || params.offset < 0) {
            errors.push("Offset must be a non-negative integer");
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate API request headers
 */
export function validateHeaders(headers: any): ValidationResult {
    const errors: string[] = [];

    if (headers && typeof headers !== "object") {
        return { isValid: false, errors: ["Headers must be an object"] };
    }

    // Check for common security headers
    if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
            if (typeof value !== "string") {
                errors.push(`Header '${key}' must be a string`);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate GitHub issue data
 */
export interface GitHubIssueValidationData {
    title: string;
    body: string;
    labels?: string[];
}

/**
 * Validate GitHub issue data
 */
export function validateGitHubIssueData(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== "object") {
        return { isValid: false, errors: ["Invalid GitHub issue data format"] };
    }

    if (!isValidString(data.title)) {
        errors.push("Issue title is required");
    } else if (data.title.length < 5) {
        errors.push("Issue title must be at least 5 characters");
    } else if (data.title.length > 256) {
        errors.push("Issue title must be less than 256 characters");
    }

    if (!isValidString(data.body)) {
        errors.push("Issue body is required");
    } else if (data.body.length < 10) {
        errors.push("Issue body must be at least 10 characters");
    }

    if (isDefined(data.labels)) {
        if (!Array.isArray(data.labels)) {
            errors.push("Labels must be an array if provided");
        } else {
            const invalidLabels = data.labels.filter(
                (label: any) => !isValidString(label)
            );
            if (invalidLabels.length > 0) {
                errors.push("All labels must be valid strings");
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
