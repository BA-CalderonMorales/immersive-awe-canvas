
import { useRef, useMemo } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, Vector3 } from 'three';
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
    meanings: string[];
  };
  isLocked: boolean;
}

const InstancedFieldElements = ({ color, materialConfig, fieldData, isLocked }: InstancedFieldElementsProps) => {
  const fieldInstanceRefs = useRef<InstancedMesh[]>([]);
  const { mouse } = useThree();
  const timeRef = useRef(0);
  const dummyObject = useRef(new Object3D());

  // Create wobble field wave function
  const getWobbleDistortion = (position: number[], time: number, objectIndex: number) => {
    const [x, y, z] = position;
    const distance = Math.sqrt(x * x + y * y + z * z);
    
    // Gentler wave layers for smoother wobble field
    const wave1 = Math.sin(time * 0.5 + distance * 0.2) * 0.3;
    const wave2 = Math.cos(time * 0.4 + x * 0.15 + z * 0.15) * 0.25;
    const wave3 = Math.sin(time * 0.6 + y * 0.3) * 0.2;
    const mouseWave = Math.sin(time * 1.5 + distance * 0.08) * Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.2;
    
    return {
      x: x + wave1 * HARMONY_MULTIPLIER * 0.8,
      y: y + wave2 * HARMONY_MULTIPLIER * 0.6,
      z: z + wave3 * HARMONY_MULTIPLIER * 0.7,
      scale: 1 + (wave1 + wave2 + wave3 + mouseWave) * 0.15,
      rotation: {
        x: wave1 * 0.3,
        y: wave2 * 0.25,
        z: wave3 * 0.2
      }
    };
  };

  // Create instanced meshes for different philosophical forms
  const instancedMeshes = useMemo(() => {
    const meshes = [];
    const instanceCounts = new Array(6).fill(0);
    
    // Count instances per philosophical type
    fieldData.types.forEach(type => instanceCounts[type]++);
    
    // Create instanced mesh for each meaningful type
    for (let typeIndex = 0; typeIndex < 6; typeIndex++) {
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
    
    // Mouse creates gentle ripples in the wobble field
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.3;

    // Animate each philosophical form with wobble field effects
    fieldInstanceRefs.current.forEach((instancedMesh, meshIndex) => {
      if (!instancedMesh) return;
      
      let instanceIndex = 0;
      
      fieldData.positions.forEach((position, fieldIndex) => {
        if (fieldData.types[fieldIndex] === instancedMeshes[meshIndex].type) {
          const [x, y, z] = position;
          const [sx, sy, sz] = fieldData.scales[fieldIndex];
          const [rx, ry, rz] = fieldData.rotations[fieldIndex];
          const meaning = fieldData.meanings[fieldIndex];
          
          // Get wobble field distortion for this object
          const wobble = getWobbleDistortion(position, timeRef.current, fieldIndex);
          
          // Meaning-based motion within the wobble field
          let meaningMotion = { x: 0, y: 0, z: 0, scaleMultiplier: 1 };
          
          switch (meaning) {
            case 'memory':
              meaningMotion.y = Math.sin(timeRef.current * 0.2 + fieldIndex) * 0.2;
              break;
            case 'question':
              meaningMotion.y = Math.abs(Math.sin(timeRef.current * 0.6 + fieldIndex)) * 0.3;
              meaningMotion.scaleMultiplier = 1 + Math.sin(timeRef.current * 1.2 + fieldIndex) * 0.15;
              break;
            case 'insight':
              meaningMotion.scaleMultiplier = 1 + Math.sin(timeRef.current * 1.5 + fieldIndex) * 0.2;
              break;
            case 'doubt':
              meaningMotion.x = Math.sin(timeRef.current * 0.8 + fieldIndex * 2) * 0.15;
              meaningMotion.z = Math.cos(timeRef.current * 0.7 + fieldIndex * 3) * 0.15;
              break;
            case 'wonder':
              const spiralTime = timeRef.current * 0.3 + fieldIndex;
              meaningMotion.x = Math.cos(spiralTime) * 0.2;
              meaningMotion.z = Math.sin(spiralTime) * 0.2;
              break;
            case 'truth':
              meaningMotion.scaleMultiplier = 1 + Math.sin(timeRef.current * 0.3) * 0.08;
              break;
          }
          
          // Combine wobble field distortion with meaning-based motion
          const finalX = wobble.x + meaningMotion.x;
          const finalY = wobble.y + meaningMotion.y;
          const finalZ = wobble.z + meaningMotion.z;
          
          // Field-responsive scaling
          const fieldScale = wobble.scale * meaningMotion.scaleMultiplier * (1 + mouseInfluence * 0.15);
          
          dummyObject.current.position.set(finalX, finalY, finalZ);
          dummyObject.current.rotation.set(
            rx + wobble.rotation.x + timeRef.current * 0.08,
            ry + wobble.rotation.y + timeRef.current * 0.1,
            rz + wobble.rotation.z + timeRef.current * 0.06
          );
          dummyObject.current.scale.set(
            sx * fieldScale,
            sy * fieldScale,
            sz * fieldScale
          );
          
          dummyObject.current.updateMatrix();
          instancedMesh.setMatrixAt(instanceIndex, dummyObject.current.matrix);
          
          // Harmonious colors flowing through the wobble field
          const fieldEnergy = (timeRef.current * 8 + fieldIndex * 15 + wobble.scale * 80) % 360;
          const energyColor = new Color().setHSL(
            (fieldEnergy / 360),
            0.5 + Math.sin(timeRef.current * 0.4 + fieldIndex) * 0.15,
            0.6 + Math.cos(timeRef.current * 0.25 + fieldIndex) * 0.1
          );
          instancedMesh.setColorAt(instanceIndex, energyColor);
          
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
      {/* Wobble Field Elements */}
      {instancedMeshes.map((meshData, index) => (
        <instancedMesh
          key={`wobble-field-${index}`}
          ref={(ref) => {
            if (ref) fieldInstanceRefs.current[index] = ref;
          }}
          args={[meshData.geometry, undefined, meshData.count]}
        >
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.7 + Math.random() * 0.2,
              emissiveIntensity: 0.1 + Math.random() * 0.05
            }}
            color={color}
          />
        </instancedMesh>
      ))}
    </>
  );
};

export default InstancedFieldElements;
