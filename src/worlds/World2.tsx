
import { Box, MeshWobbleMaterial, Stars } from '@react-three/drei';
import { useMemo } from 'react';

const World2 = () => {
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
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1} color="lightblue" />
      <Stars radius={100} depth={50} count={2000} factor={7} saturation={0} fade speed={2} />
      {boxes.map((box, i) => (
        <Box key={i} args={[box.scale, box.scale, box.scale]} position={box.position}>
          <MeshWobbleMaterial
            color="#1e90ff"
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
