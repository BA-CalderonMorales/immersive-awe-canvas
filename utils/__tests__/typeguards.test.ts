import { describe, it, expect } from 'vitest';
import { isSceneConfig, isValidObjectType } from '../typeguards';

describe('typeguards', () => {
  describe('isSceneConfig', () => {
    it('should return true for valid scene config', () => {
      const validConfig = {
        type: 'TorusKnot',
        day: {
          mainObjectColor: '#ffffff',
          material: { materialType: 'standard' },
          background: { type: 'color', color: '#000000' },
          lights: [],
        },
        night: {
          mainObjectColor: '#000000',
          material: { materialType: 'standard' },
          background: { type: 'color', color: '#ffffff' },
          lights: [],
        },
      };

      expect(isSceneConfig(validConfig)).toBe(true);
    });

    it('should return false for invalid scene config', () => {
      const invalidConfig = {
        theme: {
          material: { materialType: 'invalid' },
        },
      };

      expect(isSceneConfig(invalidConfig)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isSceneConfig(null)).toBe(false);
      expect(isSceneConfig(undefined)).toBe(false);
    });

    it('should return false for non-object values', () => {
      expect(isSceneConfig('string')).toBe(false);
      expect(isSceneConfig(123)).toBe(false);
      expect(isSceneConfig([])).toBe(false);
    });
  });

  describe('isValidObjectType', () => {
    it('should return true for valid object types', () => {
      const validTypes = [
        'torusKnot',
        'distortionSphere',
        'morphingIcosahedron',
        'wavyGrid',
        'crystallineSpire',
        'wobbleField',
        'jellyTorus',
      ];

      validTypes.forEach(type => {
        expect(isValidObjectType(type)).toBe(true);
      });
    });

    it('should return false for invalid object types', () => {
      const invalidTypes = [
        'invalidType',
        'cube',
        'sphere',
        '',
        null,
        undefined,
        123,
      ];

      invalidTypes.forEach(type => {
        expect(isValidObjectType(type)).toBe(false);
      });
    });
  });
});