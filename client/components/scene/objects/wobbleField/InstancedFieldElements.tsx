
import { useRef, useMemo } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D, Matrix4, Color, Vector3 } from 'three';
import { MeshWobbleMaterial } from '@react-three/drei';
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
    
    // Multiple wave layers for complex wobble field
    const wave1 = Math.sin(time * 0.8 + distance * 0.3) * 0.4;
    const wave2 = Math.cos(time * 0.6 + x * 0.2 + z * 0.2) * 0.3;
    const wave3 = Math.sin(time * 1.2 + y * 0.4) * 0.2;
    const mouseWave = Math.sin(time * 2 + distance * 0.1) * Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.3;
    
    return {
      x: x + wave1 * HARMONY_MULTIPLIER + wave2 * 0.5,
      y: y + wave2 * HARMONY_MULTIPLIER + wave3 * 0.8,
      z: z + wave3 * HARMONY_MULTIPLIER + wave1 * 0.3,
      scale: 1 + (wave1 + wave2 + wave3 + mouseWave) * 0.2,
      rotation: {
        x: wave1 * 0.5,
        y: wave2 * 0.4,
        z: wave3 * 0.3
      }
    };
  };

  // Create instanced meshes for different philosophical forms
  const instancedMeshes = useMemo(() => {
    const meshes = [];
    const instanceCounts = new Array(7).fill(0);
    
    // Count instances per philosophical type
    fieldData.types.forEach(type => instanceCounts[type]++);
    
    // Create instanced mesh for each meaningful type
    for (let typeIndex = 0; typeIndex < 7; typeIndex++) {
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
    
    // Mouse creates ripples in the wobble field
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.4;

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
          
          // Additional meaning-based motion within the wobble field
          const meaningMotion = { x: 0, y: 0, z: 0, scaleMultiplier: 1 };
          
          switch (meaning) {
            case 'memory':
              // Memories drift slowly through the field
              meaningMotion.y = Math.sin(timeRef.current * 0.3 + fieldIndex) * 0.3;
              break;
            case 'question':
              // Questions create upward ripples
              meaningMotion.y = Math.abs(Math.sin(timeRef.current * 0.8 + fieldIndex)) * 0.4;
              meaningMotion.scaleMultiplier = 1 + Math.sin(timeRef.current * 1.5 + fieldIndex) * 0.2;
              break;
            case 'insight':
              // Insights pulse brightly in the field
              meaningMotion.scaleMultiplier = 1 + Math.sin(timeRef.current * 2 + fieldIndex) * 0.3;
              break;
            case 'doubt':
              // Doubts create chaotic motion
              meaningMotion.x = Math.sin(timeRef.current * 1.1 + fieldIndex * 2) * 0.2;
              meaningMotion.z = Math.cos(timeRef.current * 0.9 + fieldIndex * 3) * 0.2;
              break;
            case 'wonder': {
              // Wonder creates spiral motion in the field
              const spiralTime = timeRef.current * 0.5 + fieldIndex;
              meaningMotion.x = Math.cos(spiralTime) * 0.3;
              meaningMotion.z = Math.sin(spiralTime) * 0.3;
              break;
            }
            case 'truth':
              // Truth remains stable but responds to field
              meaningMotion.scaleMultiplier = 1 + Math.sin(timeRef.current * 0.4) * 0.1;
              break;
            case 'mystery':
              // Mysteries phase in and out of the field
              meaningMotion.scaleMultiplier = 0.5 + Math.abs(Math.sin(timeRef.current * 0.7 + fieldIndex)) * 0.8;
              break;
          }
          
          // Combine wobble field distortion with meaning-based motion
          const finalX = wobble.x + meaningMotion.x;
          const finalY = wobble.y + meaningMotion.y;
          const finalZ = wobble.z + meaningMotion.z;
          
          // Field-responsive scaling
          const fieldScale = wobble.scale * meaningMotion.scaleMultiplier * (1 + mouseInfluence * 0.2);
          
          dummyObject.current.position.set(finalX, finalY, finalZ);
          dummyObject.current.rotation.set(
            rx + wobble.rotation.x + timeRef.current * 0.1,
            ry + wobble.rotation.y + timeRef.current * 0.15,
            rz + wobble.rotation.z + timeRef.current * 0.08
          );
          dummyObject.current.scale.set(
            sx * fieldScale,
            sy * fieldScale,
            sz * fieldScale
          );
          
          dummyObject.current.updateMatrix();
          instancedMesh.setMatrixAt(instanceIndex, dummyObject.current.matrix);
          
          // Colors flow like energy through the wobble field
          const fieldEnergy = (timeRef.current * 12 + fieldIndex * 20 + wobble.scale * 100) % 360;
          const energyColor = new Color().setHSL(
            (fieldEnergy / 360),
            0.4 + Math.sin(timeRef.current * 0.5 + fieldIndex) * 0.2,
            0.5 + Math.cos(timeRef.current * 0.3 + fieldIndex) * 0.15
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
          <MeshWobbleMaterial
            color={color}
            speed={0.8 + Math.random() * 0.4}
            factor={0.15 + Math.random() * 0.1}
            transparent
            opacity={0.6 + Math.random() * 0.2}
            emissive={color}
            emissiveIntensity={0.08 + Math.random() * 0.05}
            wireframe={Math.random() > 0.7}
          />
        </instancedMesh>
      ))}

      {/* Wobble Field Energy Streams */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3 + Math.sin(i * 0.5) * 1;
        return (
          <mesh 
            key={`wobble-stream-${i}`}
            position={[
              Math.cos(angle) * radius, 
              Math.sin(timeRef.current * 0.2 + i) * 2, 
              Math.sin(angle) * radius
            ]}
            rotation={[
              timeRef.current * 0.3 + i,
              timeRef.current * 0.2,
              timeRef.current * 0.1 + i * 0.5
            ]}
            scale={[0.08, 3 + Math.sin(timeRef.current * 0.8 + i) * 1, 0.08]}
          >
            <cylinderGeometry args={[0.05, 0.02, 1, 8]} />
            <MeshWobbleMaterial
              color={`hsl(${(i * 60 + timeRef.current * 20) % 360}, 60%, 60%)`}
              speed={1.5}
              factor={0.3}
              transparent
              opacity={0.4}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default InstancedFieldElements;
