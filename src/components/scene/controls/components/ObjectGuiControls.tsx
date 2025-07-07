
import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneObject } from '@/types/sceneObjects';
import { useExperience } from '@/hooks/useExperience';
import ColorInput from '@/components/ui/color-input';

interface ObjectGuiControlsProps {
  object: SceneObject;
  onUpdate: (updates: Partial<SceneObject>) => void;
}

const ObjectGuiControls = ({ object, onUpdate }: ObjectGuiControlsProps) => {
  const guiContainerRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<GUI | null>(null);
  const { theme } = useExperience();

  useEffect(() => {
    if (!guiContainerRef.current) return;

    if (guiRef.current) {
      guiRef.current.destroy();
    }

    const gui = new GUI({ 
      container: guiContainerRef.current, 
      title: `${object.type.charAt(0).toUpperCase() + object.type.slice(1)} Properties`,
      autoPlace: false,
      width: Math.min(400, guiContainerRef.current.clientWidth - 32) // Responsive width with padding
    });
    guiRef.current = gui;

    // Apply theme class to the GUI element
    const guiElement = gui.domElement;
    guiElement.setAttribute('data-theme', theme);
    guiElement.classList.add(`theme-${theme}`);

    // CRITICAL FIX: Position controls with enhanced reactive proxy and immediate 3D updates
    const positionFolder = gui.addFolder('🎯 Position');
    const positionProxy = { x: object.position[0], y: object.position[1], z: object.position[2] };
    
    positionFolder.add(positionProxy, 'x', -10, 10, 0.01).name('X Position').onChange((value: number) => {
      positionProxy.x = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        position: [value, positionProxy.y, positionProxy.z] 
      });
    });
    positionFolder.add(positionProxy, 'y', -10, 10, 0.01).name('Y Position').onChange((value: number) => {
      positionProxy.y = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        position: [positionProxy.x, value, positionProxy.z] 
      });
    });
    positionFolder.add(positionProxy, 'z', -10, 10, 0.01).name('Z Position').onChange((value: number) => {
      positionProxy.z = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        position: [positionProxy.x, positionProxy.y, value] 
      });
    });

    // CRITICAL FIX: Rotation controls with enhanced reactive proxy and immediate 3D updates
    const rotationFolder = gui.addFolder('🔄 Rotation');
    const rotationProxy = { x: object.rotation[0], y: object.rotation[1], z: object.rotation[2] };
    
    rotationFolder.add(rotationProxy, 'x', 0, Math.PI * 2, 0.01).name('X Rotation').onChange((value: number) => {
      rotationProxy.x = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        rotation: [value, rotationProxy.y, rotationProxy.z] 
      });
    });
    rotationFolder.add(rotationProxy, 'y', 0, Math.PI * 2, 0.01).name('Y Rotation').onChange((value: number) => {
      rotationProxy.y = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        rotation: [rotationProxy.x, value, rotationProxy.z] 
      });
    });
    rotationFolder.add(rotationProxy, 'z', 0, Math.PI * 2, 0.01).name('Z Rotation').onChange((value: number) => {
      rotationProxy.z = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        rotation: [rotationProxy.x, rotationProxy.y, value] 
      });
    });

    // CRITICAL FIX: Scale controls with enhanced UX and immediate 3D updates
    const scaleFolder = gui.addFolder('📏 Scale');
    const uniformScale = { value: object.scale[0] };
    scaleFolder.add(uniformScale, 'value', 0.1, 5, 0.01).name('Uniform Scale').onChange((value: number) => {
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        scale: [value, value, value] 
      });
    });

    // CRITICAL FIX: Material controls with enhanced reactive proxy and immediate 3D updates
    const materialFolder = gui.addFolder('🎨 Material');
    const colorProxy = { color: object.color };
    const materialProxy = { ...object.material };
    
    materialFolder.addColor(colorProxy, 'color').name('Object Color').onChange((value: string) => {
      colorProxy.color = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        color: value 
      });
    });
    
    if (object.material.metalness !== undefined) {
      materialFolder.add(materialProxy, 'metalness', 0, 1, 0.01).name('Metalness').onChange((value: number) => {
        materialProxy.metalness = value;
        // CRITICAL: Force immediate update with new object reference
        onUpdate({ 
          ...object,
          material: { ...object.material, metalness: value } 
        });
      });
    }
    
    if (object.material.roughness !== undefined) {
      materialFolder.add(materialProxy, 'roughness', 0, 1, 0.01).name('Roughness').onChange((value: number) => {
        materialProxy.roughness = value;
        // CRITICAL: Force immediate update with new object reference
        onUpdate({ 
          ...object,
          material: { ...object.material, roughness: value } 
        });
      });
    }

    materialFolder.add(materialProxy, 'opacity', 0, 1, 0.01).name('Opacity').onChange((value: number) => {
      materialProxy.opacity = value;
      // CRITICAL: Force immediate update with new object reference
      onUpdate({ 
        ...object,
        material: { ...object.material, opacity: value, transparent: value < 1 } 
      });
    });

    positionFolder.open();
    materialFolder.open();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [object, onUpdate, theme]);

  return (
    <div 
      ref={guiContainerRef} 
      className="w-full min-h-0 [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui]:border-0 [&_.lil-gui]:shadow-none [&_.lil-gui_.controller]:min-h-[28px] [&_.lil-gui_.folder>.title]:font-medium"
    />
  );
};

export default ObjectGuiControls;
