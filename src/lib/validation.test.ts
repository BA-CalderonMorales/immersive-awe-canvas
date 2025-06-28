import { describe, it, expect } from 'vitest';
import { sanitizeText, validateEmail } from './validation';
import { isValidHexColor } from './utils';

describe('validation utilities', () => {
  it('sanitizes text by removing tags and limiting length', () => {
    const input = '<script>alert(1)</script>'.repeat(10);
    const sanitized = sanitizeText(input);
    expect(sanitized.includes('<')).toBe(false);
    expect(sanitized.length).toBeLessThanOrEqual(10000);
  });

  it('validates email addresses correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('bad-email')).toBe(false);
  });

  it('checks for valid hex color strings', () => {
    expect(isValidHexColor('#fff')).toBe(true);
    expect(isValidHexColor('#abcdef')).toBe(true);
    expect(isValidHexColor('#123abz')).toBe(false);
    expect(isValidHexColor('red')).toBe(false);
  });
});
