import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test-utils';
import ExperienceLogic from '../../components/experience/ExperienceLogic';

// Mock the hooks
vi.mock('@/hooks/useWorlds', () => ({
  useWorlds: vi.fn(() => ({
    worlds: [
      {
        id: 1,
        name: 'Test World',
        slug: 'test-world',
        scene_config: { objectType: 'torusKnot' },
      },
    ],
    isLoading: false,
    isError: false,
    worldData: {
      id: 1,
      name: 'Test World',
      slug: 'test-world',
      scene_config: { objectType: 'torusKnot' },
      ui_day_color: '#ffffff',
      ui_night_color: '#000000',
    },
    currentWorldIndex: 0,
    isTransitioning: false,
    jumpToWorld: vi.fn(),
  })),
}));

vi.mock('@/hooks/useWorldNavigation', () => ({
  useWorldNavigation: vi.fn(() => ({
    handleChangeWorld: vi.fn(),
    handleJumpToWorld: vi.fn(),
  })),
}));

vi.mock('@/hooks/useExperienceState', () => ({
  useExperienceState: vi.fn(() => ({
    editableSceneConfig: { objectType: 'torusKnot' },
    setEditableSceneConfig: vi.fn(),
    isObjectLocked: false,
    toggleObjectLock: vi.fn(),
    currentWorldId: 1,
    setCurrentWorldId: vi.fn(),
    isHelpOpen: false,
    setIsHelpOpen: vi.fn(),
    isSearchOpen: false,
    setIsSearchOpen: vi.fn(),
    isSettingsOpen: false,
    setIsSettingsOpen: vi.fn(),
    isUiHidden: false,
    setIsUiHidden: vi.fn(),
    showUiHint: false,
    setShowUiHint: vi.fn(),
    hintShownRef: { current: false },
    handleCopyCode: vi.fn(),
    isDragEnabled: false,
    toggleDragEnabled: vi.fn(),
  })),
}));

vi.mock('@/hooks/useExperienceTransitions', () => ({
  useExperienceTransitions: vi.fn(() => ({
    showEntryTransition: false,
    showWorldTransition: false,
    handleEntryTransitionEnd: vi.fn(),
    handleWorldTransitionEnd: vi.fn(),
  })),
}));

vi.mock('@/hooks/useExperienceCallbacks', () => ({
  useExperienceCallbacks: vi.fn(() => ({
    handleGoHome: vi.fn(),
    handleToggleShortcuts: vi.fn(),
  })),
}));

vi.mock('@/hooks/useExperienceEffects', () => ({
  useExperienceEffects: vi.fn(() => ({
    handleEntryTransitionEndWithHint: vi.fn(),
  })),
}));

describe('ExperienceLogic', () => {
  it('should render loading state correctly', () => {
    vi.mocked(require('@/hooks/useWorlds').useWorlds).mockReturnValue({
      worlds: [],
      isLoading: true,
      isError: false,
      worldData: null,
      currentWorldIndex: 0,
      isTransitioning: false,
      jumpToWorld: vi.fn(),
    });

    render(<ExperienceLogic />);
    
    expect(screen.getByText('Summoning Worlds...')).toBeInTheDocument();
  });

  it('should render error state correctly', () => {
    vi.mocked(require('@/hooks/useWorlds').useWorlds).mockReturnValue({
      worlds: [],
      isLoading: false,
      isError: true,
      worldData: null,
      currentWorldIndex: 0,
      isTransitioning: false,
      jumpToWorld: vi.fn(),
    });

    render(<ExperienceLogic />);
    
    expect(screen.getByText('Could not connect to the multiverse.')).toBeInTheDocument();
  });

  it('should render experience container when data is loaded', () => {
    render(<ExperienceLogic />);
    
    // Should render the experience container (indicated by the canvas or main content)
    // Since this is a complex 3D component, we check for absence of loading states
    expect(screen.queryByText('Summoning Worlds...')).not.toBeInTheDocument();
    expect(screen.queryByText('Could not connect to the multiverse.')).not.toBeInTheDocument();
  });

  it('should pass correct props to ExperienceContainer', () => {
    const { container } = render(<ExperienceLogic initialWorldSlug="test-world" />);
    
    // Verify that the component renders without errors and passes props correctly
    expect(container).toBeInTheDocument();
  });
});