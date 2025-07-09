import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMockSceneObject } from '../test-utils';
import DynamicSceneObject from '../../components/scene/objects/DynamicSceneObject';
import { SceneObjectsProvider } from '@/context/SceneObjectsContext';

// Mock Three.js Canvas
vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: {},
    gl: { domElement: { setPointerCapture: vi.fn(), releasePointerCapture: vi.fn() } },
  }),
}));

describe('DynamicSceneObject', () => {
  const mockObject = createMockSceneObject();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <SceneObjectsProvider>
        <DynamicSceneObject
          object={mockObject}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      </SceneObjectsProvider>
    );
    
    expect(container).toBeTruthy();
  });
});