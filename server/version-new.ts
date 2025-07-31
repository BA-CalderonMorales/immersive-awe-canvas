/**
 * Updated Version Module using Clean API Architecture
 * 
 * This replaces the old version.ts with the new layered approach
 */

// Re-export everything from the new API layer for backward compatibility
export { versionService, versionController } from './api';
export type { VersionInfo } from './api/clients/github-client';

// Legacy exports for backward compatibility
export const getDynamicVersionInfo = async () => {
    const { versionService } = await import('./api');
    return versionService.getDynamicVersionInfo();
};

export const clearVersionCache = () => {
    const versionService = require('./api').versionService;
    versionService.clearVersionCache();
};

// Export the new structured approach
export const appVersion = (() => {
    const versionService = require('./api').versionService;
    return versionService.getAppVersion();
})();

export const buildInfo = (() => {
    const versionService = require('./api').versionService;
    return versionService.getBuildInfo();
})();

export const fullVersion = (() => {
    const versionService = require('./api').versionService;
    return versionService.getFullVersion();
})();
