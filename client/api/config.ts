/**
 * Client API Configuration
 * 
 * Configuration for client-side API calls and services
 */

import { APIBase, FetchClient } from '@ba-calderonmorales/clean-api';
import type { APIClient } from '@ba-calderonmorales/clean-api';

// API Base Configurations for Client
export const githubClientAPI = new APIBase();
export const supabaseClientAPI = new APIBase();
export const serverAPI = new APIBase();

// Default API Client with browser fetch
export const defaultClient: APIClient = new FetchClient();

// GitHub API Configuration (same as server but for client use)
githubClientAPI.setConfig('baseUrl', 'https://api.github.com');
githubClientAPI.setConfig('headers', {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'immersive-awe-canvas-client'
});

// Add GitHub routes
githubClientAPI.addRoute('releases', '/repos/BA-CalderonMorales/immersive-awe-canvas/releases');
githubClientAPI.addRoute('latestRelease', '/repos/BA-CalderonMorales/immersive-awe-canvas/releases/latest');

// Supabase REST API Configuration (for direct REST calls if needed)
supabaseClientAPI.setConfig('baseUrl', 'https://vpqadqhqphmtdkepvnet.supabase.co');
supabaseClientAPI.setConfig('headers', {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWFkcWhxcGhtdGRrZXB2bmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDg0OTMsImV4cCI6MjA2NTUyNDQ5M30.cxyPs3buUZsOMyhMiNr25RexN8MZL9QWBbUGX4--084'
});

// Server API Configuration (for internal server calls)
serverAPI.setConfig('baseUrl', process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '');
serverAPI.setConfig('headers', {
    'Content-Type': 'application/json'
});

// Add server routes
serverAPI.addRoute('version', '/api/version');
serverAPI.addRoute('logs', '/api/logs');

// Enhanced HTTP Client with error handling and retries
export class ClientAPIClient extends FetchClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private retries: number;

    constructor(
        baseUrl: string = '', 
        defaultHeaders: Record<string, string> = {},
        retries: number = 2
    ) {
        super();
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders;
        this.retries = retries;
    }

    async request<T = any>({
        url,
        method,
        data,
        headers = {}
    }: {
        url: string;
        method: string;
        data?: any;
        headers?: Record<string, string>;
    }): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
        const mergedHeaders = { ...this.defaultHeaders, ...headers };

        let lastError: Error;

        for (let attempt = 0; attempt <= this.retries; attempt++) {
            try {
                const response = await fetch(fullUrl, {
                    method,
                    headers: mergedHeaders,
                    body: data ? JSON.stringify(data) : undefined,
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return response.json();
            } catch (error) {
                lastError = error as Error;
                
                // Don't retry on client errors (4xx)
                if (error instanceof Error && error.message.includes('HTTP 4')) {
                    throw error;
                }

                // Wait before retry (exponential backoff)
                if (attempt < this.retries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }

        throw lastError!;
    }
}

// Create configured clients
export const githubClient = new ClientAPIClient(
    githubClientAPI.config.baseUrl,
    githubClientAPI.config.headers,
    1 // Only 1 retry for GitHub API
);

export const supabaseRestClient = new ClientAPIClient(
    supabaseClientAPI.config.baseUrl,
    supabaseClientAPI.config.headers,
    0 // No retries for Supabase (use Supabase client instead)
);

export const serverClient = new ClientAPIClient(
    serverAPI.config.baseUrl,
    serverAPI.config.headers,
    2 // 2 retries for server calls
);
