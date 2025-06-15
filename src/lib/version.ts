
import { formatInTimeZone } from 'date-fns-tz';

// The commit hash is injected at build time via the VITE_GIT_COMMIT_HASH environment variable.
const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH || "dev";
const timeZone = 'America/Chicago';

const now = new Date();
const formattedDate = formatInTimeZone(now, timeZone, 'MM-dd-yyyy-HH:mm:ss-z');

export const appVersion = `${formattedDate}-${commitHash}`;
