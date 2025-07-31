#!/usr/bin/env tsx
/**
 * Test Runner Script
 *
 * Entry point for running all API tests from the unified testing module
 */

import { execSync } from "child_process";
import { resolve } from "path";

const testScript = resolve(__dirname, "tests", "run-api-tests.ts");

// Forward all arguments to the actual test runner
const args = process.argv.slice(2).join(" ");
const command = `npx tsx "${testScript}" ${args}`;

try {
    execSync(command, {
        stdio: "inherit",
        cwd: __dirname,
    });
} catch (error) {
    process.exit((error as any).status || 1);
}
