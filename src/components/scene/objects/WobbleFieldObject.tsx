
import { useRef, useMemo } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Group, Vector3, CatmullRomCurve3, Mesh } from 'three';
import DynamicMaterial from '../materials/DynamicMaterial';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

// Rick's chaotic field generator - because normal fields are for Jerry!
const generateFieldPositions = () => {
  const positions = [];
  const centerWeight = 0.3; // Probability of spawning near center
  
  for (let i = 0; i < 15; i++) {
    let x, y, z;
    
    if (Math.random() < centerWeight) {
      // Central cluster for dramatic effect
      x = (Math.random() - 0.5) * 3;
      y = (Math.random() - 0.5) * 2;
      z = (Math.random() - 0.5) * 3;
    } else {
      // Outer ring of chaos
      const angle = (i / 15) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 4 + Math.random() * 2;
      x = Math.cos(angle) * radius;
      y = (Math.random() - 0.5) * 4;
      z = Math.sin(angle) * radius;
    }
    
    positions.push([x, y, z]);
  }
  return positions;
};

// Geometries that Rick would approve of - with CORRECT TypeScript args!
const getRandomGeometry = (index: number) => {
  const geometries = [
    { type: 'icosahedron', args: [0.8 + Math.random() * 0.4, Math.floor(Math.random() * 3)] },
    { type: 'dodecahedron', args: [0.6 + Math.random() * 0.5] },
    { type: 'octahedron', args: [0.9 + Math.random() * 0.3] },
    { type: 'tetrahedron', args: [1.1 + Math.random() * 0.4] },
    { type: 'torus', args: [0.6, 0.2 + Math.random() * 0.2, 8, 16] },
    { type: 'torusKnot', args: [0.5, 0.15, 32, 8, 2 + Math.floor(Math.random() * 3), 3 + Math.floor(Math.random() * 4)] },
  ];
  
  return geometries[index % geometries.length];
};

