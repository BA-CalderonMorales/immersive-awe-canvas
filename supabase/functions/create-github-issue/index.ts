
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GITHUB_REPO = Deno.env.get('GITHUB_REPO'); // e.g., 'your-username/your-repo-name'
const GITHUB_ACCESS_TOKEN = Deno.env.get('GITHUB_ACCESS_TOKEN');

// Helper to send a response
const sendResponse = (body: any, status = 200) => {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey' },
    status,
  });
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return sendResponse({ message: 'ok' }, 200);
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  const logEvent = async (eventType: string, metadata: any) => {
    await supabaseClient.from('logs').insert({ event_type: eventType, event_source: 'edge-function-create-github-issue', metadata });
  };

  if (!GITHUB_REPO || !GITHUB_ACCESS_TOKEN) {
    const errorMsg = 'Missing GITHUB_REPO or GITHUB_ACCESS_TOKEN environment variables.';
    await logEvent('github_issue_submission_error', { error: errorMsg });
    return sendResponse({ error: errorMsg }, 500);
  }

  try {
    const { issueData, appVersion } = await req.json();

    const issueBody = `
**App Version:** ${appVersion}
**Issue Location:** ${issueData.issueLocation}
**Devices:** ${issueData.device.join(', ')}
**In U.S.?:** ${issueData.inUS}
**Frequency:** ${issueData.frequency}
---
**Expected Behavior:**
${issueData.expectedBehavior}
---
**Workaround (Optional):**
${issueData.workaround || 'Not provided.'}
---
**Contact Consent:** ${issueData.canContact}
**Contact Email:** ${issueData.canContact === 'yes' ? issueData.email : 'Not provided.'}
`;

    const issueTitle = `Bug: ${issueData.issueLocation}`;

    await logEvent('github_issue_submission_start', { repo: GITHUB_REPO, title: issueTitle });

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_ACCESS_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
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
      
      await logEvent('github_issue_submission_error', { error: errorDetail, status: response.status, response: responseData });
      return sendResponse({ error: errorDetail, details: responseData }, response.status);
    }

    await logEvent('github_issue_submission_success', { issueUrl: responseData.html_url });
    return sendResponse({ message: 'Issue created successfully!', issue: responseData });

  } catch (error) {
    await logEvent('github_issue_submission_error', { error: error.message, stack: error.stack });
    return sendResponse({ error: 'An unexpected error occurred.', details: error.message }, 500);
  }
});
