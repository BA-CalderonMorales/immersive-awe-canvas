/**
 * Execute Unified API Tests
 * 
 * Simple script to run all API tests using the unified testing module
 */

import { APITestRunner, runQuickAPITest } from './api-test-runner.js';

async function main() {
    console.log('🚀 Starting Unified API Testing...\n');

    try {
        // Option 1: Quick test
        if (process.argv.includes('--quick')) {
            console.log('⚡ Running quick test...\n');
            const allPassed = await runQuickAPITest();
            process.exit(allPassed ? 0 : 1);
        }

        // Option 2: Full comprehensive test
        const runner = new APITestRunner();
        const results = await runner.runAllTests();

        // Additional analysis
        console.log('\n🔍 Detailed Analysis:');
        for (const suite of results) {
            const failedTests = suite.results.filter(r => !r.passed);
            const passedTests = suite.results.filter(r => r.passed);
            
            if (failedTests.length === 0) {
                console.log(`✅ ${suite.name}: All ${passedTests.length} tests passed`);
            } else {
                console.log(`❌ ${suite.name}: ${failedTests.length} failures, ${passedTests.length} passed`);
                for (const failed of failedTests) {
                    console.log(`   - ${failed.name}: ${failed.error}`);
                }
            }
        }

        // Export results for CI/CD
        if (process.argv.includes('--export')) {
            const fs = await import('fs/promises');
            await fs.writeFile(
                'test-results.json', 
                JSON.stringify(results, null, 2)
            );
            console.log('📁 Results exported to test-results.json');
        }

        // Determine exit code
        const totalTests = results.reduce((sum, suite) => sum + suite.results.length, 0);
        const passedTests = results.reduce((sum, suite) => 
            sum + suite.results.filter(r => r.passed).length, 0);
        
        process.exit(passedTests === totalTests ? 0 : 1);

    } catch (error) {
        console.error('💥 Test execution failed:', error);
        process.exit(1);
    }
}

// Help message
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
🧪 Unified API Test Runner

Usage:
  npx tsx run-api-tests.ts                 # Run full comprehensive tests
  npx tsx run-api-tests.ts --quick         # Run quick validation only
  npx tsx run-api-tests.ts --export        # Export results to JSON
  npx tsx run-api-tests.ts --help          # Show this help

Test Suites:
  🏗️  Server Architecture     - Tests server layered API components
  🖥️  Client Architecture     - Tests client API layer
  🔄 Shared Utilities        - Tests shared cross-layer utilities  
  🔗 Seamless Integration    - Tests server/client interface consistency
  ⚖️  Cross-Layer Consistency - Tests data consistency across layers

Exit Codes:
  0 - All tests passed
  1 - Some tests failed or execution error
`);
    process.exit(0);
}

// Run tests
main().catch(console.error);
