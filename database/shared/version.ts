/**
 * Version Management and Compatibility Utilities
 * @module DatabaseVersion
 * @description Provides version tracking, compatibility checks, and migration utilities
 */

import { Logger, LogLevel } from "./logger";

const logger = Logger.getInstance();

/**
 * Represents a semantic version
 */
interface SemanticVersion {
    major: number;
    minor: number;
    patch: number;
}

/**
 * Parse a version string into a SemanticVersion object
 * @param version - Version string (e.g., "1.2.3")
 * @returns Parsed SemanticVersion or null if invalid
 */
export function parseVersion(version: string): SemanticVersion | null {
    const versionRegex = /^(\d+)\.(\d+)\.(\d+)$/;
    const match = version.match(versionRegex);

    if (!match) {
        logger.warn("Invalid version format", { version });
        return null;
    }

    return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10),
    };
}

/**
 * Compare two versions to determine their relationship
 * @param v1 - First version string
 * @param v2 - Second version string
 * @returns -1 if v1 < v2, 0 if v1 = v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
    const version1 = parseVersion(v1);
    const version2 = parseVersion(v2);

    if (!version1 || !version2) {
        throw new Error("Invalid version strings");
    }

    if (version1.major !== version2.major) {
        return version1.major - version2.major;
    }

    if (version1.minor !== version2.minor) {
        return version1.minor - version2.minor;
    }

    return version1.patch - version2.patch;
}

/**
 * Check if a version is compatible with a minimum required version
 * @param currentVersion - Current version string
 * @param minVersion - Minimum required version string
 * @returns Boolean indicating compatibility
 */
export function isVersionCompatible(
    currentVersion: string,
    minVersion: string
): boolean {
    try {
        return compareVersions(currentVersion, minVersion) >= 0;
    } catch (error) {
        logger.error("Version compatibility check failed", {
            currentVersion,
            minVersion,
            error: (error as Error).message,
        });
        return false;
    }
}

/**
 * Get the next version based on version bump type
 * @param currentVersion - Current version string
 * @param bumpType - Type of version bump (major, minor, patch)
 * @returns New version string
 */
export function bumpVersion(
    currentVersion: string,
    bumpType: "major" | "minor" | "patch" = "patch"
): string {
    const version = parseVersion(currentVersion);

    if (!version) {
        throw new Error("Invalid current version");
    }

    switch (bumpType) {
        case "major":
            version.major++;
            version.minor = 0;
            version.patch = 0;
            break;
        case "minor":
            version.minor++;
            version.patch = 0;
            break;
        case "patch":
            version.patch++;
            break;
    }

    return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * Application version information
 */
export const VERSION = {
    current: "1.0.0",
    minimumCompatible: "0.8.0",
};
