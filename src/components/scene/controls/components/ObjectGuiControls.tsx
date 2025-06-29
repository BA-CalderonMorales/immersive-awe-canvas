
import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneObject } from '@/types/sceneObjects';

interface ObjectGuiControlsProps {
  object: SceneObject;
  onUpdate: (updates: Partial<SceneObject>) => void;
}

const ObjectGuiControls = ({ object, onUpdate }: ObjectGuiControlsProps) => {
  const guiContainerRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<GUI | null>(null);

  useEffect(() => {
    if (!guiContainerRef.current) return;

    if (guiRef.current) {
      guiRef.current.destroy();
    }

    const gui = new GUI({ 
      container: guiContainerRef.current, 
      title: `Properties: ${object.type}`,
      autoPlace: false,
      width: 320
    });
    guiRef.current = gui;

    // Position controls
    const positionFolder = gui.addFolder('Position');
    const positionProxy = { x: object.position[0], y: object.position[1], z: object.position[2] };
    
    positionFolder.add(positionProxy, 'x', -10, 10, 0.1).name('X').onChange((value: number) => {
      onUpdate({ position: [value, object.position[1], object.position[2]] });
    });
    positionFolder.add(positionProxy, 'y', -10, 10, 0.1).name('Y').onChange((value: number) => {
      onUpdate({ position: [object.position[0], value, object.position[2]] });
    });
    positionFolder.add(positionProxy, 'z', -10, 10, 0.1).name('Z').onChange((value: number) => {
      onUpdate({ position: [object.position[0], object.position[1], value] });
    });

    // Rotation controls
    const rotationFolder = gui.addFolder('Rotation');
    const rotationProxy = { x: object.rotation[0], y: object.rotation[1], z: object.rotation[2] };
    
    rotationFolder.add(rotationProxy, 'x', 0, Math.PI * 2, 0.1).name('X').onChange((value: number) => {
      onUpdate({ rotation: [value, object.rotation[1], object.rotation[2]] });
    });
    rotationFolder.add(rotationProxy, 'y', 0, Math.PI * 2, 0.1).name('Y').onChange((value: number) => {
      onUpdate({ rotation: [object.rotation[0], value, object.rotation[2]] });
    });
    rotationFolder.add(rotationProxy, 'z', 0, Math.PI * 2, 0.1).name('Z').onChange((value: number) => {
      onUpdate({ rotation: [object.rotation[0], object.rotation[1], value] });
    });

    // Scale controls
    const scaleFolder = gui.addFolder('Scale');
    const uniformScale = { value: object.scale[0] };
    scaleFolder.add(uniformScale, 'value', 0.1, 5, 0.1).name('Uniform').onChange((value: number) => {
      onUpdate({ scale: [value, value, value] });
    });

    // Material controls
    const materialFolder = gui.addFolder('Material');
    materialFolder.addColor({ color: object.color }, 'color').onChange((value: string) => {
      onUpdate({ color: value });
    });
    
    if (object.material.metalness !== undefined) {
      materialFolder.add(object.material, 'metalness', 0, 1, 0.01).onChange((value: number) => {
        onUpdate({ material: { ...object.material, metalness: value } });
      });
    }
    
    if (object.material.roughness !== undefined) {
      materialFolder.add(object.material, 'roughness', 0, 1, 0.01).onChange((value: number) => {
        onUpdate({ material: { ...object.material, roughness: value } });
      });
    }

    materialFolder.add(object.material, 'wireframe').onChange((value: boolean) => {
      onUpdate({ material: { ...object.material, wireframe: value } });
    });

    materialFolder.add(object.material, 'opacity', 0, 1, 0.01).onChange((value: number) => {
      onUpdate({ material: { ...object.material, opacity: value, transparent: value < 1 } });
    });

    positionFolder.open();
    materialFolder.open();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [object, onUpdate]);

  return <div ref={guiContainerRef} className="w-full [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui_.title]:text-cyan-400 [&_.lil-gui_.name]:text-gray-300 [&_.lil-gui_input]:text-white [&_.lil-gui_input]:bg-gray-800" />;
};

export default ObjectGuiControls;
