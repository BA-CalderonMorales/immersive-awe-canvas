/**
 * Tests Module
 *
 * Unified testing module for API architecture validation
 */

// Main test runner
export * from "./api-test-runner.js";
// Re-export for convenience
export { APITestRunner, runQuickAPITest } from "./api-test-runner.js";

// Legacy test functions (for backward compatibility)
export { testArchitecture } from "./test-architecture.js";
// Test configuration
export * from "./test-config.js";
export {
    defaultTestConfig,
    testExpectations,
    testUtils,
} from "./test-config.js";
export { testSeamlessIntegration } from "./test-seamless-integration.js";
