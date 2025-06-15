
import { TorusKnot, Stars } from '@react-three/drei';

const World1 = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <TorusKnot args={[1, 0.4, 256, 32]}>
        <meshStandardMaterial
          color="#f97316"
          roughness={0}
          metalness={0.8}
        />
      </TorusKnot>
    </>
  );
};

export default World1;
