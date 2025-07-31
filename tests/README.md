# API Testing Module

A comprehensive testing module that unifies and validates both the layered architecture and seamless integration of server and client API layers.

## 🎯 Purpose

This module combines the functionality of both previous test files:
- **test-architecture.ts** - Server layered architecture testing
- **test-seamless-integration.ts** - Cross-layer integration testing

Into a single, comprehensive testing system that validates the entire API ecosystem.

## 🏗️ Architecture

```
tests/
├── index.ts                       # Module exports
├── api-test-runner.ts             # Main unified test runner class
├── test-config.ts                 # Configuration and utilities
├── run-api-tests.ts               # Test execution script
├── test-architecture.ts           # Legacy server architecture test
├── test-seamless-integration.ts   # Legacy integration test
└── README.md                      # This documentation
```

## 🧪 Test Suites

### 1. **Server Architecture** 🏗️
Tests the server-side layered API components:
- Version Service (`getAppVersion`, `getBuildInfo`, `getFullVersion`)
- GitHub API Client (server-side)
- Logging Service (server-side)

### 2. **Client Architecture** 🖥️
Tests the client-side API layer:
- Client Version API Client
- Client GitHub API Client  
- Client Logging API Client

### 3. **Shared Utilities** 🔄
Tests the shared cross-layer utilities:
- Shared GitHub Client
- Shared Version Manager
- Performance Monitor

### 4. **Seamless Integration** 🔗
Tests server/client interface consistency:
- Cross-layer type consistency
- Environment detection
- Same method signatures and results

### 5. **Cross-Layer Consistency** ⚖️
Tests data consistency across all layers:
- Version consistency between server/client/shared
- Configuration consistency
- Error handling consistency

## 🚀 Usage

### Quick Start

```bash
# Using npm/bun scripts (recommended)
npm run test:api                   # Run all comprehensive tests
npm run test:api:quick            # Quick validation only  
npm run test:api:export           # Export results to JSON
npm run test:architecture         # Run legacy architecture test only
npm run test:integration          # Run legacy integration test only

# Direct execution (if you prefer)
npx tsx tests/run-api-tests.ts                # Run all tests
npx tsx tests/run-api-tests.ts --quick        # Quick validation only
npx tsx tests/run-api-tests.ts --export       # Export results to JSON
npx tsx tests/run-api-tests.ts --help         # Show help
```

### Programmatic Usage

```typescript
import { APITestRunner, runQuickAPITest } from './tests';

// Option 1: Simple boolean result
const allPassed = await runQuickAPITest();
console.log('All tests passed:', allPassed);

// Option 2: Detailed test runner
const runner = new APITestRunner();
const results = await runner.runAllTests();

// Access detailed results
for (const suite of results) {
    console.log(`${suite.name}: ${suite.results.length} tests, ${suite.duration}ms`);
    
    const failed = suite.results.filter(r => !r.passed);
    if (failed.length > 0) {
        console.log('Failed tests:', failed.map(f => f.name));
    }
}
```

### Custom Configuration

```typescript
import { APITestRunner, defaultTestConfig } from './tests';

// Customize test configuration
const customConfig = {
    ...defaultTestConfig,
    timeout: 60000,           // 60 seconds
    enabledSuites: [          // Only run specific suites
        'Server Architecture',
        'Seamless Integration'
    ],
    verbose: false,           // Minimal output
    mockExternalCalls: true   // Mock GitHub API calls
};

const runner = new APITestRunner();
// runner.setConfig(customConfig); // If implemented
const results = await runner.runAllTests();
```

## 📊 Test Results

### Result Structure

```typescript
interface TestResult {
    name: string;        // Test name
    passed: boolean;     // Pass/fail status
    details?: string;    // Additional details
    error?: string;      // Error message if failed
}

interface TestSuite {
    name: string;           // Suite name
    results: TestResult[];  // Individual test results
    duration: number;       // Execution time in ms
}
```

