import { formatInTimeZone } from "date-fns-tz";
import { getVersionInfo, type VersionInfo } from "@utils/github-api";

// Re-export types for external use
export type { VersionInfo } from "@utils/github-api";

// Get version from package.json - this will be updated by semantic versioning
const packageVersion = "1.0.0"; // This gets updated automatically by our versioning system

// The commit hash is injected at build time via the VITE_GIT_COMMIT_HASH environment variable.
const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH || "dev";
const timeZone = "America/Chicago";

const now = new Date();
const formattedDate = formatInTimeZone(now, timeZone, "MM-dd-yyyy-HH:mm:ss-z");

// Semantic version format: MAJOR.MINOR.PATCH
export const appVersion = packageVersion;
export const buildInfo = `${formattedDate}-${commitHash}`;
export const fullVersion = `v${packageVersion} (${buildInfo})`;

// Dynamic version info from GitHub API
let cachedVersionInfo: VersionInfo | null = null;
let versionInfoPromise: Promise<VersionInfo> | null = null;

/**
 * Gets the latest version information from GitHub API with caching
 * @returns Promise<VersionInfo> - Latest version info with fallback
 */
export const getDynamicVersionInfo = async (): Promise<VersionInfo> => {
    // Return cached version if available
    if (cachedVersionInfo) {
        return cachedVersionInfo;
    }

    // Return existing promise if already fetching
    if (versionInfoPromise) {
        return versionInfoPromise;
    }

    // Create new promise and cache it
    versionInfoPromise = getVersionInfo()
        .then(versionInfo => {
            cachedVersionInfo = versionInfo;
            return versionInfo;
        })
        .catch(() => {
            // Fallback on error
            const fallbackInfo: VersionInfo = {
                version: `v${packageVersion}`,
                name: `Version ${packageVersion}`,
                publishedAt: "Local Build",
                url: "https://github.com/BA-CalderonMorales/immersive-awe-canvas",
                description: "Local development version",
                isLatest: false,
            };
            cachedVersionInfo = fallbackInfo;
            return fallbackInfo;
        });

    return versionInfoPromise;
};

/**
 * Clears the version cache to force a fresh fetch
 */
export const clearVersionCache = (): void => {
    cachedVersionInfo = null;
    versionInfoPromise = null;
};
