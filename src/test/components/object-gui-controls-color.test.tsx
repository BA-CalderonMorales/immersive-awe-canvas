import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { render, createMockSceneObject } from '../test-utils';
import ObjectGuiControls from '../../components/scene/controls/components/ObjectGuiControls';

vi.mock('lil-gui', () => {
  class MockGUI {
    domElement = document.createElement('div');
    destroy() {}
    addColor() {
      return {
        onChange: () => {},
        name: () => ({ onChange: () => {} })
      };
    }
    add() {
      return {
        onChange: () => {},
        name: () => ({ onChange: () => {} })
      };
    }
    addFolder() {
      return new MockGUI();
    }
    open() {}
  }
  return { default: MockGUI };
});

vi.mock('@/hooks/useExperience', () => ({
  useExperience: () => ({ theme: 'day' })
}));

describe('ObjectGuiControls color input', () => {
  it('calls onUpdate when color input changes', () => {
    const object = createMockSceneObject();
    const onUpdate = vi.fn();
    const { getByTestId } = render(<ObjectGuiControls object={object} onUpdate={onUpdate} />);
    fireEvent.change(getByTestId('color-input'), { target: { value: '#123456' } });
    expect(onUpdate).toHaveBeenCalledWith({ color: '#123456' });
  });
});
