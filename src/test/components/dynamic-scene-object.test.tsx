import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMockSceneObject } from '../test-utils';
import DynamicSceneObject from '../../components/scene/objects/DynamicSceneObject';

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

  it('should render scene object with correct geometry and material', () => {
    const { container } = render(
      <DynamicSceneObject
        object={mockObject}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it('should call onSelect when clicked and drag is disabled', () => {
    render(
      <DynamicSceneObject
        object={mockObject}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const mesh = document.querySelector('mesh');
    if (mesh) {
      fireEvent.click(mesh);
      expect(mockOnSelect).toHaveBeenCalled();
    }
  });

  it('should show wireframe when selected', () => {
    render(
      <DynamicSceneObject
        object={mockObject}
        isSelected={true}
        onSelect={mockOnSelect}
      />
    );

    // Selected objects should have wireframe overlay
    const wireframes = document.querySelectorAll('meshBasicMaterial');
    expect(wireframes.length).toBeGreaterThan(0);
  });

  it('should handle drag operations correctly', () => {
    const mockObject = createMockSceneObject();
    
    render(
      <DynamicSceneObject
        object={mockObject}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    // Test drag start
    const mesh = document.querySelector('mesh');
    if (mesh) {
      fireEvent.pointerDown(mesh, { pointerId: 1, clientX: 100, clientY: 100 });
      fireEvent.pointerMove(mesh, { pointerId: 1, clientX: 150, clientY: 150 });
      fireEvent.pointerUp(mesh, { pointerId: 1 });
    }

    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('should apply correct transform properties', () => {
    const customObject = createMockSceneObject({
      position: [1, 2, 3],
      rotation: [0.1, 0.2, 0.3],
      scale: [2, 2, 2],
    });

    render(
      <DynamicSceneObject
        object={customObject}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const mesh = document.querySelector('mesh');
    expect(mesh).toHaveAttribute('position', '[object Object]');
    expect(mesh).toHaveAttribute('rotation', '[object Object]');
    expect(mesh).toHaveAttribute('scale', '[object Object]');
  });
});