/**
 * Enhanced GitHub Issue Creation Edge Function using Clean API Architecture
 *
 * This example shows how to integrate the clean-api structure with your existing
 * Supabase edge function for creating GitHub issues.
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import clean-api components (would need to be adapted for Deno)
// For now, we'll implement similar patterns locally

/**
 * Clean API inspired configuration management
 */
class EdgeFunctionAPIBase {
    private routes: Map<string, string> = new Map();
    private config: Map<string, any> = new Map();

    addRoute(name: string, path: string): void {
        this.routes.set(name, path);
    }

    setConfig(key: string, value: any): void {
        this.config.set(key, value);
    }

    getRoute(name: string): string | undefined {
        return this.routes.get(name);
    }

    getConfig(key: string): any {
        return this.config.get(key);
    }
}

/**
 * Enhanced API Client with retry logic and error handling
 */
class EdgeFunctionAPIClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private retries: number;

    constructor(
        baseUrl: string,
        headers: Record<string, string> = {},
        retries = 3
    ) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = headers;
        this.retries = retries;
    }

    async request<T>(options: {
        url: string;
        method: string;
        data?: any;
        headers?: Record<string, string>;
    }): Promise<T> {
        const url = options.url.startsWith("http")
            ? options.url
            : `${this.baseUrl}${options.url}`;

        const config = {
            method: options.method,
            headers: {
                ...this.defaultHeaders,
                ...options.headers,
            },
            body: options.data ? JSON.stringify(options.data) : undefined,
        };

        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= this.retries; attempt++) {
            try {
                const response = await fetch(url, config);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        `HTTP ${response.status}: ${errorData.message || response.statusText}`
                    );
                }

                const data = await response.json();
                return data as T;
            } catch (error) {
                lastError =
                    error instanceof Error ? error : new Error("Unknown error");

                if (attempt === this.retries) {
                    break;
                }

                // Wait before retry with exponential backoff
                await new Promise(resolve =>
                    setTimeout(resolve, 2 ** attempt * 1000)
                );
            }
        }

        throw lastError || new Error("Network error after retries");
    }
}

// Environment configuration
const GITHUB_REPO = Deno.env.get("GITHUB_REPO");
const GITHUB_ACCESS_TOKEN = Deno.env.get("GITHUB_ACCESS_TOKEN");

// Set up Clean API inspired configuration
const apiBase = new EdgeFunctionAPIBase();
apiBase.addRoute("githubIssues", `/repos/${GITHUB_REPO}/issues`);
apiBase.setConfig("maxRequests", 3);
apiBase.setConfig("windowMs", 300000); // 5 minutes

const githubClient = new EdgeFunctionAPIClient("https://api.github.com", {
    "Content-Type": "application/json",
    Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Supabase-Edge-Function",
});

// Rate limiting (simple in-memory implementation)
const rateLimiter = new Map<string, number[]>();

const isRateLimited = (identifier: string): boolean => {
    const now = Date.now();
    const maxRequests = apiBase.getConfig("maxRequests");
    const windowMs = apiBase.getConfig("windowMs");
    const requests = rateLimiter.get(identifier) || [];

    // Remove expired requests
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
        return true;
    }

    validRequests.push(now);
    rateLimiter.set(identifier, validRequests);
    return false;
};

// Input sanitization following clean-api patterns
const sanitizeInput = (input: string): string => {
    if (typeof input !== "string") return "";
    return input
        .trim()
        .slice(0, 10000) // Limit length
        .replace(/[<>]/g, "") // Remove potential HTML tags
        .replace(/javascript:/gi, "") // Remove javascript: protocols
        .replace(/data:/gi, ""); // Remove data: protocols
};

// Validation following clean-api patterns
interface IssueValidationResult {
    isValid: boolean;
    errors: string[];
}

