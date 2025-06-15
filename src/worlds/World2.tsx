
import { Box, MeshWobbleMaterial, Stars } from '@react-three/drei';

const World2 = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="lightblue" />
      <Stars radius={100} depth={50} count={2000} factor={7} saturation={0} fade speed={2} />
      <Box args={[2, 2, 2]}>
        <MeshWobbleMaterial
          color="#1e90ff"
          factor={2}
          speed={1}
          roughness={0.2}
        />
      </Box>
    </>
  );
};

export default World2;
