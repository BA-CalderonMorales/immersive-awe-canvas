/**
 * Supabase Edge Function Client
 * 
 * Client for interacting with Supabase Edge Functions using Clean API architecture
 */

import { API } from '@ba-calderonmorales/clean-api';
import { supabaseEdgeFunctionAPI, supabaseEdgeFunctionClient as configuredClient } from '../config.js';

// Create Edge Function API bucket
export const edgeFunctionsAPI = new API('edge-functions');

/**
 * Issue Creation Data Interface
 */
export interface IssueData {
    issueLocation: string;
    device: string[];
    inUS: 'yes' | 'no';
    frequency: 'always' | 'sometimes' | 'rarely';
    expectedBehavior: string;
    workaround?: string;
    canContact: 'yes' | 'no';
    email?: string;
}

/**
 * Edge Function Response Interface
 */
export interface EdgeFunctionResponse<T = any> {
    message?: string;
    error?: string;
    data?: T;
}

/**
 * Supabase Edge Function Client
 * Provides methods for interacting with Supabase Edge Functions
 */
export class SupabaseEdgeFunctionClient {
    /**
     * Create a GitHub issue via edge function
     */
    async createGithubIssue(issueData: IssueData, appVersion?: string): Promise<EdgeFunctionResponse> {
        try {
            const response = await configuredClient.request<EdgeFunctionResponse>({
                url: supabaseEdgeFunctionAPI.routes.createGithubIssue,
                method: 'POST',
                data: {
                    issueData,
                    appVersion: appVersion || 'unknown'
                }
            });

            return response;
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Failed to create GitHub issue'
            };
        }
    }

    /**
     * Process logs via edge function
     */
    async processLogs(logData: any): Promise<EdgeFunctionResponse> {
        try {
            const response = await configuredClient.request<EdgeFunctionResponse>({
                url: supabaseEdgeFunctionAPI.routes.processLogs,
                method: 'POST',
                data: logData
            });

            return response;
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Failed to process logs'
            };
        }
    }

    /**
     * Validate user via edge function
     */
    async validateUser(userData: any): Promise<EdgeFunctionResponse> {
        try {
            const response = await configuredClient.request<EdgeFunctionResponse>({
                url: supabaseEdgeFunctionAPI.routes.validateUser,
                method: 'POST',
                data: userData
            });

            return response;
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Failed to validate user'
            };
        }
    }
}

// Export pre-configured client instance
export const supabaseEdgeFunctionClient = new SupabaseEdgeFunctionClient();