const validateIssueData = (data: any): IssueValidationResult => {
    const errors: string[] = [];

    if (!data || typeof data !== "object") {
        return { isValid: false, errors: ["Invalid issue data format"] };
    }

    if (!data.issueLocation || data.issueLocation.length < 3) {
        errors.push("Issue location must be at least 3 characters");
    }

    if (!Array.isArray(data.device) || data.device.length === 0) {
        errors.push("At least one device must be selected");
    }

    if (!data.expectedBehavior || data.expectedBehavior.length < 10) {
        errors.push("Expected behavior must be at least 10 characters");
    }

    if (!["yes", "no"].includes(data.inUS)) {
        errors.push('inUS must be either "yes" or "no"');
    }

    if (!["always", "sometimes", "rarely"].includes(data.frequency)) {
        errors.push('Frequency must be "always", "sometimes", or "rarely"');
    }

    if (!["yes", "no"].includes(data.canContact)) {
        errors.push('canContact must be either "yes" or "no"');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Security headers
const getSecurityHeaders = () => ({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
});

// Helper to send a response with security headers
const sendResponse = (body: Record<string, unknown>, status = 200) => {
    return new Response(JSON.stringify(body), {
        headers: getSecurityHeaders(),
        status,
    });
};

serve(async req => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: getSecurityHeaders() });
    }

    // Rate limiting check
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(clientIP)) {
        return sendResponse(
            {
                error: "Rate limit exceeded. Please try again later.",
            },
            429
        );
    }

    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: { Authorization: req.headers.get("Authorization")! },
            },
        }
    );

    const logEvent = async (
        eventType: string,
        metadata: Record<string, unknown>
    ) => {
        const sanitizedMetadata = {
            ...metadata,
            clientIP: clientIP.slice(0, 50),
        };

        await supabaseClient.from("logs").insert({
            event_type: eventType,
            event_source: "edge-function-create-github-issue-enhanced",
            metadata: sanitizedMetadata,
        });
    };

    if (!GITHUB_REPO || !GITHUB_ACCESS_TOKEN) {
        const errorMsg =
            "Missing GITHUB_REPO or GITHUB_ACCESS_TOKEN environment variables.";
        await logEvent("github_issue_submission_error", { error: errorMsg });
        return sendResponse({ error: errorMsg }, 500);
    }

    try {
        const requestBody = await req.json();
        const { issueData, appVersion } = requestBody;

        // Validate using clean-api inspired validation
        const validation = validateIssueData(issueData);
        if (!validation.isValid) {
            await logEvent("github_issue_validation_error", {
                errors: validation.errors,
            });
            return sendResponse(
                {
                    error: "Validation failed",
                    details: validation.errors,
                },
                400
            );
        }

        // Sanitize input data
        const sanitizedIssueData = {
            issueLocation: sanitizeInput(issueData.issueLocation || ""),
            device: Array.isArray(issueData.device)
                ? issueData.device.slice(0, 10).map(sanitizeInput)
                : [],
            inUS: ["yes", "no"].includes(issueData.inUS)
                ? issueData.inUS
                : "no",
            frequency: ["always", "sometimes", "rarely"].includes(
                issueData.frequency
            )
                ? issueData.frequency
                : "sometimes",
            expectedBehavior: sanitizeInput(issueData.expectedBehavior || ""),
            workaround: sanitizeInput(issueData.workaround || ""),
            canContact: ["yes", "no"].includes(issueData.canContact)
                ? issueData.canContact
                : "no",
            email:
                issueData.canContact === "yes"
                    ? sanitizeInput(issueData.email || "")
                    : "",
        };

        const sanitizedAppVersion = sanitizeInput(appVersion || "unknown");

        // Create issue body
        const issueBody = `
**App Version:** ${sanitizedAppVersion}
**Issue Location:** ${sanitizedIssueData.issueLocation}
**Devices:** ${sanitizedIssueData.device.join(", ")}
**In U.S.?:** ${sanitizedIssueData.inUS}
**Frequency:** ${sanitizedIssueData.frequency}
---
**Expected Behavior:**
${sanitizedIssueData.expectedBehavior}
---
**Workaround (Optional):**
${sanitizedIssueData.workaround || "Not provided."}
---
**Contact Consent:** ${sanitizedIssueData.canContact}
**Contact Email:** ${sanitizedIssueData.canContact === "yes" ? sanitizedIssueData.email : "Not provided."}
`;

        const issueTitle = `Bug: ${sanitizedIssueData.issueLocation.slice(0, 100)}`;

        await logEvent("github_issue_submission_start", {
            repo: GITHUB_REPO,
            title: issueTitle.slice(0, 200),
        });

        // Use clean-api inspired client for GitHub API call
        const githubIssueUrl = apiBase.getRoute("githubIssues");
        if (!githubIssueUrl) {
            throw new Error("GitHub issues route not configured");
        }

        const responseData = await githubClient.request<any>({
            url: githubIssueUrl,
            method: "POST",
            data: {
                title: issueTitle,
                body: issueBody,
                labels: ["bug-report"],
            },
        });

        await logEvent("github_issue_submission_success", {
            issueUrl: responseData.html_url?.slice(0, 500),
        });

        return sendResponse({
            message: "Issue created successfully!",
            issue: {
                html_url: responseData.html_url,
                number: responseData.number,
                title: responseData.title,
            },
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        await logEvent("github_issue_submission_error", {
            error: errorMessage.slice(0, 500),
        });

        return sendResponse(
            {
                error: "An unexpected error occurred.",
                details: errorMessage.slice(0, 200),
            },
            500
        );
    }
});
