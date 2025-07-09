
// Content Security Policy configuration
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite development
    "'unsafe-eval'", // Required for Vite development
    "https://7daa6ad6-54c4-4480-958a-77ea132d52ab.lovableproject.com",
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled components
    "https://fonts.googleapis.com",
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
  ],
  'connect-src': [
    "'self'",
    "https://vpqadqhqphmtdkepvnet.supabase.co",
    "https://api.github.com",
  ],
  'worker-src': ["'self'", "blob:"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

export const generateCSPHeader = (): string => {
  return Object.entries(CSP_POLICY)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Security headers for API responses
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': generateCSPHeader(),
});

// Rate limiting utility (simple in-memory implementation)
class RateLimiter {
  private requests = new Map<string, number[]>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 5, windowMs = 60000) { // 5 requests per minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove expired requests
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    // Clean up old entries periodically
    if (Math.random() < 0.1) {
      this.cleanup();
    }
    
    return true;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < this.windowMs);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Input sanitization for logs
export const sanitizeLogData = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return data.slice(0, 1000).replace(/[<>]/g, '');
  }
  
  if (Array.isArray(data)) {
    return data.slice(0, 100).map(sanitizeLogData);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.length > 100) continue; // Skip overly long keys
      sanitized[key.slice(0, 100)] = sanitizeLogData(value);
    }
    return sanitized;
  }
  
  return data;
};
