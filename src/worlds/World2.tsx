
import { Box, MeshWobbleMaterial, Stars, Cloud } from '@react-three/drei';
import { useMemo } from 'react';
import { useExperience } from '@/hooks/useExperience';

const World2 = () => {
  const { theme } = useExperience();

  const boxes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        scale: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 2 + 0.5,
        factor: Math.random() + 1,
      });
    }
    return temp;
  }, []);

  return (
    <>
      {theme === 'day' ? (
        <>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="white" />
          <Cloud position={[-4, -2, -25]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, 2, -15]} speed={0.2} opacity={0.3} />
          <Cloud position={[-4, 2, -10]} speed={0.2} opacity={0.4} />
           <fog attach="fog" args={['#aaccff', 0, 20]} />
        </>
      ) : (
        <>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={1} color="lightblue" />
          <Stars radius={100} depth={50} count={2000} factor={7} saturation={0} fade speed={2} />
        </>
      )}

      {boxes.map((box, i) => (
        <Box key={i} args={[box.scale, box.scale, box.scale]} position={box.position}>
          <MeshWobbleMaterial
            color={theme === 'day' ? '#4682b4' : '#1e90ff'}
            factor={box.factor}
            speed={box.speed}
            roughness={0.2}
          />
        </Box>
      ))}
    </>
  );
};

export default World2;
