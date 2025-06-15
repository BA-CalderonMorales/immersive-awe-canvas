
import { formatInTimeZone } from 'date-fns-tz';

// This is a placeholder commit hash. In a real CI/CD pipeline, this would be dynamically generated.
const commitHash = "e4a9c2d"; 
const timeZone = 'America/Chicago';

const now = new Date();
const formattedDate = formatInTimeZone(now, timeZone, 'MM-dd-yyyy-HH:mm:ss-z');

export const appVersion = `${formattedDate}-${commitHash}`;
