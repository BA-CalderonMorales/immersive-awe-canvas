import { describe, it, expect } from 'vitest';
import { lightenColor, darkenColor, isHexColor, getContrastingTextColor } from '@client/lib/utils';

describe('color utilities', () => {
  it('lightens black by 50%', () => {
    expect(lightenColor('#000000', 0.5)).toBe('#808080');
  });

  it('darkens white by 50%', () => {
    expect(darkenColor('#ffffff', 0.5)).toBe('#808080');
  });

  it('lightens shorthand hex colors', () => {
    expect(lightenColor('#abc', 0.5)).toBe(lightenColor('#aabbcc', 0.5));
  });

  it('darkens shorthand hex colors', () => {
    expect(darkenColor('#abc', 0.5)).toBe(darkenColor('#aabbcc', 0.5));
  });

  it('validates hex colors correctly', () => {
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#123ABC')).toBe(true);
    expect(isHexColor('123456')).toBe(false);
    expect(isHexColor('#12G')).toBe(false);
  });

  it('returns black text for light backgrounds', () => {
    expect(getContrastingTextColor('#ffffff')).toBe('#000000');
  });

  it('returns white text for dark backgrounds', () => {
    expect(getContrastingTextColor('#000000')).toBe('#ffffff');
  });
});
