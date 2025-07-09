
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GITHUB_REPO = Deno.env.get('GITHUB_REPO');
const GITHUB_ACCESS_TOKEN = Deno.env.get('GITHUB_ACCESS_TOKEN');

// Rate limiting (simple in-memory implementation)
const rateLimiter = new Map<string, number[]>();
const MAX_REQUESTS = 3; // 3 requests per window
const WINDOW_MS = 300000; // 5 minutes

const isRateLimited = (identifier: string): boolean => {
  const now = Date.now();
  const requests = rateLimiter.get(identifier) || [];
  
  // Remove expired requests
  const validRequests = requests.filter(time => now - time < WINDOW_MS);
  
  if (validRequests.length >= MAX_REQUESTS) {
    return true;
  }
  
  validRequests.push(now);
  rateLimiter.set(identifier, validRequests);
  return false;
};

// Input sanitization
const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, 10000) // Limit length
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, ''); // Remove data: protocols
};

// Security headers
const getSecurityHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
});

// Helper to send a response with security headers
const sendResponse = (body: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(body), { 
    headers: getSecurityHeaders(), 
    status 
  });
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getSecurityHeaders() });
  }

  // Rate limiting check
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(clientIP)) {
    return sendResponse({ 
      error: 'Rate limit exceeded. Please try again later.' 
    }, 429);
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  const logEvent = async (eventType: string, metadata: Record<string, unknown>) => {
    // Sanitize metadata before logging
    const sanitizedMetadata = {
      ...metadata,
      clientIP: clientIP.slice(0, 50), // Limit IP length
    };
    
    await supabaseClient.from('logs').insert({ 
      event_type: eventType, 
      event_source: 'edge-function-create-github-issue', 
      metadata: sanitizedMetadata 
    });
  };

  if (!GITHUB_REPO || !GITHUB_ACCESS_TOKEN) {
    const errorMsg = 'Missing GITHUB_REPO or GITHUB_ACCESS_TOKEN environment variables.';
    await logEvent('github_issue_submission_error', { error: errorMsg });
    return sendResponse({ error: errorMsg }, 500);
  }

  try {
    const requestBody = await req.json();
    const { issueData, appVersion } = requestBody;

    // Input validation and sanitization
    if (!issueData || typeof issueData !== 'object') {
      return sendResponse({ error: 'Invalid issue data format' }, 400);
    }

    const sanitizedIssueData = {
      issueLocation: sanitizeInput(issueData.issueLocation || ''),
      device: Array.isArray(issueData.device) ? issueData.device.slice(0, 10).map(sanitizeInput) : [],
      inUS: ['yes', 'no'].includes(issueData.inUS) ? issueData.inUS : 'no',
      frequency: ['always', 'sometimes', 'rarely'].includes(issueData.frequency) ? issueData.frequency : 'sometimes',
      expectedBehavior: sanitizeInput(issueData.expectedBehavior || ''),
      workaround: sanitizeInput(issueData.workaround || ''),
      canContact: ['yes', 'no'].includes(issueData.canContact) ? issueData.canContact : 'no',
      email: issueData.canContact === 'yes' ? sanitizeInput(issueData.email || '') : '',
    };

    // Basic validation
    if (!sanitizedIssueData.issueLocation || sanitizedIssueData.issueLocation.length < 3) {
      return sendResponse({ error: 'Issue location must be at least 3 characters' }, 400);
    }

    if (!sanitizedIssueData.expectedBehavior || sanitizedIssueData.expectedBehavior.length < 10) {
      return sendResponse({ error: 'Expected behavior must be at least 10 characters' }, 400);
    }

    if (sanitizedIssueData.device.length === 0) {
      return sendResponse({ error: 'At least one device must be selected' }, 400);
    }

    const sanitizedAppVersion = sanitizeInput(appVersion || 'unknown');

    const issueBody = `
**App Version:** ${sanitizedAppVersion}
**Issue Location:** ${sanitizedIssueData.issueLocation}
**Devices:** ${sanitizedIssueData.device.join(', ')}
**In U.S.?:** ${sanitizedIssueData.inUS}
**Frequency:** ${sanitizedIssueData.frequency}
---
**Expected Behavior:**
${sanitizedIssueData.expectedBehavior}
---
**Workaround (Optional):**
${sanitizedIssueData.workaround || 'Not provided.'}
---
**Contact Consent:** ${sanitizedIssueData.canContact}
**Contact Email:** ${sanitizedIssueData.canContact === 'yes' ? sanitizedIssueData.email : 'Not provided.'}
`;

    const issueTitle = `Bug: ${sanitizedIssueData.issueLocation.slice(0, 100)}`;

    await logEvent('github_issue_submission_start', { 
      repo: GITHUB_REPO, 
      title: issueTitle.slice(0, 200) 
    });

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_ACCESS_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Supabase-Edge-Function',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['bug-report'],
      }),
    });
    
    const responseData = await response.json();

    if (!response.ok) {
      let errorDetail = 'Failed to create GitHub issue.';
      if (response.status === 404) {
        errorDetail = 'Repository not found. Ensure GITHUB_REPO is correct and your token has access.';
      } else if (response.status === 401) {
        errorDetail = 'Authentication failed. Check your GITHUB_ACCESS_TOKEN.';
      } else {
        errorDetail = responseData.message || 'An unknown error occurred.';
      }
      
      await logEvent('github_issue_submission_error', { 
        error: errorDetail.slice(0, 500), 
        status: response.status 
      });
      return sendResponse({ error: errorDetail }, response.status);
    }

    await logEvent('github_issue_submission_success', { 
      issueUrl: responseData.html_url?.slice(0, 500) 
    });
    return sendResponse({ 
      message: 'Issue created successfully!', 
      issue: { 
        html_url: responseData.html_url,
        number: responseData.number,
        title: responseData.title 
      } 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logEvent('github_issue_submission_error', { 
      error: errorMessage.slice(0, 500) 
    });
    return sendResponse({ 
      error: 'An unexpected error occurred.', 
      details: errorMessage.slice(0, 200) 
    }, 500);
  }
});
