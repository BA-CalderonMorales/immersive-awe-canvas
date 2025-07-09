
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight } from 'three';

interface AnimatedPointLightProps {
  animationType: 'pulsing' | 'flicker' | 'swirl' | 'slowPulse';
  color?: string;
  position?: [number, number, number];
  intensity?: number;
}

const AnimatedPointLight = ({ 
  animationType, 
  color = '#ffffff', 
  position = [0, 0, 0], 
  intensity = 1 
}: AnimatedPointLightProps) => {
  const lightRef = useRef<PointLight>(null!);
  const timeRef = useRef(0);
  const baseIntensity = intensity;

  useFrame((state) => {
    if (!lightRef.current) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    switch (animationType) {
      case 'pulsing':
        // Fast, rhythmic pulsing like a heartbeat
        lightRef.current.intensity = baseIntensity * (0.5 + Math.sin(timeRef.current * 3) * 0.5);
        break;
      case 'flicker': {
        // Erratic flickering like candlelight or electrical interference
        const flicker = Math.sin(timeRef.current * 8) * 0.3 + 
                       Math.sin(timeRef.current * 12.7) * 0.2 + 
                       Math.sin(timeRef.current * 5.3) * 0.15;
        lightRef.current.intensity = baseIntensity * (0.7 + flicker * 0.3);
        break;
      }
      case 'swirl': {
        // Orbital movement with intensity variation - like consciousness flowing
        const swirlIntensity = 0.6 + Math.sin(timeRef.current * 1.5) * 0.4;
        lightRef.current.intensity = baseIntensity * swirlIntensity;
        
        // Add subtle orbital movement
        const radius = 0.8;
        lightRef.current.position.x = position[0] + Math.cos(timeRef.current * 0.7) * radius;
        lightRef.current.position.z = position[2] + Math.sin(timeRef.current * 0.7) * radius;
        lightRef.current.position.y = position[1] + Math.sin(timeRef.current * 0.4) * 0.5;
        break;
      }
      case 'slowPulse':
        // Deep, meditative breathing rhythm
        lightRef.current.intensity = baseIntensity * (0.4 + Math.sin(timeRef.current * 0.8) * 0.6);
        break;
      default:
        lightRef.current.intensity = baseIntensity;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color={color}
      position={position}
      intensity={intensity}
      distance={30}
      decay={2}
    />
  );
};

export default AnimatedPointLight;
