import { describe, it, expect } from 'vitest';
import { isSecureUrl, sanitizeHtml, validateJsonInput } from '../security';

describe('security', () => {
  describe('isSecureUrl', () => {
    it('should allow HTTPS URLs', () => {
      expect(isSecureUrl('https://example.com')).toBe(true);
      expect(isSecureUrl('https://sub.example.com/path')).toBe(true);
    });

    it('should allow HTTP for localhost', () => {
      expect(isSecureUrl('http://localhost:3000')).toBe(true);
      expect(isSecureUrl('http://127.0.0.1:8080')).toBe(true);
    });

    it('should reject HTTP for external domains', () => {
      expect(isSecureUrl('http://example.com')).toBe(false);
      expect(isSecureUrl('http://malicious.site')).toBe(false);
    });

    it('should reject javascript and data URLs', () => {
      expect(isSecureUrl('javascript:alert(1)')).toBe(false);
      expect(isSecureUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(isSecureUrl('not-a-url')).toBe(false);
      expect(isSecureUrl('')).toBe(false);
      expect(isSecureUrl(null)).toBe(false);
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      const sanitized = sanitizeHtml(html);
      
      expect(sanitized).toContain('<p>Hello</p>');
      expect(sanitized).not.toContain('<script>');
    });

    it('should remove dangerous attributes', () => {
      const html = '<img src="image.jpg" onload="alert(1)" />';
      const sanitized = sanitizeHtml(html);
      
      expect(sanitized).not.toContain('onload');
    });

    it('should preserve safe HTML', () => {
      const html = '<p>Hello <strong>world</strong>!</p>';
      const sanitized = sanitizeHtml(html);
      
      expect(sanitized).toContain('<p>');
      expect(sanitized).toContain('<strong>');
    });
  });

  describe('validateJsonInput', () => {
    it('should validate proper JSON objects', () => {
      const validJson = { name: 'test', value: 123 };
      expect(validateJsonInput(validJson)).toBe(true);
    });

    it('should reject non-objects', () => {
      expect(validateJsonInput('string')).toBe(false);
      expect(validateJsonInput(123)).toBe(false);
      expect(validateJsonInput([])).toBe(false);
      expect(validateJsonInput(null)).toBe(false);
    });

    it('should reject objects with dangerous properties', () => {
      const dangerousJson = { 
        __proto__: { isAdmin: true },
        constructor: { prototype: {} }
      };
      expect(validateJsonInput(dangerousJson)).toBe(false);
    });

    it('should validate nested objects', () => {
      const nestedJson = {
        user: {
          name: 'test',
          settings: {
            theme: 'dark'
          }
        }
      };
      expect(validateJsonInput(nestedJson)).toBe(true);
    });
  });
});