
import { useEffect } from 'react';
import { isSceneConfig } from '@/lib/typeguards';
import { SceneConfig } from '@/types/scene';
import { logEvent } from '@/lib/logger';

interface UseExperienceEffectsProps {
  worldData: any;
  currentWorldId: number | null;
  setEditableSceneConfig: (config: SceneConfig) => void;
  setCurrentWorldId: (id: number) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  hintShownRef: React.MutableRefObject<boolean>;
  setShowUiHint: (show: boolean) => void;
  handleEntryTransitionEnd: () => void;
}

export const useExperienceEffects = ({
  worldData,
  currentWorldId,
  setEditableSceneConfig,
  setCurrentWorldId,
  isSettingsOpen,
  setIsSettingsOpen,
  hintShownRef,
  setShowUiHint,
  handleEntryTransitionEnd,
}: UseExperienceEffectsProps) => {
  
  // World data effect - updated for geometry-based system
  useEffect(() => {
    if (worldData && worldData.id !== currentWorldId) {
      // For geometry objects, create a basic scene config from the geometry type
      const basicSceneConfig: SceneConfig = {
        type: worldData.scene_config?.type || 'TorusKnot',
        day: {
          lights: [{ type: 'ambient', intensity: 1 }],
          material: { materialType: 'standard' as const },
          background: { type: 'void' },
          mainObjectColor: '#ffffff'
        },
        night: {
          lights: [{ type: 'ambient', intensity: 0.5 }],
          material: { materialType: 'standard' as const },
          background: { type: 'void' },
          mainObjectColor: '#ffffff'
        }
      };
      
      setEditableSceneConfig(basicSceneConfig);
      setCurrentWorldId(worldData.id);
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
      }

      handleEntryTransitionEnd();
    }
  }, [worldData, currentWorldId, isSettingsOpen, setEditableSceneConfig, setCurrentWorldId, setIsSettingsOpen, handleEntryTransitionEnd]);

  // Settings escape key effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && isSettingsOpen) {
        event.preventDefault();
        setIsSettingsOpen(false);
        logEvent({ eventType: 'keyboard_shortcut', eventSource: 'close_settings' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSettingsOpen, setIsSettingsOpen]);

  // Entry transition hint effect
  const handleEntryTransitionEndWithHint = () => {
    handleEntryTransitionEnd();
    if (!hintShownRef.current) {
      hintShownRef.current = true;
      setShowUiHint(true);
      setTimeout(() => {
        setShowUiHint(false);
      }, 4000);
    }
  };

  return {
    handleEntryTransitionEndWithHint,
  };
};
