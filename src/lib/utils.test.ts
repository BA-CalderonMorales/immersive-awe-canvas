import { describe, it, expect } from 'vitest';
import { lightenColor, darkenColor } from './utils';

describe('color utilities', () => {
  it('lightens black by 50%', () => {
    expect(lightenColor('#000000', 0.5)).toBe('#808080');
  });

  it('darkens white by 50%', () => {
    expect(darkenColor('#ffffff', 0.5)).toBe('#808080');
  });
});
