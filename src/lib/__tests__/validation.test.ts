import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateColorString } from '../validation';

describe('validation', () => {
  describe('sanitizeInput', () => {
    it('should remove dangerous characters from input', () => {
      const dangerous = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(dangerous);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
    });

    it('should preserve safe characters', () => {
      const safe = 'Hello World 123!';
      const sanitized = sanitizeInput(safe);
      
      expect(sanitized).toBe(safe);
    });

    it('should handle empty and null inputs', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should trim whitespace', () => {
      const input = '  hello world  ';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('hello world');
    });
  });

  describe('validateColorString', () => {
    it('should validate hex colors', () => {
      expect(validateColorString('#ff0000')).toBe(true);
      expect(validateColorString('#FF0000')).toBe(true);
      expect(validateColorString('#f00')).toBe(true);
      expect(validateColorString('#123abc')).toBe(true);
    });

    it('should validate rgb colors', () => {
      expect(validateColorString('rgb(255, 0, 0)')).toBe(true);
      expect(validateColorString('rgb(0,255,0)')).toBe(true);
      expect(validateColorString('rgb(100, 200, 50)')).toBe(true);
    });

    it('should validate rgba colors', () => {
      expect(validateColorString('rgba(255, 0, 0, 0.5)')).toBe(true);
      expect(validateColorString('rgba(0,255,0,1)')).toBe(true);
      expect(validateColorString('rgba(100, 200, 50, 0.8)')).toBe(true);
    });

    it('should validate hsl colors', () => {
      expect(validateColorString('hsl(360, 100%, 50%)')).toBe(true);
      expect(validateColorString('hsl(180,50%,25%)')).toBe(true);
      expect(validateColorString('hsl(0, 0%, 100%)')).toBe(true);
    });

    it('should validate named colors', () => {
      expect(validateColorString('red')).toBe(true);
      expect(validateColorString('blue')).toBe(true);
      expect(validateColorString('transparent')).toBe(true);
      expect(validateColorString('cornflowerblue')).toBe(true);
    });

    it('should reject invalid colors', () => {
      expect(validateColorString('#gg0000')).toBe(false);
      expect(validateColorString('rgb(256, 0, 0)')).toBe(false);
      expect(validateColorString('hsl(400, 100%, 50%)')).toBe(false);
      expect(validateColorString('notacolor')).toBe(false);
      expect(validateColorString('')).toBe(false);
      expect(validateColorString(null)).toBe(false);
    });
  });
});