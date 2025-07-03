import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../test/test-utils';
import { createMockSceneConfig } from '../../../test/test-utils';
import WorldView from '../experience/WorldView';

// Mock the child components
vi.mock('@/components/WorldContainer', () => ({
  default: ({ children, onToggleLock, isLocked, isDragEnabled }: any) => (
    <div data-testid="world-container" data-locked={isLocked} data-drag-enabled={isDragEnabled}>
      <button onClick={onToggleLock}>Toggle Lock</button>
      {children}
    </div>
  ),
}));

vi.mock('@/components/controls/KeyboardControls', () => ({
  default: () => <div data-testid="keyboard-controls">Keyboard Controls</div>,
}));

vi.mock('@/components/scene/DynamicWorld', () => ({
  default: ({ sceneConfig, isLocked }: any) => (
    <div data-testid="dynamic-world" data-locked={isLocked} data-object-type={sceneConfig.objectType}>
      Dynamic World
    </div>
  ),
}));

describe('WorldView', () => {
  const mockSceneConfig = createMockSceneConfig();
  const mockOnToggleLock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all child components', () => {
    const { getByTestId } = render(
      <WorldView
        sceneConfig={mockSceneConfig}
        isTransitioning={false}
        worldIndex={0}
        isLocked={false}
        onToggleLock={mockOnToggleLock}
        isDragEnabled={false}
      />
    );

    expect(getByTestId('world-container')).toBeInTheDocument();
    expect(getByTestId('keyboard-controls')).toBeInTheDocument();
    expect(getByTestId('dynamic-world')).toBeInTheDocument();
  });

  it('should pass correct props to child components', () => {
    const { getByTestId } = render(
      <WorldView
        sceneConfig={mockSceneConfig}
        isTransitioning={false}
        worldIndex={0}
        isLocked={true}
        onToggleLock={mockOnToggleLock}
        isDragEnabled={true}
      />
    );

    const worldContainer = getByTestId('world-container');
    expect(worldContainer).toHaveAttribute('data-locked', 'true');
    expect(worldContainer).toHaveAttribute('data-drag-enabled', 'true');

    const dynamicWorld = getByTestId('dynamic-world');
    expect(dynamicWorld).toHaveAttribute('data-locked', 'true');
    expect(dynamicWorld).toHaveAttribute('data-object-type', 'torusKnot');
  });

  it('should apply transition styles when transitioning', () => {
    const { container } = render(
      <WorldView
        sceneConfig={mockSceneConfig}
        isTransitioning={true}
        worldIndex={0}
        isLocked={false}
        onToggleLock={mockOnToggleLock}
        isDragEnabled={false}
      />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('opacity-0', 'scale-95');
  });

  it('should apply normal styles when not transitioning', () => {
    const { container } = render(
      <WorldView
        sceneConfig={mockSceneConfig}
        isTransitioning={false}
        worldIndex={0}
        isLocked={false}
        onToggleLock={mockOnToggleLock}
        isDragEnabled={false}
      />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('opacity-100', 'scale-100');
  });

  it('should handle lock toggle correctly', () => {
    const { getByText } = render(
      <WorldView
        sceneConfig={mockSceneConfig}
        isTransitioning={false}
        worldIndex={0}
        isLocked={false}
        onToggleLock={mockOnToggleLock}
        isDragEnabled={false}
      />
    );

    fireEvent.click(getByText('Toggle Lock'));
    expect(mockOnToggleLock).toHaveBeenCalled();
  });

  it('should handle different world indices', () => {
    const { container, rerender } = render(
      <WorldView
        sceneConfig={mockSceneConfig}
        isTransitioning={false}
        worldIndex={0}
        isLocked={false}
        onToggleLock={mockOnToggleLock}
        isDragEnabled={false}
      />
    );

    const initialDiv = container.firstChild as HTMLElement;
    expect(initialDiv).toBeInTheDocument();

    rerender(
      <WorldView
        sceneConfig={mockSceneConfig}
        isTransitioning={false}
        worldIndex={1}
        isLocked={false}
        onToggleLock={mockOnToggleLock}
        isDragEnabled={false}
      />
    );

    // Component should re-render with new world index
    expect(container.firstChild).toBeInTheDocument();
  });
});