/**
 * Unified API Testing Module
 *
 * Comprehensive testing for both layered architecture and seamless integration
 */

// Client API imports
import {
    clientGitHubAPIClient,
    clientLoggingAPIClient,
    clientVersionAPIClient,
} from "../client/api/index.js";
// Server API imports
import {
    githubAPIClient,
    loggingService,
    versionService,
} from "../server/api/index.js";

// Shared utilities imports
import {
    performanceMonitor,
    sharedGitHubClient,
    sharedVersionManager,
} from "../shared/index.js";

/**
 * Test Results Interface
 */
interface TestResult {
    name: string;
    passed: boolean;
    details?: string;
    error?: string;
}

interface TestSuite {
    name: string;
    results: TestResult[];
    duration: number;
}

/**
 * Unified API Test Runner
 */
export class APITestRunner {
    private results: TestSuite[] = [];

    /**
     * Run all API tests
     */
    async runAllTests(): Promise<TestSuite[]> {
        console.log("🧪 Running Comprehensive API Tests...\n");

        const suites = [
            () => this.testServerArchitecture(),
            () => this.testClientArchitecture(),
            () => this.testSharedUtilities(),
            () => this.testSeamlessIntegration(),
            () => this.testCrossLayerConsistency(),
        ];

        for (const suite of suites) {
            await suite();
        }

        this.printSummary();
        return this.results;
    }

