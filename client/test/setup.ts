import React from 'react';
import { vi, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('@/hooks/useWorlds', () => ({
  useWorlds: () => ({
    worlds: [],
    isLoading: false,
    isError: false,
    currentWorldIndex: 0,
    worldData: { slug: 'test-world' },
    changeWorld: vi.fn(),
    jumpToWorld: vi.fn(),
    isTransitioning: false,
  }),
}));

// Make React available globally for tests
(global as any).React = React;

// Mock Three.js components to prevent React warnings in tests
// Simple approach: just suppress the warnings by mocking console.error during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress React warnings about Three.js components
    if (
      typeof args[0] === 'string' && (
        args[0].includes('Warning: <') ||
        args[0].includes('Warning: React does not recognize') ||
        args[0].includes('Warning: The tag <') ||
        args[0].includes('Warning: Function components cannot be given refs') ||
        args[0].includes('Warning: Unknown event handler property') ||
        args[0].includes('Warning: Received `false` for a non-boolean attribute')
      )
    ) {
      return; // Suppress these warnings
    }
    originalError.apply(console, args);
  };
});

afterAll(() => {
  console.error = originalError;
});
