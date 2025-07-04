import { vi } from 'vitest';
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