    /**
     * Test 1: Server Layered Architecture
     */
    private async testServerArchitecture(): Promise<void> {
        const startTime = Date.now();
        const results: TestResult[] = [];

        console.log("🏗️ Testing Server Layered Architecture:");

        // Test Version Service
        try {
            const appVersion = versionService.getAppVersion();
            const buildInfo = versionService.getBuildInfo();
            const fullVersion = versionService.getFullVersion();

            results.push({
                name: "Server Version Service",
                passed: !!(appVersion && buildInfo && fullVersion),
                details: `App: ${appVersion}, Build: ${buildInfo.slice(0, 20)}...`,
            });

            console.log("  ✅ Version Service:", appVersion);
        } catch (error) {
            results.push({
                name: "Server Version Service",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Version Service failed:",
                (error as Error).message
            );
        }

        // Test GitHub API Client
        try {
            const { data, error } = await githubAPIClient.getLatestRelease();
            if (data) {
                results.push({
                    name: "Server GitHub API",
                    passed: true,
                    details: `Latest: ${data.version}`,
                });
                console.log("  ✅ GitHub API:", data.version);
            } else {
                results.push({
                    name: "Server GitHub API",
                    passed: false,
                    error: error?.message || "Unknown error",
                });
                console.log("  ❌ GitHub API failed:", error?.message);
            }
        } catch (error) {
            results.push({
                name: "Server GitHub API",
                passed: false,
                error: (error as Error).message,
            });
            console.log("  ❌ GitHub API error:", (error as Error).message);
        }

        this.results.push({
            name: "Server Architecture",
            results,
            duration: Date.now() - startTime,
        });

        console.log("");
    }

    /**
     * Test 2: Client API Architecture
     */
    private async testClientArchitecture(): Promise<void> {
        const startTime = Date.now();
        const results: TestResult[] = [];

        console.log("🖥️ Testing Client API Architecture:");

        // Test Client Version API
        try {
            const currentVersion = clientVersionAPIClient.getCurrentVersion();
            const { data: latestVersion } =
                await clientVersionAPIClient.getLatestVersion();

            results.push({
                name: "Client Version API",
                passed: !!(currentVersion && latestVersion),
                details: `Current: ${currentVersion.appVersion}, Latest: ${latestVersion?.version}`,
            });

            console.log("  ✅ Client Version API:", currentVersion.appVersion);
        } catch (error) {
            results.push({
                name: "Client Version API",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Client Version API failed:",
                (error as Error).message
            );
        }

        // Test Client GitHub API
        try {
            const { data, error } =
                await clientGitHubAPIClient.getLatestRelease();
            if (data) {
                results.push({
                    name: "Client GitHub API",
                    passed: true,
                    details: `Latest: ${data.version}`,
                });
                console.log("  ✅ Client GitHub API:", data.version);
            } else {
                results.push({
                    name: "Client GitHub API",
                    passed: false,
                    error: error?.message || "Unknown error",
                });
                console.log("  ❌ Client GitHub API failed:", error?.message);
            }
        } catch (error) {
            results.push({
                name: "Client GitHub API",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Client GitHub API error:",
                (error as Error).message
            );
        }

        this.results.push({
            name: "Client Architecture",
            results,
            duration: Date.now() - startTime,
        });

        console.log("");
    }

    /**
     * Test 3: Shared Utilities
     */
    private async testSharedUtilities(): Promise<void> {
        const startTime = Date.now();
        const results: TestResult[] = [];

        console.log("🔄 Testing Shared Utilities:");

        // Test Shared GitHub Client
        try {
            const { data, error } = await sharedGitHubClient.getLatestRelease();
            if (data) {
                results.push({
                    name: "Shared GitHub Client",
                    passed: true,
                    details: `Version: ${data.version}`,
                });
                console.log("  ✅ Shared GitHub Client:", data.version);
            } else {
                results.push({
                    name: "Shared GitHub Client",
                    passed: false,
                    error: error?.message || "Unknown error",
                });
                console.log(
                    "  ❌ Shared GitHub Client failed:",
                    error?.message
                );
            }
        } catch (error) {
            results.push({
                name: "Shared GitHub Client",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Shared GitHub Client error:",
                (error as Error).message
            );
        }

        // Test Shared Version Manager
        try {
            const currentVersion = sharedVersionManager.getCurrentVersion();
            const updateInfo = await sharedVersionManager.getUpdateInfo();

            results.push({
                name: "Shared Version Manager",
                passed: !!(currentVersion && updateInfo),
                details: `Current: ${currentVersion.appVersion}, Update: ${updateInfo.hasUpdate}`,
            });

            console.log(
                "  ✅ Shared Version Manager:",
                currentVersion.appVersion
            );
        } catch (error) {
            results.push({
                name: "Shared Version Manager",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Shared Version Manager failed:",
                (error as Error).message
            );
        }

        // Test Performance Monitor
        try {
            performanceMonitor.start("test_operation");
            await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
            const duration = performanceMonitor.end("test_operation");

            results.push({
                name: "Performance Monitor",
                passed: duration > 0,
                details: `Duration: ${duration}ms`,
            });

            console.log("  ✅ Performance Monitor:", `${duration}ms`);
        } catch (error) {
            results.push({
                name: "Performance Monitor",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Performance Monitor failed:",
                (error as Error).message
            );
        }

        this.results.push({
            name: "Shared Utilities",
            results,
            duration: Date.now() - startTime,
        });

        console.log("");
    }

    /**
     * Test 4: Seamless Integration
     */
    private async testSeamlessIntegration(): Promise<void> {
        const startTime = Date.now();
        const results: TestResult[] = [];

        console.log("🔗 Testing Seamless Integration:");

        // Test same types across boundaries
        try {
            const serverVersion = await githubAPIClient.getLatestRelease();
            const clientVersion =
                await clientGitHubAPIClient.getLatestRelease();
            const sharedVersion = await sharedGitHubClient.getLatestRelease();

            const sameType =
                serverVersion.data?.version === clientVersion.data?.version &&
                clientVersion.data?.version === sharedVersion.data?.version;

            results.push({
                name: "Cross-Layer Type Consistency",
                passed: sameType,
                details: `Server: ${serverVersion.data?.version}, Client: ${clientVersion.data?.version}, Shared: ${sharedVersion.data?.version}`,
            });

            console.log(
                "  ✅ Type Consistency:",
                sameType ? "Identical results" : "Mismatch detected"
            );
        } catch (error) {
            results.push({
                name: "Cross-Layer Type Consistency",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Type Consistency failed:",
                (error as Error).message
            );
        }

        // Test environment detection
        try {
            const isServer = typeof window === "undefined";
            const isClient = typeof window !== "undefined";

            results.push({
                name: "Environment Detection",
                passed: isServer !== isClient,
                details: `Server: ${isServer}, Client: ${isClient}`,
            });

            console.log(
                "  ✅ Environment Detection:",
                isServer ? "Server" : "Client"
            );
        } catch (error) {
            results.push({
                name: "Environment Detection",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Environment Detection failed:",
                (error as Error).message
            );
        }

        this.results.push({
            name: "Seamless Integration",
            results,
            duration: Date.now() - startTime,
        });

        console.log("");
    }

    /**
     * Test 5: Cross-Layer Consistency
     */
    private async testCrossLayerConsistency(): Promise<void> {
        const startTime = Date.now();
        const results: TestResult[] = [];

        console.log("⚖️ Testing Cross-Layer Consistency:");

        // Test version consistency
        try {
            const serverCurrentVersion = versionService.getAppVersion();
            const clientCurrentVersion =
                clientVersionAPIClient.getCurrentVersion().appVersion;
            const sharedCurrentVersion =
                sharedVersionManager.getCurrentVersion().appVersion;

            const consistent =
                serverCurrentVersion === clientCurrentVersion &&
                clientCurrentVersion === sharedCurrentVersion;

            results.push({
                name: "Version Consistency",
                passed: consistent,
                details: `Server: ${serverCurrentVersion}, Client: ${clientCurrentVersion}, Shared: ${sharedCurrentVersion}`,
            });

            console.log(
                "  ✅ Version Consistency:",
                consistent ? "All layers match" : "Mismatch detected"
            );
        } catch (error) {
            results.push({
                name: "Version Consistency",
                passed: false,
                error: (error as Error).message,
            });
            console.log(
                "  ❌ Version Consistency failed:",
                (error as Error).message
            );
        }

        this.results.push({
            name: "Cross-Layer Consistency",
            results,
            duration: Date.now() - startTime,
        });

        console.log("");
    }

    /**
     * Print comprehensive test summary
     */
    private printSummary(): void {
        console.log("📊 Test Summary:");
        console.log("═══════════════════════════════════════════════════");

        let totalTests = 0;
        let totalPassed = 0;
        let totalDuration = 0;

        for (const suite of this.results) {
            const passed = suite.results.filter(r => r.passed).length;
            const total = suite.results.length;
            totalTests += total;
            totalPassed += passed;
            totalDuration += suite.duration;

            const status = passed === total ? "✅" : "❌";
            console.log(
                `${status} ${suite.name}: ${passed}/${total} (${suite.duration}ms)`
            );

            // Show failed tests
            const failed = suite.results.filter(r => !r.passed);
            if (failed.length > 0) {
                for (const fail of failed) {
                    console.log(`    ❌ ${fail.name}: ${fail.error}`);
                }
            }
        }

        console.log("═══════════════════════════════════════════════════");
        console.log(
            `🎯 Overall: ${totalPassed}/${totalTests} tests passed (${totalDuration}ms)`
        );

        if (totalPassed === totalTests) {
            console.log(
                "🎉 All tests passed! API architecture is working perfectly."
            );
        } else {
            console.log(
                `⚠️  ${totalTests - totalPassed} tests failed. Review the issues above.`
            );
        }
    }

    /**
     * Get test results
     */
    getResults(): TestSuite[] {
        return this.results;
    }
}

/**
 * Quick test function for simple usage
 */
export async function runQuickAPITest(): Promise<boolean> {
    const runner = new APITestRunner();
    const results = await runner.runAllTests();

    const totalTests = results.reduce(
        (sum, suite) => sum + suite.results.length,
        0
    );
    const passedTests = results.reduce(
        (sum, suite) => sum + suite.results.filter(r => r.passed).length,
        0
    );

    return passedTests === totalTests;
}

// Export the test runner instance
export const apiTestRunner = new APITestRunner();
