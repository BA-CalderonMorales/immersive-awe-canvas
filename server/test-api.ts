/**
 * Test the new layered API architecture
 */

import { versionController, loggingController } from './api';

async function testAPI() {
    console.log('Testing Version Controller...');
    const version = await versionController.getVersion();
    console.log('Version result:', version);

    console.log('Testing Logging Controller...');
    const logResult = await loggingController.logEvent({
        eventType: 'test_event',
        eventSource: 'api_test',
        metadata: { test: true }
    });
    console.log('Log result:', logResult);
}

testAPI().catch(console.error);
