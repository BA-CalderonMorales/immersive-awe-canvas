
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { MaterialConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicMaterial from '../materials/DynamicMaterial';
import InstancedFieldElements from './wobbleField/InstancedFieldElements';
import EnergyStreams from './wobbleField/EnergyStreams';
import PortalEffects from './wobbleField/PortalEffects';
import { generateChaoticField } from './wobbleField/fieldGenerator';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const WobbleFieldObject = ({ color, materialConfig, isLocked }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled } = useSceneObjectsContext();
  
  // Generate field data once
  const fieldData = generateChaoticField();

  useFrame((state) => {
    if (groupRef.current?.userData.isBeingDragged) return;
    if (!isLocked && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const handlePointerEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      ref={groupRef}
      name={MAIN_OBJECT_NAME}
      onPointerOver={handlePointerEnter}
      onPointerOut={handlePointerLeave}
    >
      {/* Main central sphere with enhanced appearance */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <DynamicMaterial 
          materialConfig={{
            ...materialConfig,
            emissiveIntensity: 0.15,
            transparent: true,
            opacity: 0.9
          }} 
          color={color} 
        />
        
        {/* Inner glow sphere */}
        <mesh scale={0.95}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.3}
          />
        </mesh>
        
        {/* Outer aura */}
        <mesh scale={1.3}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.1}
            wireframe
          />
        </mesh>

        {/* Drag indicator overlay */}
        {(isDragEnabled || isHovered) && (
          <mesh scale={1.1}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.4} />
          </mesh>
        )}
      </mesh>

      {/* Field elements */}
      <InstancedFieldElements 
        color={color} 
        materialConfig={materialConfig}
        fieldData={fieldData}
        isLocked={isLocked}
      />
      
      {/* Energy streams */}
      <EnergyStreams materialConfig={materialConfig} />
      
      {/* Portal effects */}
      <PortalEffects materialConfig={materialConfig} />
    </group>
  );
};

export default WobbleFieldObject;
