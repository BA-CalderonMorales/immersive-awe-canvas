import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExperienceState } from '../useExperienceState';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('useExperienceState', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useExperienceState());

    expect(result.current.editableSceneConfig).toBeNull();
    expect(result.current.isObjectLocked).toBe(false);
    expect(result.current.currentWorldId).toBeNull();
    expect(result.current.isHelpOpen).toBe(false);
    expect(result.current.isSearchOpen).toBe(false);
    expect(result.current.isSettingsOpen).toBe(false);
    expect(result.current.isDragEnabled).toBe(false);
    expect(result.current.showUiHint).toBe(false);
  });

  it('should toggle object lock state', () => {
    const { result } = renderHook(() => useExperienceState());

    act(() => {
      result.current.toggleObjectLock();
    });

    expect(result.current.isObjectLocked).toBe(true);

    act(() => {
      result.current.toggleObjectLock();
    });

    expect(result.current.isObjectLocked).toBe(false);
  });

  it('should toggle drag enabled state', () => {
    const { result } = renderHook(() => useExperienceState());

    act(() => {
      result.current.toggleDragEnabled();
    });

    expect(result.current.isDragEnabled).toBe(true);

    act(() => {
      result.current.toggleDragEnabled();
    });

    expect(result.current.isDragEnabled).toBe(false);
  });

  it('should handle copy code with valid scene config', async () => {
    const { result } = renderHook(() => useExperienceState());
    const mockConfig = { theme: { backgroundColor: '#000000' } };

    act(() => {
      result.current.setEditableSceneConfig(mockConfig);
    });

    await act(async () => {
      result.current.handleCopyCode();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(mockConfig, null, 2)
    );
  });

  it('should not copy code when scene config is null', () => {
    const { result } = renderHook(() => useExperienceState());

    act(() => {
      result.current.handleCopyCode();
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('should manage UI state correctly', () => {
    const { result } = renderHook(() => useExperienceState());

    act(() => {
      result.current.setIsHelpOpen(true);
    });
    expect(result.current.isHelpOpen).toBe(true);

    act(() => {
      result.current.setIsSearchOpen(true);
    });
    expect(result.current.isSearchOpen).toBe(true);

    act(() => {
      result.current.setIsSettingsOpen(true);
    });
    expect(result.current.isSettingsOpen).toBe(true);
  });

  it('should persist UI hidden state to localStorage', () => {
    renderHook(() => useExperienceState());

    // Should eventually call localStorage.setItem for uiHidden
    expect(localStorageMock.setItem).toHaveBeenCalledWith('uiHidden', 'true');
  });
});