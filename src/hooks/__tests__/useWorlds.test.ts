import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useWorlds } from '../useWorlds';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            {
              id: 1,
              name: 'Genesis Torus',
              slug: 'genesis-torus',
              scene_config: { objectType: 'torusKnot' },
              ui_day_color: '#ffffff',
              ui_night_color: '#000000',
            },
            {
              id: 2,
              name: 'Distortion Sphere',
              slug: 'distortion-sphere',
              scene_config: { objectType: 'distortionSphere' },
              ui_day_color: '#ffffff',
              ui_night_color: '#000000',
            },
          ],
          error: null,
        })),
      })),
    })),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('useWorlds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load worlds successfully', async () => {
    const { result } = renderHook(() => useWorlds(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.worlds).toHaveLength(2);
    expect(result.current.worlds[0].name).toBe('Genesis Torus');
    expect(result.current.currentWorldIndex).toBe(0);
    expect(result.current.worldData).toEqual(result.current.worlds[0]);
  });

  it('should initialize with specific world slug', async () => {
    const { result } = renderHook(() => useWorlds('distortion-sphere'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.currentWorldIndex).toBe(1);
    expect(result.current.worldData?.slug).toBe('distortion-sphere');
  });

  it('should handle world navigation', async () => {
    const { result } = renderHook(() => useWorlds(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Jump to second world
    await waitFor(() => {
      result.current.jumpToWorld(1);
    });

    expect(result.current.currentWorldIndex).toBe(1);
    expect(result.current.worldData?.slug).toBe('distortion-sphere');
  });

  it('should handle transition state correctly', async () => {
    const { result } = renderHook(() => useWorlds(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isTransitioning).toBe(false);

    // Trigger transition
    await waitFor(() => {
      result.current.jumpToWorld(1);
    });

    // Should be transitioning during world change
    expect(result.current.isTransitioning).toBe(true);
  });
});