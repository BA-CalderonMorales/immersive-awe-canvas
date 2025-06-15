
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight as PointLightImpl } from 'three';

type AnimationType = 'pulsing' | 'flicker' | 'swirl' | 'slowPulse';

interface AnimatedPointLightProps {
  animationType: AnimationType;
  intensity?: number;
  position?: [number, number, number];
  [key: string]: any;
}

const AnimatedPointLight = ({ animationType, ...props }: AnimatedPointLightProps) => {
  const lightRef = useRef<PointLightImpl>(null!);
  const initialIntensity = props.intensity || 1;
  const initialPosition = props.position || [0, 0, 0];

  useFrame(({ clock }) => {
    if (!lightRef.current) return;

    const time = clock.getElapsedTime();

    switch (animationType) {
      case 'pulsing':
        lightRef.current.intensity = initialIntensity * (1 + Math.sin(time * 2));
        break;
      case 'flicker':
        lightRef.current.intensity = initialIntensity * (Math.random() > 0.1 ? 1 : 0.5);
        break;
      case 'swirl':
        lightRef.current.position.x = initialPosition[0] + Math.sin(time * 0.5) * 2;
        lightRef.current.position.y = initialPosition[1] + Math.cos(time * 0.5) * 2;
        break;
      case 'slowPulse':
        lightRef.current.intensity = initialIntensity * (1 + Math.sin(time * 0.5) * 0.5);
        break;
    }
  });

  return <pointLight ref={lightRef} {...props} />;
};

export default AnimatedPointLight;
