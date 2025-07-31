/**
 * Tests Module
 * 
 * Unified testing module for API architecture validation
 */

// Main test runner
export * from './api-test-runner.js';

// Test configuration
export * from './test-config.js';

// Legacy test functions (for backward compatibility)
export { testArchitecture } from './test-architecture.js';
export { testSeamlessIntegration } from './test-seamless-integration.js';

// Re-export for convenience
export { APITestRunner, runQuickAPITest } from './api-test-runner.js';
export { defaultTestConfig, testUtils, testExpectations } from './test-config.js';
