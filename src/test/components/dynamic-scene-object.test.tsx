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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  import { SceneObjectsProvider } from '@/context/SceneObjectsContext';