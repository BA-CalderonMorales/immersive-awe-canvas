/**
 * Database API Configuration
 * 
 * Configuration for database-related API calls and services
 */

import { APIBase, FetchClient } from '@ba-calderonmorales/clean-api';
import type { APIClient } from '@ba-calderonmorales/clean-api';

// API Base Configurations for Database Operations
export const supabaseEdgeFunctionAPI = new APIBase();
export const supabaseRestAPI = new APIBase();
export const githubIntegrationAPI = new APIBase();
export const databaseLoggingAPI = new APIBase();

// Default API Client for database operations
export const databaseClient: APIClient = new FetchClient();

// Environment variables (should be set in your environment)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vpqadqhqphmtdkepvnet.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWFkcWhxcGhtdGRrZXB2bmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDg0OTMsImV4cCI6MjA2NTUyNDQ5M30.cxyPs3buUZsOMyhMiNr25RexN8MZL9QWBbUGX4--084';
const GITHUB_REPO = process.env.GITHUB_REPO || 'BA-CalderonMorales/immersive-awe-canvas';

// Supabase Edge Functions Configuration
supabaseEdgeFunctionAPI.setConfig('baseUrl', `${SUPABASE_URL}/functions/v1`);
supabaseEdgeFunctionAPI.setConfig('headers', {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY
});

// Add Edge Function routes
supabaseEdgeFunctionAPI.addRoute('createGithubIssue', '/create-github-issue');
supabaseEdgeFunctionAPI.addRoute('processLogs', '/process-logs');
supabaseEdgeFunctionAPI.addRoute('validateUser', '/validate-user');

// Supabase REST API Configuration
supabaseRestAPI.setConfig('baseUrl', `${SUPABASE_URL}/rest/v1`);
supabaseRestAPI.setConfig('headers', {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY,
    'Prefer': 'return=representation'
});

// Add REST API routes
supabaseRestAPI.addRoute('logs', '/logs');
supabaseRestAPI.addRoute('users', '/users');
supabaseRestAPI.addRoute('sessions', '/sessions');
supabaseRestAPI.addRoute('analytics', '/analytics');

// GitHub Integration API Configuration
githubIntegrationAPI.setConfig('baseUrl', 'https://api.github.com');
githubIntegrationAPI.setConfig('headers', {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'immersive-awe-canvas-database'
});

// Add GitHub routes
githubIntegrationAPI.addRoute('createIssue', `/repos/${GITHUB_REPO}/issues`);
githubIntegrationAPI.addRoute('getIssues', `/repos/${GITHUB_REPO}/issues`);
githubIntegrationAPI.addRoute('getReleases', `/repos/${GITHUB_REPO}/releases`);

// Database Logging API Configuration
databaseLoggingAPI.setConfig('baseUrl', `${SUPABASE_URL}/rest/v1`);
databaseLoggingAPI.setConfig('headers', {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY
});

// Add logging routes
databaseLoggingAPI.addRoute('createLog', '/logs');
databaseLoggingAPI.addRoute('getLogs', '/logs');
databaseLoggingAPI.addRoute('updateLog', '/logs');

// Enhanced Database API Client with error handling and security
export class DatabaseAPIClient extends FetchClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private retries: number;

    constructor(baseUrl: string, headers: Record<string, string> = {}, retries = 3) {
        super();
        this.baseUrl = baseUrl;
        this.defaultHeaders = headers;
        this.retries = retries;
    }

    async request<T>({ url, method, data }: { url: string; method: string; data?: any }): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
        
        const config = {
            method,
            headers: {
                ...this.defaultHeaders
            },
            body: data ? JSON.stringify(data) : undefined
        };

        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= this.retries; attempt++) {
            try {
                const response = await fetch(fullUrl, config);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const responseData = await response.json();
                return responseData as T;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                
                if (attempt === this.retries) {
                    break;
                }
                
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }

        throw lastError || new Error('Network error after retries');
    }
}

// Pre-configured clients for easy use
export const supabaseEdgeFunctionClient = new DatabaseAPIClient(
    supabaseEdgeFunctionAPI.config.baseUrl as string,
    supabaseEdgeFunctionAPI.config.headers as Record<string, string>
);

export const supabaseRestClient = new DatabaseAPIClient(
    supabaseRestAPI.config.baseUrl as string,
    supabaseRestAPI.config.headers as Record<string, string>
);

export const githubIntegrationClientInstance = new DatabaseAPIClient(
    githubIntegrationAPI.config.baseUrl as string,
    githubIntegrationAPI.config.headers as Record<string, string>
);
