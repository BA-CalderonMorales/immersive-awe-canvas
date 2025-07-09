import { formatInTimeZone } from 'date-fns-tz';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
}

export interface VersionInfo {
  version: string;
  name: string;
  publishedAt: string;
  url: string;
  description: string;
  isLatest: boolean;
}

const GITHUB_REPO = 'BA-CalderonMorales/immersive-awe-canvas';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetches the latest release information from GitHub API
 * @returns Promise<VersionInfo | null> - Latest release info or null if failed
 */
export const fetchLatestRelease = async (): Promise<VersionInfo | null> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'immersive-awe-canvas'
      }
    });

    if (!response.ok) {
      console.warn('Failed to fetch latest release:', response.status, response.statusText);
      return null;
    }

    const release: GitHubRelease = await response.json();
    
    return {
      version: release.tag_name,
      name: release.name || release.tag_name,
      publishedAt: formatInTimeZone(
        new Date(release.published_at), 
        'America/Chicago', 
        'MMM dd, yyyy'
      ),
      url: release.html_url,
      description: release.body || '',
      isLatest: true
    };
  } catch (error) {
    console.warn('Error fetching latest release:', error);
    return null;
  }
};

/**
 * Fetches all releases from GitHub API
 * @param limit - Maximum number of releases to fetch (default: 10)
 * @returns Promise<VersionInfo[]> - Array of release info
 */
export const fetchReleases = async (limit: number = 10): Promise<VersionInfo[]> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO}/releases?per_page=${limit}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'immersive-awe-canvas'
      }
    });

    if (!response.ok) {
      console.warn('Failed to fetch releases:', response.status, response.statusText);
      return [];
    }

    const releases: GitHubRelease[] = await response.json();
    
    return releases.map((release, index) => ({
      version: release.tag_name,
      name: release.name || release.tag_name,
      publishedAt: formatInTimeZone(
        new Date(release.published_at), 
        'America/Chicago', 
        'MMM dd, yyyy'
      ),
      url: release.html_url,
      description: release.body || '',
      isLatest: index === 0
    }));
  } catch (error) {
    console.warn('Error fetching releases:', error);
    return [];
  }
};

/**
 * Gets version info with fallback to package.json version
 * @returns Promise<VersionInfo> - Version info with fallback
 */
export const getVersionInfo = async (): Promise<VersionInfo> => {
  const fallbackVersion = "1.0.0"; // This should match package.json
  
  const latestRelease = await fetchLatestRelease();
  
  if (latestRelease) {
    return latestRelease;
  }

  // Fallback version info
  return {
    version: `v${fallbackVersion}`,
    name: `Version ${fallbackVersion}`,
    publishedAt: 'Local Build',
    url: `https://github.com/${GITHUB_REPO}`,
    description: 'Local development version',
    isLatest: false
  };
};
