
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';

const World3 = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight groundColor="black" />
      <pointLight position={[5, 5, 5]} intensity={2} color="red" />
      <Stars radius={200} depth={60} count={3000} factor={5} saturation={1} fade speed={1.5} />
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#ff4500"
          distort={0.6}
          speed={3}
          roughness={0}
        />
      </Sphere>
    </>
  );
};

export default World3;
