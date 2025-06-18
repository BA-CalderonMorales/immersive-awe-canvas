
import { useRef } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Group, CatmullRomCurve3, Vector3 } from 'three';
import DynamicMaterial from '../materials/DynamicMaterial';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const WobbleFieldObject = ({ color, materialConfig, isLocked }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const fieldElements = useRef<any[]>([]);
  const { mouse } = useThree();
  const timeRef = useRef(0);

  // Create multiple field elements for a true "field" effect
  const fieldPositions = [
    [0, 0, 0],      // Center
    [-3, 1, -2],    // Left
    [3, -1, -2],    // Right
    [0, 3, -3],     // Top
    [0, -3, -3],    // Bottom
    [-2, -2, 1],    // Back left
    [2, 2, 1],      // Back right
  ];

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime();
    
    if (!isLocked && groupRef.current) {
      // Rotate the entire field slowly
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;

      // Animate individual field elements
      fieldElements.current.forEach((element, index) => {
        if (element) {
          const offset = index * 0.5;
          const mouseInfluence = (mouse.x + mouse.y) * 0.5;
          
          // Wobble effect based on time and mouse
          element.factor = MathUtils.lerp(
            element.factor,
            0.3 + Math.sin(timeRef.current * 2 + offset) * 0.4 + Math.abs(mouseInfluence) * 0.3,
            0.05
          );
          
          // Speed variation
          element.speed = MathUtils.lerp(
            element.speed,
            1.5 + Math.sin(timeRef.current * 0.8 + offset) * 1 + Math.abs(mouseInfluence) * 2,
            0.03
          );
        }
      });

      // Mouse interaction - tilt the entire field
      if (mouse.x !== 0 || mouse.y !== 0) {
        groupRef.current.rotation.z = MathUtils.lerp(
          groupRef.current.rotation.z,
          mouse.x * 0.2,
          0.05
        );
      }
    }
  });

  return (
    <group ref={groupRef}>
      {fieldPositions.map((position, index) => {
        const scale = index === 0 ? 1.2 : 0.6 + Math.random() * 0.4;
        const geometryType = index % 3;
        
        return (
          <mesh key={index} position={position as [number, number, number]} scale={scale}>
            {/* Vary geometry types for visual interest */}
            {geometryType === 0 && <icosahedronGeometry args={[1, 2]} />}
            {geometryType === 1 && <octahedronGeometry args={[1.2]} />}
            {geometryType === 2 && <tetrahedronGeometry args={[1.3]} />}
            
            <MeshWobbleMaterial
              ref={(ref) => { 
                if (ref) fieldElements.current[index] = ref;
              }}
              color={color}
              speed={1.5}
              factor={0.5}
              transparent={index !== 0}
              opacity={index === 0 ? 1 : 0.7}
            />
          </mesh>
        );
      })}
      
      {/* Add connecting energy lines/tubes */}
      <mesh position={[-1.5, 0.5, -1]} rotation={[0, 0, Math.PI / 4]}>
        <tubeGeometry args={[
          // Simple curve connecting two points
          new CatmullRomCurve3([
            new Vector3(0, 0, 0),
            new Vector3(1, 0.5, 0),
            new Vector3(2, 0, 0)
          ]),
          20, 0.05, 8, false
        ]} />
        <DynamicMaterial materialConfig={{
          ...materialConfig,
          transparent: true,
          opacity: 0.6,
          emissiveIntensity: 0.3
        }} color={color} />
      </mesh>
      
      <mesh position={[1.5, -0.5, -1]} rotation={[0, 0, -Math.PI / 4]}>
        <tubeGeometry args={[
          new CatmullRomCurve3([
            new Vector3(0, 0, 0),
            new Vector3(-1, -0.5, 0),
            new Vector3(-2, 0, 0)
          ]),
          20, 0.05, 8, false
        ]} />
        <DynamicMaterial materialConfig={{
          ...materialConfig,
          transparent: true,
          opacity: 0.6,
          emissiveIntensity: 0.3
        }} color={color} />
      </mesh>
    </group>
  );
};

export default WobbleFieldObject;
