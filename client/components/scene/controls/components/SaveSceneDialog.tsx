/**
 * Dialog for saving user scenes with current settings
 * Integrates with the Scene Settings Panel
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, Tag, X } from 'lucide-react';
import { SceneConfig } from '@/types/scene';
import { UserSceneCreateInput } from '@/types/userScenes';
import { useUserScenes } from '@/hooks/useUserScenes';

interface SaveSceneDialogProps {
  sceneConfig: SceneConfig;
  baseGeometryId?: number;
  baseGeometryName?: string;
  trigger?: React.ReactNode;
}

const SaveSceneDialog = ({ 
  sceneConfig, 
  baseGeometryId, 
  baseGeometryName,
  trigger 
}: SaveSceneDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  
  const { actions, isLoading } = useUserScenes();

  const handleSave = async () => {
    if (!formData.name.trim()) {
      return;
    }

    try {
      const saveInput: UserSceneCreateInput = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        sceneConfig,
        baseGeometryId,
        isPublic: formData.isPublic,
        tags: formData.tags,
      };

      await actions.saveScene(saveInput);
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        isPublic: false,
        tags: [],
      });
      setIsOpen(false);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to save scene:', error);
    }
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newTag.trim()) {
        addTag();
      } else if (formData.name.trim()) {
        handleSave();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save Scene
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Current Scene
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Scene Name */}
          <div className="space-y-2">
            <Label htmlFor="scene-name">Scene Name *</Label>
            <Input
              id="scene-name"
              placeholder="Enter a name for your scene..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="scene-description">Description</Label>
            <Textarea
              id="scene-description"
              placeholder="Describe your scene (optional)..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Base Geometry Info */}
          {baseGeometryName && (
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="text-sm text-muted-foreground">
                Based on: <span className="font-medium text-foreground">{baseGeometryName}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Public Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-toggle">Make Public</Label>
              <div className="text-sm text-muted-foreground">
                Allow others to discover and use this scene
              </div>
            </div>
            <Switch
              id="public-toggle"
              checked={formData.isPublic}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isPublic: checked }))
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim() || isLoading}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Scene'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveSceneDialog;
