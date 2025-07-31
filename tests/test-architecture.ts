/**
 * Simple Test for Clean API Architecture
 * 
 * This demonstrates that the new layered architecture is working
 */

import { versionService, loggingService, githubAPIClient } from '../server/api';

async function testArchitecture() {
    console.log('🧪 Testing Clean API Architecture...\n');

    // Test 1: Version Service
    console.log('📦 Testing Version Service:');
    console.log('  App Version:', versionService.getAppVersion());
    console.log('  Build Info:', versionService.getBuildInfo());
    console.log('  Full Version:', versionService.getFullVersion());
    
    // Test 2: GitHub API Client
    console.log('\n🐙 Testing GitHub API Client:');
    try {
        const { data, error } = await githubAPIClient.getLatestRelease();
        if (data) {
            console.log('  Latest Release:', data.version);
            console.log('  Published:', data.publishedAt);
        } else if (error) {
            console.log('  Error:', error.message);
        }
    } catch (err) {
        console.log('  Error:', err);
    }

    // Test 3: Logging Service
    console.log('\n📝 Testing Logging Service:');
    try {
        const { data, error } = await loggingService.logEvent({
            eventType: 'test_event',
            eventSource: 'architecture_test',
            metadata: {
                test: true,
                timestamp: new Date().toISOString(),
                architecture: 'clean-api'
            }
        });
        
        if (data) {
            console.log('  Log created successfully');
        } else if (error) {
            console.log('  Logging error:', error.message);
        }
    } catch (err) {
        console.log('  Logging error:', err);
    }

    console.log('\n✅ Architecture test complete!');
}

// Export for use in other modules
export { testArchitecture };

// Run the test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testArchitecture().catch(console.error);
}
