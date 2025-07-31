/**
 * API Test Configuration
 *
 * Configuration settings for the unified API testing module
 */

export interface TestConfig {
    // Test execution settings
    timeout: number;
    retries: number;
    parallel: boolean;

    // Test selection
    enabledSuites: string[];
    skipSlowTests: boolean;

    // Output settings
    verbose: boolean;
    exportResults: boolean;
    outputFormat: "console" | "json" | "xml";

    // API settings
    mockExternalCalls: boolean;
    testDataPath?: string;
}

export const defaultTestConfig: TestConfig = {
    // Execution
    timeout: 30000, // 30 seconds
    retries: 1,
    parallel: false,

    // Selection
    enabledSuites: [
        "Server Architecture",
        "Client Architecture",
        "Shared Utilities",
        "Seamless Integration",
        "Cross-Layer Consistency",
    ],
    skipSlowTests: false,

    // Output
    verbose: true,
    exportResults: false,
    outputFormat: "console",

    // API
    mockExternalCalls: false,
    testDataPath: undefined,
};

/**
 * Test environment detection
 */
export const testEnvironment = {
    isCI: process.env.CI === "true",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    hasInternet: true, // Will be detected at runtime
};

/**
 * Test data and expectations
 */
export const testExpectations = {
    // Version expectations
    minVersionComponents: 3, // e.g., "1.0.0" has 3 components
    versionPattern: /^v?\d+\.\d+\.\d+/,

    // Performance expectations
    maxApiResponseTime: 5000, // 5 seconds
    maxCacheAccessTime: 100, // 100ms

    // GitHub API expectations
    expectedRepoOwner: "BA-CalderonMorales",
    expectedRepoName: "immersive-awe-canvas",
    minReleaseCount: 1,

    // Logging expectations
    maxLogEventSize: 10000, // 10KB
    requiredLogFields: ["event_type", "created_at"],
};

/**
 * Mock data for testing
 */
export const mockTestData = {
    githubRelease: {
        tag_name: "v1.0.0",
        name: "Test Release",
        published_at: "2025-07-31T00:00:00Z",
        html_url:
            "https://github.com/BA-CalderonMorales/immersive-awe-canvas/releases/tag/v1.0.0",
        body: "Test release description",
    },
    versionInfo: {
        version: "v1.0.0",
        name: "Test Release",
        publishedAt: "7/31/2025",
        url: "https://github.com/BA-CalderonMorales/immersive-awe-canvas/releases/tag/v1.0.0",
        description: "Test release description",
        isLatest: true,
    },
    logEvent: {
        event_type: "test_event",
        event_source: "api_test",
        metadata: {
            test: true,
            timestamp: "2025-07-31T00:00:00.000Z",
        },
    },
};

/**
 * Test utilities
 */
export const testUtils = {
    /**
     * Wait for a specified time
     */
    sleep: (ms: number): Promise<void> =>
        new Promise(resolve => setTimeout(resolve, ms)),

    /**
     * Generate test metadata
     */
    generateTestMetadata: (testName: string) => ({
        testName,
        timestamp: new Date().toISOString(),
        environment: testEnvironment.isDevelopment
            ? "development"
            : "production",
        nodeVersion: process.version,
        platform: process.platform,
    }),

    /**
     * Validate version string format
     */
    isValidVersion: (version: string): boolean =>
        testExpectations.versionPattern.test(version),

    /**
     * Check if API response time is acceptable
     */
    isAcceptableResponseTime: (duration: number): boolean =>
        duration <= testExpectations.maxApiResponseTime,

    /**
     * Generate unique test ID
     */
    generateTestId: (): string =>
        `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
};
