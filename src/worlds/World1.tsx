
import { TorusKnot, Stars, Sky } from '@react-three/drei';
import { useExperience } from '@/hooks/useExperience';

const World1 = () => {
  const { theme } = useExperience();

  return (
    <>
      {theme === 'day' ? (
        <>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Sky sunPosition={[10, 10, 5]} />
        </>
      ) : (
        <>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#f97316" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />
          <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </>
      )}
      <TorusKnot args={[1, 0.4, 256, 32]}>
        <meshStandardMaterial
          color="#f97316"
          roughness={theme === 'day' ? 0.5 : 0}
          metalness={theme === 'day' ? 0.3 : 0.8}
        />
      </TorusKnot>
    </>
  );
};

export default World1;
