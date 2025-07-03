
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
  isMotionFrozen?: boolean;
}

const WobbleFieldObject = ({ color, materialConfig, isLocked, isMotionFrozen }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled } = useSceneObjectsContext();
  
  // Generate field data once
  const fieldData = generateChaoticField();

  useFrame((state) => {
    if (groupRef.current?.userData.isBeingDragged) return;
    if (isMotionFrozen) return;
    if (!isLocked && groupRef.current) {
      // Smooth, consistent rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
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
      {/* Main central sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <DynamicMaterial materialConfig={materialConfig} color={color} />
        
        {/* Wireframe overlay - show when drag is enabled or when hovered */}
        {(isDragEnabled || isHovered) && (
          <mesh>
            <sphereGeometry args={[0.8, 64, 64]} />
            <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
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
