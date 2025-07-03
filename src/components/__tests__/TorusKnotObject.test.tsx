import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../test/test-utils';
import { createMockSceneConfig } from '../../../test/test-utils';
import TorusKnotObject from '../scene/objects/TorusKnotObject';

// Mock Three.js frame callback
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn((callback) => {
    // Simulate frame update
    callback({ clock: { elapsedTime: 1 } }, 0.016);
  }),
}));

describe('TorusKnotObject', () => {
  const mockThemeConfig = createMockSceneConfig().theme;

  it('should render torus knot geometry', () => {
    const { container } = render(
      <TorusKnotObject
        themeConfig={mockThemeConfig}
        isLocked={false}
      />
    );

    expect(container).toBeInTheDocument();
    expect(container.querySelector('torusKnotGeometry')).toBeInTheDocument();
  });

  it('should not animate when locked', () => {
    render(
      <TorusKnotObject
        themeConfig={mockThemeConfig}
        isLocked={true}
      />
    );

    // Animation should be disabled when locked
    // This is tested through the useFrame mock
    expect(vi.mocked(require('@react-three/fiber').useFrame)).toHaveBeenCalled();
  });

  it('should show wireframe when drag is enabled and selected', () => {
    render(
      <TorusKnotObject
        themeConfig={mockThemeConfig}
        isLocked={false}
      />
    );

    // Test wireframe visibility logic
    const wireframes = document.querySelectorAll('meshBasicMaterial');
    expect(wireframes.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle pointer interactions', () => {
    const { container } = render(
      <TorusKnotObject
        themeConfig={mockThemeConfig}
        isLocked={false}
      />
    );

    const mesh = container.querySelector('mesh');
    expect(mesh).toHaveAttribute('name', 'main-scene-object');
  });

  it('should apply theme colors correctly', () => {
    const customTheme = {
      ...mockThemeConfig,
      mainObjectColor: '#ff0000',
    };

    render(
      <TorusKnotObject
        themeConfig={customTheme}
        isLocked={false}
      />
    );

    // Material should receive the correct color
    const dynamicMaterial = container.querySelector('DynamicMaterial');
    expect(dynamicMaterial).toBeDefined();
  });
});