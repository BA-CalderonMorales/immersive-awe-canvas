
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
    meanings: string[];
  };
  isLocked: boolean;
}

const InstancedFieldElements = ({ color, materialConfig, fieldData, isLocked }: InstancedFieldElementsProps) => {
  const fieldInstanceRefs = useRef<InstancedMesh[]>([]);
  const { mouse } = useThree();
  const timeRef = useRef(0);
  const dummyObject = useRef(new Object3D());

  // Create instanced meshes for different philosophical forms
  const instancedMeshes = useMemo(() => {
    const meshes = [];
    const instanceCounts = new Array(7).fill(0); // Expanded to 7 types
    
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
    
    // Subtle mouse influence representing conscious attention
    const attentionInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.2;

    // Animate each philosophical form with meaningful motion
    fieldInstanceRefs.current.forEach((instancedMesh, meshIndex) => {
      if (!instancedMesh) return;
      
      let instanceIndex = 0;
      
      fieldData.positions.forEach((position, fieldIndex) => {
        if (fieldData.types[fieldIndex] === instancedMeshes[meshIndex].type) {
          const [x, y, z] = position;
          const [sx, sy, sz] = fieldData.scales[fieldIndex];
          const [rx, ry, rz] = fieldData.rotations[fieldIndex];
          const meaning = fieldData.meanings[fieldIndex];
          
          // Different movement patterns based on philosophical meaning
          const thinkingTime = timeRef.current * 0.2 + fieldIndex * 0.03;
          let floatX = x, floatY = y, floatZ = z;
          
          switch (meaning) {
            case 'memory':
              // Memories drift slowly like sediment
              floatX = x + Math.sin(thinkingTime * 0.3) * HARMONY_MULTIPLIER * 0.2;
              floatY = y + Math.cos(thinkingTime * 0.15) * HARMONY_MULTIPLIER * 0.3;
              break;
            case 'question':
              // Questions reach upward, searching
              floatY = y + Math.sin(thinkingTime * 0.5) * HARMONY_MULTIPLIER * 0.4;
              floatX = x + Math.cos(thinkingTime * 0.2) * HARMONY_MULTIPLIER * 0.1;
              break;
            case 'insight':
              // Insights flash and pulse with understanding
              const pulseIntensity = Math.sin(thinkingTime * 1.2) * 0.3;
              floatY = y + pulseIntensity * HARMONY_MULTIPLIER;
              break;
            case 'doubt':
              // Doubts waver and oscillate
              floatX = x + Math.sin(thinkingTime * 0.7) * HARMONY_MULTIPLIER * 0.25;
              floatZ = z + Math.cos(thinkingTime * 0.6) * HARMONY_MULTIPLIER * 0.25;
              break;
            case 'wonder':
              // Wonder spirals gently, exploring
              const spiralTime = thinkingTime * 0.4;
              floatX = x + Math.cos(spiralTime) * HARMONY_MULTIPLIER * 0.2;
              floatZ = z + Math.sin(spiralTime) * HARMONY_MULTIPLIER * 0.2;
              floatY = y + Math.sin(spiralTime * 0.5) * HARMONY_MULTIPLIER * 0.15;
              break;
            case 'truth':
              // Truth remains stable, with subtle breathing
              floatY = y + Math.sin(thinkingTime * 0.8) * HARMONY_MULTIPLIER * 0.1;
              break;
            case 'mystery':
              // Mysteries move in complex, unpredictable patterns
              floatX = x + Math.sin(thinkingTime * 0.33) * HARMONY_MULTIPLIER * 0.3;
              floatY = y + Math.cos(thinkingTime * 0.47) * HARMONY_MULTIPLIER * 0.2;
              floatZ = z + Math.sin(thinkingTime * 0.29) * HARMONY_MULTIPLIER * 0.25;
              break;
            default:
              // Default contemplative drift
              floatX = x + Math.sin(thinkingTime * 0.4 + fieldIndex) * HARMONY_MULTIPLIER * 0.2;
              floatY = y + Math.cos(thinkingTime * 0.2 + fieldIndex * 1.5) * HARMONY_MULTIPLIER * 0.3;
              floatZ = z + Math.sin(thinkingTime * 0.15 + fieldIndex * 2) * HARMONY_MULTIPLIER * 0.15;
          }
          
          // Consciousness responds to attention (mouse)
          const consciousnessScale = 1 + Math.sin(thinkingTime * 0.6 + fieldIndex) * 0.08;
          const attentionResponse = 1 + attentionInfluence * 0.15;
          
          dummyObject.current.position.set(floatX, floatY, floatZ);
          dummyObject.current.rotation.set(
            rx + thinkingTime * 0.08,
            ry + thinkingTime * 0.12,
            rz + thinkingTime * 0.06
          );
          dummyObject.current.scale.set(
            sx * consciousnessScale * attentionResponse,
            sy * consciousnessScale * attentionResponse,
            sz * consciousnessScale * attentionResponse
          );
          
          dummyObject.current.updateMatrix();
          instancedMesh.setMatrixAt(instanceIndex, dummyObject.current.matrix);
          
          // Colors shift like changing thoughts and emotions
          const emotionalShift = (timeRef.current * 8 + fieldIndex * 15) % 360;
          const contemplativeColor = new Color().setHSL(
            (emotionalShift / 360),
            0.3 + Math.sin(thinkingTime * 0.4) * 0.15, // Gentle saturation flow
            0.45 + Math.cos(thinkingTime * 0.25) * 0.12  // Subtle luminosity breathing
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
      {/* Philosophical Field Elements */}
      {instancedMeshes.map((meshData, index) => (
        <instancedMesh
          key={`philosophical-${index}`}
          ref={(ref) => {
            if (ref) fieldInstanceRefs.current[index] = ref;
          }}
          args={[meshData.geometry, undefined, meshData.count]}
        >
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.6 + Math.random() * 0.2, // Varied opacity for depth
              emissiveIntensity: 0.05 + Math.random() * 0.05,
              wireframe: Math.random() > 0.85 // Even fewer wireframes for clarity
            }} 
            color={color} 
          />
        </instancedMesh>
      ))}
    </>
  );
};

export default InstancedFieldElements;
