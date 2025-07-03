import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { useSceneObjectsContext } from '../SceneObjectsContext';
import React from 'react';

// Test component to access context
const TestComponent = () => {
  const { 
    objects, 
    selectedObjectId, 
    isDragEnabled, 
    actions,
    isAddingObject 
  } = useSceneObjectsContext();

  return (
    <div>
      <div data-testid="objects-count">{objects.length}</div>
      <div data-testid="selected-id">{selectedObjectId || 'none'}</div>
      <div data-testid="drag-enabled">{isDragEnabled ? 'enabled' : 'disabled'}</div>
      <div data-testid="adding-object">{isAddingObject ? 'adding' : 'not-adding'}</div>
      <button onClick={() => actions.addObject('sphere')}>Add Sphere</button>
      <button onClick={() => actions.selectObject('test-id')}>Select Object</button>
      <button onClick={() => actions.clearObjects()}>Clear Objects</button>
      <button onClick={() => actions.toggleAddMode()}>Toggle Add Mode</button>
    </div>
  );
};

describe('SceneObjectsContext', () => {
  it('should provide initial state', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('objects-count')).toHaveTextContent('0');
    expect(screen.getByTestId('selected-id')).toHaveTextContent('none');
    expect(screen.getByTestId('drag-enabled')).toHaveTextContent('disabled');
    expect(screen.getByTestId('adding-object')).toHaveTextContent('not-adding');
  });

  it('should add objects correctly', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByText('Add Sphere'));

    expect(screen.getByTestId('objects-count')).toHaveTextContent('1');
  });

  it('should select objects correctly', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByText('Select Object'));

    expect(screen.getByTestId('selected-id')).toHaveTextContent('test-id');
  });

  it('should clear objects correctly', () => {
    render(<TestComponent />);

    // Add an object first
    fireEvent.click(screen.getByText('Add Sphere'));
    expect(screen.getByTestId('objects-count')).toHaveTextContent('1');

    // Clear objects
    fireEvent.click(screen.getByText('Clear Objects'));
    expect(screen.getByTestId('objects-count')).toHaveTextContent('0');
  });

  it('should toggle add mode correctly', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('adding-object')).toHaveTextContent('not-adding');

    fireEvent.click(screen.getByText('Toggle Add Mode'));
    expect(screen.getByTestId('adding-object')).toHaveTextContent('adding');

    fireEvent.click(screen.getByText('Toggle Add Mode'));
    expect(screen.getByTestId('adding-object')).toHaveTextContent('not-adding');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />, { wrapper: ({ children }) => <div>{children}</div> });
    }).toThrow('useSceneObjectsContext must be used within a SceneObjectsProvider');

    consoleSpy.mockRestore();
  });
});