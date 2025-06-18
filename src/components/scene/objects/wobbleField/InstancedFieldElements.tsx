
import { useRef, useMemo } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D, Matrix4, Color } from 'three';
import DynamicMaterial from '../../materials/DynamicMaterial';
import { HARMONY_MULTIPLIER, createRickGeometry } from './fieldGenerator';

interface InstancedFieldElementsProps {
  color: string;
  materialConfig: MaterialConfig;
  fieldData: {
    positions: number[][];
    scales: number[][];
    rotations: number[][];
    types: number[];
    colors: string[];
  };
  isLocked: boolean;
}

const InstancedFieldElements = ({ color, materialConfig, fieldData, isLocked }: InstancedFieldElementsProps) => {
  const fieldInstanceRefs = useRef<InstancedMesh[]>([]);
  const { mouse } = useThree();
  const timeRef = useRef(0);
  const dummyObject = useRef(new Object3D());

  // Create instanced meshes for different geometry types
  const instancedMeshes = useMemo(() => {
    const meshes = [];
    const instanceCounts = new Array(5).fill(0); // Reduced to 5 types
    
    // Count instances per type
    fieldData.types.forEach(type => instanceCounts[type]++);
    
    // Create instanced mesh for each type
    for (let typeIndex = 0; typeIndex < 5; typeIndex++) {
      if (instanceCounts[typeIndex] > 0) {
        meshes.push({
          type: typeIndex,
          count: instanceCounts[typeIndex],
          geometry: createRickGeometry(typeIndex, [1, 1, 1])
        });
      }
    }
    
    return meshes;
  }, [fieldData]);

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Gentle mouse influence for contemplation
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.3;

    // Animate each instanced mesh with contemplative motion
    fieldInstanceRefs.current.forEach((instancedMesh, meshIndex) => {
      if (!instancedMesh) return;
      
      let instanceIndex = 0;
      
      fieldData.positions.forEach((position, fieldIndex) => {
        if (fieldData.types[fieldIndex] === instancedMeshes[meshIndex].type) {
          const [x, y, z] = position;
          const [sx, sy, sz] = fieldData.scales[fieldIndex];
          const [rx, ry, rz] = fieldData.rotations[fieldIndex];
          
          // Gentle, meditative movement patterns
          const contemplativeTime = timeRef.current * 0.3 + fieldIndex * 0.05; // Much slower
          const floatX = x + Math.sin(contemplativeTime * 0.4 + fieldIndex) * HARMONY_MULTIPLIER * 0.3;
          const floatY = y + Math.cos(contemplativeTime * 0.2 + fieldIndex * 1.5) * HARMONY_MULTIPLIER * 0.5;
          const floatZ = z + Math.sin(contemplativeTime * 0.15 + fieldIndex * 2) * HARMONY_MULTIPLIER * 0.2;
          
          // Gentle breathing-like scaling
          const breatheFactor = 1 + Math.sin(contemplativeTime * 0.8 + fieldIndex) * 0.1;
          const mouseInteraction = 1 + mouseInfluence * 0.2;
          
          dummyObject.current.position.set(floatX, floatY, floatZ);
          dummyObject.current.rotation.set(
            rx + contemplativeTime * 0.1,
            ry + contemplativeTime * 0.15,
            rz + contemplativeTime * 0.08
          );
          dummyObject.current.scale.set(
            sx * breatheFactor * mouseInteraction,
            sy * breatheFactor * mouseInteraction,
            sz * breatheFactor * mouseInteraction
          );
          
          dummyObject.current.updateMatrix();
          instancedMesh.setMatrixAt(instanceIndex, dummyObject.current.matrix);
          
          // Gentle color transitions like shifting thoughts
          const colorShift = (timeRef.current * 10 + fieldIndex * 20) % 360;
          const contemplativeColor = new Color().setHSL(
            (colorShift / 360),
            0.4 + Math.sin(contemplativeTime * 0.5) * 0.2, // Gentle saturation
            0.5 + Math.cos(contemplativeTime * 0.3) * 0.15  // Subtle brightness
          );
          instancedMesh.setColorAt(instanceIndex, contemplativeColor);
          
          instanceIndex++;
        }
      });
      
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }
    });
  });

  return (
    <>
      {/* Contemplative Field Elements */}
      {instancedMeshes.map((meshData, index) => (
        <instancedMesh
          key={`contemplative-${index}`}
          ref={(ref) => {
            if (ref) fieldInstanceRefs.current[index] = ref;
          }}
          args={[meshData.geometry, undefined, meshData.count]}
        >
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.7,
              emissiveIntensity: 0.1,
              wireframe: Math.random() > 0.8 // Fewer wireframes
            }} 
            color={color} 
          />
        </instancedMesh>
      ))}
    </>
  );
};

export default InstancedFieldElements;
