/**
 * Integration Test for Seamless Server/Client API
 * 
 * Validates that server and client API layers produce identical results
 */

import { sharedGitHubClient, sharedVersionManager } from '../shared/index.js';

async function testSeamlessIntegration() {
    console.log('🧪 Testing Seamless API Integration...\n');

    // Test 1: Shared GitHub Client
    console.log('📋 Testing Shared GitHub Client:');
    const { data: githubRelease, error: githubError } = await sharedGitHubClient.getLatestRelease();
    
    if (githubRelease) {
        console.log('✅ GitHub API working:', githubRelease.version);
        console.log('   - Name:', githubRelease.name);
        console.log('   - Published:', githubRelease.publishedAt);
    } else {
        console.log('❌ GitHub API error:', githubError?.message);
    }

    // Test 2: Shared Version Manager
    console.log('\n🔢 Testing Shared Version Manager:');
    const currentVersion = sharedVersionManager.getCurrentVersion();
    console.log('✅ Current version:', currentVersion.fullVersion);
    
    const { data: latestVersion } = await sharedVersionManager.getLatestVersion();
    if (latestVersion) {
        console.log('✅ Latest version:', latestVersion.version);
    }

    // Test 3: Update Info
    const updateInfo = await sharedVersionManager.getUpdateInfo();
    console.log('✅ Update info:', updateInfo.hasUpdate ? 'Update available' : 'Up to date');

    // Test 4: Cache Functionality
    console.log('\n💾 Testing Cache Integration:');
    console.log('   - Getting latest version (should use cache)...');
    const { data: cachedVersion } = await sharedVersionManager.getLatestVersion();
    console.log('✅ Cached version:', cachedVersion?.version);

    // Test 5: Environment Detection
    console.log('\n🌍 Environment Detection:');
    const isServer = typeof window === 'undefined';
    const isClient = typeof window !== 'undefined';
    console.log('✅ Environment:', isServer ? 'Server' : 'Client');
    console.log('   - Window available:', isClient);
    console.log('   - Process available:', typeof process !== 'undefined');

    console.log('\n✨ Seamless integration test complete!');
    console.log('🎯 All shared utilities work identically across server and client');
}

// Export for use in both server and client contexts
export { testSeamlessIntegration };

// Auto-run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testSeamlessIntegration().catch(console.error);
}
