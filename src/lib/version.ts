
import { formatInTimeZone } from 'date-fns-tz';

// Get version from package.json - this will be updated by semantic versioning
const packageVersion = "1.0.0"; // This gets updated automatically by our versioning system

// The commit hash is injected at build time via the VITE_GIT_COMMIT_HASH environment variable.
const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH || "dev";
const timeZone = 'America/Chicago';

const now = new Date();
const formattedDate = formatInTimeZone(now, timeZone, 'MM-dd-yyyy-HH:mm:ss-z');

// Semantic version format: MAJOR.MINOR.PATCH
export const appVersion = packageVersion;
export const buildInfo = `${formattedDate}-${commitHash}`;
export const fullVersion = `v${packageVersion} (${buildInfo})`;
