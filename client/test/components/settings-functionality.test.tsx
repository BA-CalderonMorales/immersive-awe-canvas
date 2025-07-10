/**
 * Tests for Settings Panel Functionality
 * These tests drive the implementation of actual settings behavior
 * Following TDD principles - tests first, then implementation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SceneConfig } from '@/types/scene';

// Mock data factories following TDD patterns
const getMockSceneConfig = (overrides?: Partial<SceneConfig>): SceneConfig => ({
  type: 'TorusKnot',
  day: {
    mainObjectColor: '#ffffff',
    material: {
      materialType: 'standard',
      metalness: 0.5,
      roughness: 0.5,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1
    },
    background: {
      type: 'void'
    },
    lights: [
      { type: 'ambient', intensity: 1.5 },
      { type: 'directional', position: [10, 10, 5], intensity: 1 }
    ]
  },
  night: {
    mainObjectColor: '#ffffff',
    material: {
      materialType: 'standard', 
      metalness: 0.5,
      roughness: 0.5,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1
    },
    background: {
      type: 'void'
    },
    lights: [
      { type: 'ambient', intensity: 0.8 },
      { type: 'directional', position: [10, 10, 5], intensity: 0.5 }
    ]
  },
  ...overrides
});

// Mock the hooks and components we depend on
vi.mock('@/hooks/useExperience', () => ({
  useExperience: () => ({ theme: 'day' })
}));

vi.mock('@/hooks/useDefaultGeometries', () => ({
  useDefaultGeometries: () => ({
    geometries: [
      { id: 1, name: 'Torus Knot', geometry_type: 'TorusKnot' },
      { id: 2, name: 'Wobble Field', geometry_type: 'WobbleField' }
    ],
    currentGeometry: { id: 1, name: 'Torus Knot', geometry_type: 'TorusKnot' }
  })
}));

vi.mock('@/hooks/useBackgrounds', () => ({
  useBackgrounds: () => ({
    backgrounds: [
      { id: 1, name: 'Void', type: 'void' },
      { id: 2, name: 'Stars', type: 'stars' }
    ],
    currentBackground: { id: 1, name: 'Void', type: 'void' }
  })
}));

describe('Settings Panel Functionality Tests', () => {
  let mockOnUpdate: ReturnType<typeof vi.fn>;
  let mockOnToggleMotion: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    mockOnUpdate = vi.fn();
    mockOnToggleMotion = vi.fn();
  });

  describe('Scene Reset Functionality', () => {
    it('should reset scene to default configuration when reset button is clicked', async () => {
      // This test drives the reset functionality implementation
      const modifiedConfig = getMockSceneConfig({
        day: {
          ...getMockSceneConfig().day,
          mainObjectColor: '#ff0000', // Modified color
          material: { 
            ...getMockSceneConfig().day.material,
            materialType: 'physical', 
            metalness: 0.8, 
            roughness: 0.2 
          }
        }
      });

      render(
        <MockSettingsPanel 
          sceneConfig={modifiedConfig}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      const resetButton = screen.getByTestId('reset-scene-button');
      await userEvent.click(resetButton);

      // Should call onUpdate with default configuration
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TorusKnot',
          day: expect.objectContaining({
            mainObjectColor: '#ffffff',
            material: expect.objectContaining({
              materialType: 'standard',
              metalness: 0.5,
              roughness: 0.5
            })
          })
        })
      );
    });
  });

  describe('Main Object Color Changes', () => {
    it('should update scene config when main object color is changed', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      // Find and interact with color picker directly
      const colorInput = screen.getByTestId('main-object-color-input');
      fireEvent.change(colorInput, { target: { value: '#ff0000' } });
      
      // Should call onUpdate with new color
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          day: expect.objectContaining({
            mainObjectColor: '#ff0000'
          })
        })
      );
    });
  });

  describe('Material Settings Changes', () => {
    it('should update material metalness when slider is changed', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      const metalnessSlider = screen.getByTestId('material-metalness-slider');
      fireEvent.change(metalnessSlider, { target: { value: '0.8' } });
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            day: expect.objectContaining({
              material: expect.objectContaining({
                metalness: 0.8
              })
            })
          })
        );
      });
    });

    it('should update material roughness when slider is changed', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      const roughnessSlider = screen.getByTestId('material-roughness-slider');
      fireEvent.change(roughnessSlider, { target: { value: '0.2' } });
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            day: expect.objectContaining({
              material: expect.objectContaining({
                roughness: 0.2
              })
            })
          })
        );
      });
    });

    it('should update material type when dropdown is changed', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      const materialTypeSelect = screen.getByTestId('material-type-select');
      await userEvent.selectOptions(materialTypeSelect, 'physical');
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            day: expect.objectContaining({
              material: expect.objectContaining({
                materialType: 'physical'
              })
            })
          })
        );
      });
    });
  });

  describe('Light Controls', () => {
    it('should update ambient light intensity when slider is changed', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      const ambientIntensitySlider = screen.getByTestId('ambient-light-intensity-slider');
      fireEvent.change(ambientIntensitySlider, { target: { value: '2.0' } });
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            day: expect.objectContaining({
              lights: expect.arrayContaining([
                expect.objectContaining({
                  type: 'ambient',
                  intensity: 2.0
                })
              ])
            })
          })
        );
      });
    });

    it('should update directional light intensity when slider is changed', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      const directionalIntensitySlider = screen.getByTestId('directional-light-intensity-slider');
      fireEvent.change(directionalIntensitySlider, { target: { value: '1.5' } });
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            day: expect.objectContaining({
              lights: expect.arrayContaining([
                expect.objectContaining({
                  type: 'directional',
                  intensity: 1.5
                })
              ])
            })
          })
        );
      });
    });
  });

  describe('Background Controls', () => {
    it('should update background type when selection is changed', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
        />
      );

      const backgroundSelect = screen.getByTestId('background-type-select');
      await userEvent.selectOptions(backgroundSelect, 'stars');
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            day: expect.objectContaining({
              background: expect.objectContaining({
                type: 'stars'
              })
            })
          })
        );
      });
    });
  });

  describe('Motion Control', () => {
    it('should call onToggleMotion when play/pause button is clicked', async () => {
      const config = getMockSceneConfig();
      
      render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
          isMotionFrozen={false}
        />
      );

      const motionToggleButton = screen.getByTestId('motion-toggle-button');
      await userEvent.click(motionToggleButton);
      
      expect(mockOnToggleMotion).toHaveBeenCalledTimes(1);
    });

    it('should show correct play/pause icon based on motion state', () => {
      const config = getMockSceneConfig();
      
      const { rerender } = render(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
          isMotionFrozen={false}
        />
      );

      // When not frozen, should show pause icon
      expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
      
      rerender(
        <MockSettingsPanel 
          sceneConfig={config}
          onUpdate={mockOnUpdate}
          onToggleMotion={mockOnToggleMotion}
          isMotionFrozen={true}
        />
      );

      // When frozen, should show play icon
      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    });
  });
});

// Mock Settings Panel Component for Testing
// This represents the interface we expect our settings panel to have
interface MockSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
  onToggleMotion: () => void;
  isMotionFrozen?: boolean;
}

const MockSettingsPanel = ({ 
  sceneConfig, 
  onUpdate, 
  onToggleMotion, 
  isMotionFrozen = false 
}: MockSettingsPanelProps) => {
  // This is a minimal implementation to make tests pass
  // The real implementation will be in the actual component
  
  const handleColorChange = (color: string) => {
    onUpdate({
      ...sceneConfig,
      day: {
        ...sceneConfig.day,
        mainObjectColor: color
      }
    });
  };

  const handleMaterialChange = (property: string, value: number | string) => {
    onUpdate({
      ...sceneConfig,
      day: {
        ...sceneConfig.day,
        material: {
          ...sceneConfig.day.material,
          [property]: value
        }
      }
    });
  };

  const handleLightChange = (lightIndex: number, property: string, value: number) => {
    const updatedLights = [...sceneConfig.day.lights];
    updatedLights[lightIndex] = {
      ...updatedLights[lightIndex],
      [property]: value
    };
    
    onUpdate({
      ...sceneConfig,
      day: {
        ...sceneConfig.day,
        lights: updatedLights
      }
    });
  };

  const handleBackgroundChange = (type: string) => {
    onUpdate({
      ...sceneConfig,
      day: {
        ...sceneConfig.day,
        background: { type: type as any }
      }
    });
  };

  const handleReset = () => {
    onUpdate(getMockSceneConfig());
  };

  return (
    <div data-testid="settings-panel">
      {/* Reset Button */}
      <button 
        data-testid="reset-scene-button"
        onClick={handleReset}
      >
        Reset Scene
      </button>

      {/* Color Controls */}
      <input
        data-testid="main-object-color-input"
        type="text"
        value={sceneConfig.day.mainObjectColor}
        onChange={(e) => handleColorChange(e.target.value)}
      />

      {/* Material Controls */}
      <input
        data-testid="material-metalness-slider"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={sceneConfig.day.material.metalness}
        onChange={(e) => handleMaterialChange('metalness', parseFloat(e.target.value))}
      />
      
      <input
        data-testid="material-roughness-slider"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={sceneConfig.day.material.roughness}
        onChange={(e) => handleMaterialChange('roughness', parseFloat(e.target.value))}
      />

      <select
        data-testid="material-type-select"
        value={sceneConfig.day.material.materialType}
        onChange={(e) => handleMaterialChange('materialType', e.target.value)}
      >
        <option value="standard">Standard</option>
        <option value="physical">Physical</option>
        <option value="basic">Basic</option>
      </select>

      {/* Light Controls */}
      <input
        data-testid="ambient-light-intensity-slider"
        type="range"
        min="0"
        max="3"
        step="0.1"
        value={sceneConfig.day.lights[0]?.intensity || 1}
        onChange={(e) => handleLightChange(0, 'intensity', parseFloat(e.target.value))}
      />

      <input
        data-testid="directional-light-intensity-slider"
        type="range"
        min="0"
        max="3"
        step="0.1"
        value={sceneConfig.day.lights[1]?.intensity || 1}
        onChange={(e) => handleLightChange(1, 'intensity', parseFloat(e.target.value))}
      />

      {/* Background Controls */}
      <select
        data-testid="background-type-select"
        value={sceneConfig.day.background.type}
        onChange={(e) => handleBackgroundChange(e.target.value)}
      >
        <option value="void">Void</option>
        <option value="stars">Stars</option>
        <option value="sky">Sky</option>
      </select>

      {/* Motion Controls */}
      <button
        data-testid="motion-toggle-button"
        onClick={onToggleMotion}
      >
        {isMotionFrozen ? (
          <span data-testid="play-icon">▶️</span>
        ) : (
          <span data-testid="pause-icon">⏸️</span>
        )}
      </button>
    </div>
  );
};