const WobbleFieldObject = ({ color, materialConfig, isLocked }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const fieldElements = useRef<any[]>([]);
  const connectionRefs = useRef<Mesh[]>([]);
  const { mouse } = useThree();
  const timeRef = useRef(0);

  // Generate chaotic field positions
  const fieldPositions = useMemo(() => generateFieldPositions(), []);
  
  // Create connection paths between nearby elements
  const connectionPaths = useMemo(() => {
    const paths = [];
    for (let i = 0; i < fieldPositions.length; i++) {
      for (let j = i + 1; j < fieldPositions.length; j++) {
        const pos1 = new Vector3(...fieldPositions[i]);
        const pos2 = new Vector3(...fieldPositions[j]);
        const distance = pos1.distanceTo(pos2);
        
        // Only connect nearby elements for that chaotic web effect
        if (distance < 4 && Math.random() > 0.6) {
          const midPoint = pos1.clone().lerp(pos2, 0.5);
          midPoint.y += (Math.random() - 0.5) * 2; // Add some curve chaos
          
          const curve = new CatmullRomCurve3([
            pos1,
            midPoint,
            pos2
          ]);
          
          paths.push({ curve, distance });
        }
      }
    }
    return paths;
  }, [fieldPositions]);

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Slow orbital rotation of the entire field
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.2) * 0.1;
      
      // Mouse interaction creates field distortion
      const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
      groupRef.current.rotation.z = MathUtils.lerp(
        groupRef.current.rotation.z,
        mouse.x * 0.15,
        0.02
      );
    }

    // Animate individual field elements with chaotic behavior
    fieldElements.current.forEach((element, index) => {
      if (element) {
        const offset = index * 0.7;
        const chaos = Math.sin(timeRef.current * 1.5 + offset) * 0.3;
        const mouseBoost = Math.abs(mouse.x + mouse.y) * 0.4;
        
        // Wobble factor varies chaotically
        element.factor = MathUtils.lerp(
          element.factor,
          0.4 + chaos + mouseBoost,
          0.04
        );
        
        // Speed varies with position and time
        element.speed = MathUtils.lerp(
          element.speed,
          2 + Math.sin(timeRef.current * 0.8 + offset * 2) * 1.5 + mouseBoost * 3,
          0.03
        );
      }
    });

    // Animate connection tubes
    connectionRefs.current.forEach((connection, index) => {
      if (connection) {
        const offset = index * 0.4;
        connection.rotation.z += 0.02 + Math.sin(timeRef.current + offset) * 0.01;
        connection.scale.setScalar(0.8 + Math.sin(timeRef.current * 2 + offset) * 0.3);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* The chaotic field elements */}
      {fieldPositions.map((position, index) => {
        const scale = 0.7 + Math.random() * 0.6;
        const geometry = getRandomGeometry(index);
        const opacity = index < 3 ? 1 : 0.7 + Math.random() * 0.3; // Hero elements vs supporting cast
        
        return (
          <mesh 
            key={`field-${index}`} 
            position={position as [number, number, number]} 
            scale={scale}
            rotation={[
              Math.random() * Math.PI, 
              Math.random() * Math.PI, 
              Math.random() * Math.PI
            ]}
          >
            {/* Render different geometries based on type - FIXED ARGS! */}
            {geometry.type === 'icosahedron' && <icosahedronGeometry args={geometry.args as [number?, number?]} />}
            {geometry.type === 'dodecahedron' && <dodecahedronGeometry args={geometry.args as [number?]} />}
            {geometry.type === 'octahedron' && <octahedronGeometry args={geometry.args as [number?]} />}
            {geometry.type === 'tetrahedron' && <tetrahedronGeometry args={geometry.args as [number?]} />}
            {geometry.type === 'torus' && <torusGeometry args={geometry.args as [number?, number?, number?, number?]} />}
            {geometry.type === 'torusKnot' && <torusKnotGeometry args={geometry.args as [number?, number?, number?, number?, number?, number?]} />}
            
            <MeshWobbleMaterial
              ref={(ref) => { 
                if (ref) fieldElements.current[index] = ref;
              }}
              color={index < 3 ? color : `hsl(${(index * 40) % 360}, 70%, 60%)`} // Color variation
              speed={2}
              factor={0.4}
              transparent={opacity < 1}
              opacity={opacity}
              wireframe={Math.random() > 0.7} // Some wireframe chaos
            />
          </mesh>
        );
      })}
      
      {/* Energy connection tubes between field elements */}
      {connectionPaths.map((path, index) => (
        <mesh 
          key={`connection-${index}`}
          ref={(ref) => {
            if (ref) connectionRefs.current[index] = ref;
          }}
        >
          <tubeGeometry 
            args={[
              path.curve,
              20, 
              0.02 + Math.random() * 0.03, // Varying tube thickness
              6, 
              false
            ]} 
          />
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.4 + Math.random() * 0.3,
              emissiveIntensity: 0.5,
              wireframe: Math.random() > 0.8
            }} 
            color={`hsl(${(index * 60) % 360}, 80%, 50%)`} 
          />
        </mesh>
      ))}
      
      {/* Central energy core - the heart of the chaos */}
      <mesh scale={0.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshWobbleMaterial
          color="#ffffff"
          speed={5}
          factor={0.8}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Orbital ring elements for extra visual flair */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3;
        return (
          <mesh 
            key={`orbital-${i}`}
            position={[
              Math.cos(angle + timeRef.current * 0.5) * radius,
              Math.sin(timeRef.current * 0.3 + i) * 0.5,
              Math.sin(angle + timeRef.current * 0.5) * radius
            ]}
            scale={0.2}
          >
            <boxGeometry args={[1, 0.2, 0.2]} />
            <DynamicMaterial 
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.6,
                emissiveIntensity: 0.4
              }} 
              color={color} 
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default WobbleFieldObject;
