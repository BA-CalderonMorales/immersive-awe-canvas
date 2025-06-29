
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { SceneObject } from '@/types/sceneObjects';
import { toast } from 'sonner';

interface UseObjectSelectionProps {
  object: SceneObject;
  onSelect: () => void;
}

export const useObjectSelection = ({ object, onSelect }: UseObjectSelectionProps) => {
  const { actions } = useSceneObjectsContext();

  const handleEdit = () => {
    console.log('Editing object:', object.id);
    onSelect();
    toast.success(`✏️ ${object.type} selected for editing`, {
      description: "Use the settings panel to modify properties",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleDelete = () => {
    console.log('Deleting object:', object.id);
    actions.removeObject(object.id);
    toast.success(`🗑️ ${object.type} deleted`, {
      description: "Object removed from scene",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleDuplicate = () => {
    console.log('Duplicating object:', object.id);
    const newObject = {
      ...object,
      id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: [
        object.position[0] + 2,
        object.position[1],
        object.position[2]
      ] as [number, number, number]
    };
    
    actions.addObject(object.type);
    actions.updateObject(newObject.id, newObject);
    
    toast.success(`📋 ${object.type} duplicated`, {
      description: "New object added to scene",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleMove = () => {
    console.log('Move mode activated for:', object.id);
    onSelect();
    toast.info(`🎯 Drag to move ${object.type}`, {
      description: "Long press or Ctrl+drag to reposition",
      duration: 3000,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleChangeColor = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    actions.updateObject(object.id, { color: randomColor });
    
    console.log('Color changed for object:', object.id, 'to:', randomColor);
    toast.success(`🎨 Color changed to ${randomColor}`, {
      description: "Object appearance updated",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: `1px solid ${randomColor}40`,
        backdropFilter: 'blur(8px)',
      },
    });
  };

  return {
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleMove,
    handleChangeColor,
  };
};
