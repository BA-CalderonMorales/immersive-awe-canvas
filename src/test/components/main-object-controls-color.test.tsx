import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import MainObjectControls from '../../components/scene/controls/MainObjectControls';
import { SceneConfig } from '@/types/scene';

vi.mock('lil-gui', () => {
  class MockGUI {
    domElement = document.createElement('div');
    destroy() {}
    add() {
      return {
        name: () => ({ onChange: () => {} })
      };
    }
    addColor() {
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

describe('MainObjectControls color input', () => {
  const sceneConfig: SceneConfig = {
    type: 'TorusKnot',
    day: { mainObjectColor: '#ffffff', material: {}, background: { type: 'void' }, lights: [] },
    night: { mainObjectColor: '#000000', material: {}, background: { type: 'void' }, lights: [] }
  };

  it('calls onUpdate when color input changes', () => {
    const onUpdate = vi.fn();
    const { getByTestId } = render(
      <MainObjectControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
    );
    fireEvent.change(getByTestId('color-input'), { target: { value: '#654321' } });
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({
      day: expect.objectContaining({ mainObjectColor: '#654321' })
    }));
  });
});
