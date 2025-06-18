
import { useRef, useMemo, useEffect } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Group, Vector3, BufferGeometry, Float32BufferAttribute, InstancedMesh, Object3D, Matrix4, Color, CylinderGeometry, ConeGeometry, RingGeometry } from 'three';
import DynamicMaterial from '../materials/DynamicMaterial';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

// Rick's Interdimensional Chaos Generator™ - because boring is for Jerry!
const RICK_FIELD_COUNT = 200;
const CHAOS_MULTIPLIER = 5;

const generateChaoticField = () => {
  const positions = [];
  const scales = [];
  const rotations = [];
  const types = [];
  const colors = [];
  
  for (let i = 0; i < RICK_FIELD_COUNT; i++) {
    // Chaotic position distribution - some clustered, some scattered
    const clusterChance = Math.random();
    let x, y, z;
    
    if (clusterChance < 0.4) {
      // Dense central chaos cluster
      x = (Math.random() - 0.5) * 4;
      y = (Math.random() - 0.5) * 3;
      z = (Math.random() - 0.5) * 4;
    } else if (clusterChance < 0.7) {
      // Orbital ring of madness
      const angle = (i / RICK_FIELD_COUNT) * Math.PI * 6 + Math.random();
      const radius = 5 + Math.random() * 3;
      x = Math.cos(angle) * radius;
      y = (Math.random() - 0.5) * 6;
      z = Math.sin(angle) * radius;
    } else {
      // Scattered interdimensional debris
      x = (Math.random() - 0.5) * 20;
      y = (Math.random() - 0.5) * 15;
      z = (Math.random() - 0.5) * 20;
    }
    
    positions.push([x, y, z]);
    scales.push([
      0.1 + Math.random() * 0.8,
      0.1 + Math.random() * 0.8,
      0.1 + Math.random() * 0.8
    ]);
    rotations.push([
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ]);
    
    // Different geometry types for maximum chaos
    types.push(Math.floor(Math.random() * 8));
    
    // Chaotic color variations
    const hue = (i * 7 + Math.random() * 60) % 360;
    colors.push(`hsl(${hue}, ${70 + Math.random() * 30}%, ${40 + Math.random() * 40}%)`);
  }
  
  return { positions, scales, rotations, types, colors };
};

// Rick's Procedural Geometry Factory - each one different!
const createRickGeometry = (type: number, scale: [number, number, number]) => {
  const [sx, sy, sz] = scale;
  const baseSize = Math.max(sx, sy, sz);
  
  switch (type) {
    case 0: // Chaotic Crystal Spikes
      return new ConeGeometry(baseSize * 0.5, baseSize * 2, 6 + Math.floor(Math.random() * 8));
    case 1: // Dimensional Tubes
      return new CylinderGeometry(
        baseSize * 0.3, 
        baseSize * 0.1, 
        baseSize * 1.5, 
        8 + Math.floor(Math.random() * 8)
      );
    case 2: // Portal Rings
      return new RingGeometry(
        baseSize * 0.3, 
        baseSize * 0.8, 
        6 + Math.floor(Math.random() * 10),
        2 + Math.floor(Math.random() * 4)
      );
    case 3: // Chaos Polyhedron
      const vertices = [];
      const vertexCount = 8 + Math.floor(Math.random() * 12);
      for (let i = 0; i < vertexCount; i++) {
        vertices.push(
          (Math.random() - 0.5) * baseSize,
          (Math.random() - 0.5) * baseSize,
          (Math.random() - 0.5) * baseSize
        );
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      return geometry;
    case 4: // Interdimensional Spikes
      return new ConeGeometry(baseSize * 0.2, baseSize * 3, 3 + Math.floor(Math.random() * 5));
    case 5: // Reality Fragments
      const fragVertices = [];
      for (let i = 0; i < 30; i++) {
        fragVertices.push(
          (Math.random() - 0.5) * baseSize * 2,
          (Math.random() - 0.5) * baseSize * 2,
          (Math.random() - 0.5) * baseSize * 2
        );
      }
      const fragGeometry = new BufferGeometry();
      fragGeometry.setAttribute('position', new Float32BufferAttribute(fragVertices, 3));
      return fragGeometry;
    case 6: // Dimensional Discs
      return new RingGeometry(0, baseSize, 16, 1);
    default: // Chaotic Polyhedra
      return new CylinderGeometry(
        baseSize * (0.1 + Math.random() * 0.4),
        baseSize * (0.1 + Math.random() * 0.4),
        baseSize * (0.5 + Math.random() * 1.5),
        3 + Math.floor(Math.random() * 9)
      );
  }
};

const WobbleFieldObject = ({ color, materialConfig, isLocked }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const fieldInstanceRefs = useRef<InstancedMesh[]>([]);
  const { mouse } = useThree();
  const timeRef = useRef(0);
  const dummyObject = useRef(new Object3D());
  const matrix = useRef(new Matrix4());

  // Generate the chaotic field data
  const fieldData = useMemo(() => generateChaoticField(), []);
  
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
    
    if (groupRef.current) {
      // Master field rotation with chaotic wobbles
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.2;
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.2) * 0.1;
      
      // Mouse creates dimensional distortions
      groupRef.current.scale.setScalar(1 + mouseInfluence * 0.1);
    }

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
    <group ref={groupRef}>
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
      
      {/* Central Interdimensional Core */}
      <mesh scale={0.8}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshWobbleMaterial
          color={color}
          speed={8}
          factor={1.2}
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Chaotic Energy Streams */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4 + Math.sin(i) * 2;
        return (
          <mesh 
            key={`energy-stream-${i}`}
            position={[
              Math.cos(angle + timeRef.current * 0.5) * radius,
              Math.sin(timeRef.current * 0.8 + i) * 3,
              Math.sin(angle + timeRef.current * 0.5) * radius
            ]}
            rotation={[timeRef.current * 2 + i, timeRef.current * 1.5, 0]}
            scale={[0.1, 2 + Math.sin(timeRef.current * 3 + i), 0.1]}
          >
            <cylinderGeometry args={[0.1, 0.05, 1, 6]} />
            <DynamicMaterial 
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.7,
                emissiveIntensity: 0.8,
                wireframe: true
              }} 
              color={`hsl(${(i * 30 + timeRef.current * 50) % 360}, 80%, 60%)`} 
            />
          </mesh>
        );
      })}
      
      {/* Dimensional Portal Effects */}
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={`portal-${i}`}
          position={[
            Math.cos(i * Math.PI / 3) * 6,
            Math.sin(timeRef.current * 0.4 + i) * 2,
            Math.sin(i * Math.PI / 3) * 6
          ]}
          rotation={[0, timeRef.current * 2 + i, Math.PI / 2]}
          scale={1 + Math.sin(timeRef.current * 4 + i) * 0.5}
        >
          <ringGeometry args={[1, 1.5, 16]} />
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.3,
              emissiveIntensity: 0.6
            }} 
            color={`hsl(${(i * 60 + timeRef.current * 30) % 360}, 90%, 70%)`} 
          />
        </mesh>
      ))}
    </group>
  );
};

export default WobbleFieldObject;
