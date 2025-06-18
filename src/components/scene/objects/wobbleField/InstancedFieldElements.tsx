
import { useRef, useMemo } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D, Matrix4, Color } from 'three';
import DynamicMaterial from '../../materials/DynamicMaterial';
import { CHAOS_MULTIPLIER, createRickGeometry } from './fieldGenerator';

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
    const instanceCounts = new Array(8).fill(0);
    
    // Count instances per type
    fieldData.types.forEach(type => instanceCounts[type]++);
    
    // Create instanced mesh for each type
    for (let typeIndex = 0; typeIndex < 8; typeIndex++) {
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
    
    // Calculate mouse influence here where it's used
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);

    // Animate each instanced mesh
    fieldInstanceRefs.current.forEach((instancedMesh, meshIndex) => {
      if (!instancedMesh) return;
      
      let instanceIndex = 0;
      
      fieldData.positions.forEach((position, fieldIndex) => {
        if (fieldData.types[fieldIndex] === instancedMeshes[meshIndex].type) {
          const [x, y, z] = position;
          const [sx, sy, sz] = fieldData.scales[fieldIndex];
          const [rx, ry, rz] = fieldData.rotations[fieldIndex];
          
          // Chaotic movement patterns
          const chaosTime = timeRef.current + fieldIndex * 0.1;
          const chaosX = x + Math.sin(chaosTime * 0.8 + fieldIndex) * CHAOS_MULTIPLIER;
          const chaosY = y + Math.cos(chaosTime * 0.6 + fieldIndex * 2) * CHAOS_MULTIPLIER;
          const chaosZ = z + Math.sin(chaosTime * 0.4 + fieldIndex * 3) * CHAOS_MULTIPLIER;
          
          // Dynamic scaling based on time and mouse
          const pulseFactor = 1 + Math.sin(chaosTime * 2 + fieldIndex) * 0.3;
          const mouseFactor = 1 + mouseInfluence * 0.5;
          
          dummyObject.current.position.set(chaosX, chaosY, chaosZ);
          dummyObject.current.rotation.set(
            rx + chaosTime * 0.5,
            ry + chaosTime * 0.3,
            rz + chaosTime * 0.7
          );
          dummyObject.current.scale.set(
            sx * pulseFactor * mouseFactor,
            sy * pulseFactor * mouseFactor,
            sz * pulseFactor * mouseFactor
          );
          
          dummyObject.current.updateMatrix();
          instancedMesh.setMatrixAt(instanceIndex, dummyObject.current.matrix);
          
          // Dynamic color chaos
          const colorShift = (timeRef.current + fieldIndex) * 50;
          const chaosColor = new Color().setHSL(
            ((colorShift % 360) / 360),
            0.7 + Math.sin(chaosTime) * 0.3,
            0.5 + Math.cos(chaosTime * 1.5) * 0.3
          );
          instancedMesh.setColorAt(instanceIndex, chaosColor);
          
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
      {/* Rick's Chaotic Instanced Field Elements */}
      {instancedMeshes.map((meshData, index) => (
        <instancedMesh
          key={`rick-chaos-${index}`}
          ref={(ref) => {
            if (ref) fieldInstanceRefs.current[index] = ref;
          }}
          args={[meshData.geometry, undefined, meshData.count]}
        >
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.6 + Math.random() * 0.4,
              emissiveIntensity: 0.3,
              wireframe: Math.random() > 0.7
            }} 
            color={color} 
          />
        </instancedMesh>
      ))}
    </>
  );
};

export default InstancedFieldElements;
