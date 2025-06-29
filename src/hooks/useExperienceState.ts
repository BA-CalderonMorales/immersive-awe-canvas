
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
  
  // Stable UI state management
  const [isUiHidden, setIsUiHidden] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('uiHidden');
        return saved ? JSON.parse(saved) : true;
      } catch {
        return true;
      }
    }
    return true;
  });
  
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
  };
};
