import { describe, it, expect } from 'vitest';
import { formatKeyCombo, isValidKeyCombo, parseKeyCombo } from '../keyboardUtils';

describe('keyboardUtils', () => {
  describe('formatKeyCombo', () => {
    it('should format single key', () => {
      expect(formatKeyCombo(['a'])).toBe('A');
      expect(formatKeyCombo(['Enter'])).toBe('Enter');
    });

    it('should format key combinations', () => {
      expect(formatKeyCombo(['ctrl', 'a'])).toBe('Ctrl+A');
      expect(formatKeyCombo(['cmd', 'shift', 's'])).toBe('Cmd+Shift+S');
      expect(formatKeyCombo(['alt', 'f4'])).toBe('Alt+F4');
    });

    it('should handle special keys', () => {
      expect(formatKeyCombo(['meta', 'c'])).toBe('Meta+C');
      expect(formatKeyCombo(['ctrl', 'shift', 'Enter'])).toBe('Ctrl+Shift+Enter');
    });

    it('should handle empty array', () => {
      expect(formatKeyCombo([])).toBe('');
    });
  });

  describe('isValidKeyCombo', () => {
    it('should validate single keys', () => {
      expect(isValidKeyCombo(['a'])).toBe(true);
      expect(isValidKeyCombo(['Enter'])).toBe(true);
      expect(isValidKeyCombo(['F1'])).toBe(true);
    });

    it('should validate key combinations', () => {
      expect(isValidKeyCombo(['ctrl', 'a'])).toBe(true);
      expect(isValidKeyCombo(['alt', 'shift', 'Tab'])).toBe(true);
    });

    it('should reject invalid combinations', () => {
      expect(isValidKeyCombo(['ctrl', 'ctrl'])).toBe(false); // Duplicate modifiers
      expect(isValidKeyCombo([''])).toBe(false); // Empty key
      expect(isValidKeyCombo(['invalidkey'])).toBe(false); // Invalid key name
    });

    it('should handle empty array', () => {
      expect(isValidKeyCombo([])).toBe(false);
    });

    it('should handle empty array', () => {
      expect(isValidKeyCombo([])).toBe(false);
    });

    it('should handle empty array', () => {
      expect(isValidKeyCombo([])).toBe(false);
    });
  });

  describe('parseKeyCombo', () => {
    it('should parse single keys', () => {
      expect(parseKeyCombo('a')).toEqual(['a']);
      expect(parseKeyCombo('Enter')).toEqual(['enter']);
    });

    it('should parse key combinations', () => {
      expect(parseKeyCombo('Ctrl+A')).toEqual(['ctrl', 'a']);
      expect(parseKeyCombo('Cmd+Shift+S')).toEqual(['cmd', 'shift', 's']);
      expect(parseKeyCombo('Alt+F4')).toEqual(['alt', 'f4']);
    });

    it('should handle different separators', () => {
      expect(parseKeyCombo('Ctrl-A')).toEqual(['ctrl', 'a']);
      expect(parseKeyCombo('Ctrl_A')).toEqual(['ctrl', 'a']);
      expect(parseKeyCombo('Ctrl A')).toEqual(['ctrl', 'a']);
    });

    it('should normalize case', () => {
      expect(parseKeyCombo('CTRL+A')).toEqual(['ctrl', 'a']);
      expect(parseKeyCombo('ctrl+a')).toEqual(['ctrl', 'a']);
    });

    it('should handle empty string', () => {
      expect(parseKeyCombo('')).toEqual([]);
      expect(parseKeyCombo('   ')).toEqual([]);
    });

    it('should handle special characters', () => {
      expect(parseKeyCombo('Ctrl++')).toEqual(['ctrl', '+']);
      expect(parseKeyCombo('Shift+=')).toEqual(['shift', '=']);
    });
  });
});