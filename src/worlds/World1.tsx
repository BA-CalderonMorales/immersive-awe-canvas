
import { TorusKnot, MeshDistortMaterial, Stars } from '@react-three/drei';

const World1 = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <TorusKnot args={[1, 0.4, 256, 32]}>
        <MeshDistortMaterial
          color="#f97316"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.1}
          metalness={0.1}
        />
      </TorusKnot>
    </>
  );
};

export default World1;
