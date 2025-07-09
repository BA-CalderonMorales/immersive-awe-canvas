import { useState, useCallback, useRef, useEffect } from 'react';
import { SceneConfig } from '@/types/scene';
import { toast } from 'sonner';
import { logEvent } from '@/lib/logger';

export const useExperienceState = () => {
  const [editableSceneConfig, setEditableSceneConfig] = useState<SceneConfig | null>(null);
  const [isObjectLocked, setIsObjectLocked] = useState(false);
  const [currentWorldId, setCurrentWorldId] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [isMotionFrozen, setIsMotionFrozen] = useState(false);
  
  // Helper function for localStorage operations
  const getStoredBoolean = (key: string, defaultValue: boolean): boolean => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };
  
  // Stable UI state management with helper
  const [isUiHidden, setIsUiHidden] = useState(() => getStoredBoolean('uiHidden', true));
  const [showUiHint, setShowUiHint] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const hintShownRef = useRef(false);

  // Stable localStorage persistence
  useEffect(() => {
    if (hasInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem('uiHidden', JSON.stringify(isUiHidden));
      } catch (error) {
        console.warn('Failed to save UI state to localStorage:', error);
      }
    }
  }, [isUiHidden, hasInitialized]);

  // Initialize once
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  const toggleObjectLock = useCallback(() => {
    setIsObjectLocked(locked => {
      const newLockState = !locked;
      
      // Improved toast notification with better styling and icons
      if (newLockState) {
        toast.success("🔒 Object motion locked", {
          description: "Objects will no longer rotate automatically",
          duration: 2500,
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
          },
        });
      } else {
        toast.success("🔓 Object motion unlocked", {
          description: "Objects will resume automatic rotation",
          duration: 2500,
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
          },
        });
      }
      
      return newLockState;
    });
  }, []);

  const toggleDragEnabled = useCallback(() => {
    setIsDragEnabled(enabled => {
      const newState = !enabled;
      toast.info(newState ? "Drag Mode Enabled" : "Drag Mode Disabled", {
        description: newState ? "You can now move objects" : "Camera rotation re-enabled",
        duration: 2500,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
        },
      });
      logEvent({ eventType: 'action', eventSource: 'toggle_drag_mode', metadata: { enabled: newState } });
      
      // Clear selection when disabling drag mode
      if (!newState && typeof window !== 'undefined') {
        // Signal to clear selection - we'll handle this in SceneObjectsProvider
        window.dispatchEvent(new CustomEvent('clearSelection'));
      }
      
      return newState;
    });
  }, []);

  const toggleMotionFreeze = useCallback(() => {
    setIsMotionFrozen(frozen => {
      const newState = !frozen;
      toast.info(newState ? "🥶 Animation Frozen" : "🔄 Animation Resumed", {
        description: newState ? "Scene motion is now paused" : "Scene motion has resumed",
        duration: 2500,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
        },
      });
      logEvent({ eventType: 'action', eventSource: 'toggle_motion_freeze', metadata: { frozen: newState } });
      return newState;
    });
  }, []);

  const handleCopyCode = useCallback(() => {
    if (!editableSceneConfig) return;
    
    try {
      const codeString = JSON.stringify(editableSceneConfig, null, 2);
      navigator.clipboard.writeText(codeString)
        .then(() => {
          toast.success("📋 Scene configuration copied!", {
            description: "Ready to paste into your project",
            duration: 3000,
            style: {
              background: 'rgba(0, 0, 0, 0.9)',
              color: '#fff',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              backdropFilter: 'blur(8px)',
            },
          });
          logEvent({ eventType: 'action', eventSource: 'copy_code_success' });
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          toast.error("❌ Failed to copy configuration", {
            description: "Please try again",
            style: {
              background: 'rgba(0, 0, 0, 0.9)',
              color: '#fff',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backdropFilter: 'blur(8px)',
            },
          });
          logEvent({ eventType: 'action', eventSource: 'copy_code_failure', metadata: { error: (err as Error).message } });
        });
    } catch (error) {
      console.error('Failed to serialize config:', error);
      toast.error("❌ Failed to prepare configuration", {
        description: "Configuration could not be serialized",
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(8px)',
        },
      });
    }
  }, [editableSceneConfig]);

  return {
    editableSceneConfig,
    setEditableSceneConfig,
    isObjectLocked,
    toggleObjectLock,
    currentWorldId,
    setCurrentWorldId,
    isHelpOpen,
    setIsHelpOpen,
    isSearchOpen,
    setIsSearchOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isUiHidden,
    setIsUiHidden,
    showUiHint,
    setShowUiHint,
    hintShownRef,
    handleCopyCode,
    isDragEnabled,
    toggleDragEnabled,
    isMotionFrozen,
    toggleMotionFreeze,
  };
};