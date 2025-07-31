/**
 * Test the new client API layer
 */

import { 
    clientVersionAPIClient, 
    clientGitHubAPIClient, 
    clientLoggingAPIClient,
    createAPIMigration 
} from './index';

async function testClientAPI() {
    console.log('🧪 Testing Client API Layer...\n');

    // Test Version API
    console.log('📋 Testing Version API:');
    const currentVersion = clientVersionAPIClient.getCurrentVersion();
    console.log('Current version:', currentVersion);

    const { data: latestVersion, error: versionError } = await clientVersionAPIClient.getLatestVersion();
    if (latestVersion) {
        console.log('Latest version from GitHub:', latestVersion.version);
    } else {
        console.log('Version error:', versionError?.message);
    }

    // Test Update Check
    const updateInfo = await clientVersionAPIClient.getUpdateInfo();
    console.log('Update info:', updateInfo);

    // Test GitHub API directly
    console.log('\n🐙 Testing GitHub API Client:');
    const { data: releases, error: releasesError } = await clientGitHubAPIClient.getReleases(3);
    if (releases) {
        console.log(`Found ${releases.length} releases:`, releases.map(r => r.version));
    } else {
        console.log('Releases error:', releasesError?.message);
    }

    // Test Logging API
    console.log('\n📝 Testing Logging API:');
    const { data: logResult, error: logError } = await clientLoggingAPIClient.logEvent({
        eventType: 'client_api_test',
        eventSource: 'test-script',
        metadata: {
            testTime: new Date().toISOString(),
            userAgent: navigator.userAgent,
            currentVersion: currentVersion.fullVersion
        }
    });

    if (logResult) {
        console.log('✅ Logging successful');
    } else {
        console.log('❌ Logging failed:', logError?.message);
    }

    // Test Migration Utilities
    console.log('\n🔄 Testing Migration Utilities:');
    const migration = createAPIMigration();
    migration.showMigrationGuide();

    // Test migration version utility
    const { data: migrationVersion } = await migration.version.fetchLatestRelease();
    console.log('Migration version test:', migrationVersion?.version);

    console.log('\n✨ Client API Layer test complete!');
}

// Export for use in browser console or test files
if (typeof window !== 'undefined') {
    (window as any).testClientAPI = testClientAPI;
    console.log('🚀 Client API test function available at: window.testClientAPI()');
}

export { testClientAPI };
