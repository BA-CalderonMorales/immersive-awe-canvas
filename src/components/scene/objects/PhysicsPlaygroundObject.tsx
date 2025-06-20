import { usePlane, useBox, useSphere } from '@react-three/cannon'
import { MeshWobbleMaterial } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Vector3 } from 'three'

interface PhysicsPlaygroundObjectProps {
  isGrabMode: boolean;
}

function useDrag(api: any, isGrabMode: boolean) {
  const { mouse, camera } = useThree()
  const [drag, setDrag] = useState(false)
  useFrame(() => {
    if (drag) {
      const vec = new Vector3(mouse.x, mouse.y, 0).unproject(camera)
      api.position.set(vec.x, vec.y, vec.z)
      api.velocity.set(0, 0, 0)
    }
  })
  return {
    onPointerDown: () => isGrabMode && setDrag(true),
    onPointerUp: () => setDrag(false),
    onPointerLeave: () => setDrag(false),
  }
}

const JellyBox = ({ position, color, isGrabMode }: { position: [number, number, number]; color: string; isGrabMode: boolean }) => {
  const [ref, api] = useBox(() => ({ mass: 1, position }))
  const bind = useDrag(api, isGrabMode)
  return (
    <mesh ref={ref} castShadow receiveShadow {...bind}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshWobbleMaterial color={color} factor={0.6} speed={2} />
    </mesh>
  )
}

const JellySphere = ({ position, color, isGrabMode }: { position: [number, number, number]; color: string; isGrabMode: boolean }) => {
  const [ref, api] = useSphere(() => ({ mass: 1, position }))
  const bind = useDrag(api, isGrabMode)
  return (
    <mesh ref={ref} castShadow receiveShadow {...bind}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <MeshWobbleMaterial color={color} factor={0.7} speed={2} />
    </mesh>
  )
}

const PhysicsPlaygroundObject = ({ isGrabMode }: PhysicsPlaygroundObjectProps) => {
  usePlane(() => ({ position: [0, -0.5, 0], rotation: [-Math.PI / 2, 0, 0] }))
  return (
    <>
      <JellyBox position={[0, 1, 0]} color="#ff69b4" isGrabMode={isGrabMode} />
      <JellySphere position={[2, 1, -1]} color="#87cefa" isGrabMode={isGrabMode} />
      <JellyBox position={[-2, 1, 1]} color="#98fb98" isGrabMode={isGrabMode} />
    </>
  )
}

export default PhysicsPlaygroundObject