### Sample Output

```
🧪 Running Comprehensive API Tests...

🏗️ Testing Server Layered Architecture:
  ✅ Version Service: 1.0.0
  ✅ GitHub API: v4.0.2

🖥️ Testing Client API Architecture:
  ✅ Client Version API: 1.0.0
  ✅ Client GitHub API: v4.0.2

🔄 Testing Shared Utilities:
  ✅ Shared GitHub Client: v4.0.2
  ✅ Shared Version Manager: 1.0.0
  ✅ Performance Monitor: 12ms

🔗 Testing Seamless Integration:
  ✅ Type Consistency: Identical results
  ✅ Environment Detection: Server

⚖️ Testing Cross-Layer Consistency:
  ✅ Version Consistency: All layers match

📊 Test Summary:
═══════════════════════════════════════════════════
✅ Server Architecture: 2/2 (145ms)
✅ Client Architecture: 2/2 (238ms)
✅ Shared Utilities: 3/3 (156ms)
✅ Seamless Integration: 2/2 (89ms)
✅ Cross-Layer Consistency: 1/1 (23ms)
═══════════════════════════════════════════════════
🎯 Overall: 10/10 tests passed (651ms)
🎉 All tests passed! API architecture is working perfectly.
```

## 🔧 Configuration Options

### Test Execution
- `timeout`: Maximum time per test (default: 30s)
- `retries`: Number of retry attempts (default: 1)
- `parallel`: Run tests in parallel (default: false)

### Test Selection
- `enabledSuites`: Which test suites to run
- `skipSlowTests`: Skip performance-intensive tests

### Output
- `verbose`: Detailed output (default: true)
- `exportResults`: Export to JSON file
- `outputFormat`: console, json, or xml

### API Settings
- `mockExternalCalls`: Mock GitHub API calls for offline testing
- `testDataPath`: Path to test data files

## 🎯 Key Differences from Original Files

| Feature | **test-architecture.ts** | **test-seamless-integration.ts** | **New Unified Module** |
|---------|---------------------------|-----------------------------------|-------------------------|
| **Scope** | Server-only testing | Shared utilities only | **Complete ecosystem** |
| **Structure** | Simple function | Simple function | **Class-based with suites** |
| **Results** | Console output only | Console output only | **Structured results + export** |
| **Configuration** | Hardcoded | Hardcoded | **Configurable** |
| **Error Handling** | Basic try/catch | Basic try/catch | **Detailed error tracking** |
| **Performance** | No timing | Basic timing | **Per-suite timing** |
| **Extensibility** | Not extensible | Not extensible | **Modular and extensible** |

## 🚀 Benefits of Unified Module

1. **Comprehensive Coverage**: Tests entire API ecosystem in one run
2. **Structured Results**: Detailed, exportable test results
3. **Configuration**: Customizable test execution
4. **Performance Tracking**: Per-suite execution timing
5. **Error Analysis**: Detailed error reporting and analysis
6. **CI/CD Ready**: JSON export for automated systems
7. **Maintainable**: Single source of truth for all API testing
8. **Extensible**: Easy to add new test suites

## 🔄 Migration Path

### From test-architecture.ts:
```typescript
// Old approach
import { versionService, loggingService, githubAPIClient } from './server/api';
await testArchitecture();

// New approach  
import { APITestRunner } from './tests';
const runner = new APITestRunner();
await runner.runAllTests(); // Includes server architecture + more
```

### From test-seamless-integration.ts:
```typescript
// Old approach
import { sharedGitHubClient, sharedVersionManager } from './shared';
await testSeamlessIntegration();

// New approach
import { runQuickAPITest } from './tests';
const allPassed = await runQuickAPITest(); // Includes integration + more
```

The unified testing module provides a comprehensive, maintainable, and extensible solution for validating your entire API architecture while maintaining all the functionality of both original test files.
