import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneObject } from '@/types/sceneObjects';

interface ObjectGuiControlsProps {
  object: SceneObject;
  onUpdate: (updates: Partial<SceneObject>) => void;
  containerRef: HTMLDivElement | null;
}

const ObjectGuiControls = ({ object, onUpdate, containerRef }: ObjectGuiControlsProps) => {
  const guiRef = useRef<GUI | null>(null);

  useEffect(() => {
    if (!containerRef) return;

    // Clean up previous GUI
    if (guiRef.current) {
      guiRef.current.destroy();
    }

    const gui = new GUI({ container: containerRef, title: `${object.type} #${object.id.slice(-4)}` });
    guiRef.current = gui;

    // Position controls
    const positionFolder = gui.addFolder('Position');
    positionFolder.add(object.position, '0', -10, 10, 0.1).name('X').onChange((value: number) => {
      onUpdate({ position: [value, object.position[1], object.position[2]] });
    });
    positionFolder.add(object.position, '1', -10, 10, 0.1).name('Y').onChange((value: number) => {
      onUpdate({ position: [object.position[0], value, object.position[2]] });
    });
    positionFolder.add(object.position, '2', -10, 10, 0.1).name('Z').onChange((value: number) => {
      onUpdate({ position: [object.position[0], object.position[1], value] });
    });

    // Rotation controls
    const rotationFolder = gui.addFolder('Rotation');
    rotationFolder.add(object.rotation, '0', 0, Math.PI * 2, 0.1).name('X').onChange((value: number) => {
      onUpdate({ rotation: [value, object.rotation[1], object.rotation[2]] });
    });
    rotationFolder.add(object.rotation, '1', 0, Math.PI * 2, 0.1).name('Y').onChange((value: number) => {
      onUpdate({ rotation: [object.rotation[0], value, object.rotation[2]] });
    });
    rotationFolder.add(object.rotation, '2', 0, Math.PI * 2, 0.1).name('Z').onChange((value: number) => {
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

    // Open folders by default
    positionFolder.open();
    materialFolder.open();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [object, onUpdate, containerRef]);

  return null;
};

export default ObjectGuiControls;