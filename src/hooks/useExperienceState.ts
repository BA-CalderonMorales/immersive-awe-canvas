
import { useState, useCallback, useRef } from 'react';
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
  const [isUiHidden, setIsUiHidden] = useState(true);
  const [showUiHint, setShowUiHint] = useState(false);
  const hintShownRef = useRef(false);

  const toggleObjectLock = useCallback(() => {
    setIsObjectLocked(locked => {
      const newLockState = !locked;
      toast.info(newLockState ? "Object motion locked" : "Object motion unlocked");
      return newLockState;
    });
  }, []);

  const handleCopyCode = useCallback(() => {
    if (!editableSceneConfig) return;
    const codeString = JSON.stringify(editableSceneConfig, null, 2);
    navigator.clipboard.writeText(codeString)
      .then(() => {
        toast.success("Scene configuration copied to clipboard!");
        logEvent({ eventType: 'action', eventSource: 'copy_code_success' });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast.error("Failed to copy configuration.");
        logEvent({ eventType: 'action', eventSource: 'copy_code_failure', metadata: { error: (err as Error).message } });
      });
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
