
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

const useKeyPress = () => {
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const onKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return keys;
};

const KeyboardControls = () => {
  const keys = useKeyPress();
  const speed = 3;

  useFrame(({ camera }, delta) => {
    const moveSpeed = speed * delta;
    
    if (keys.current['ArrowUp'] || keys.current['KeyW']) {
      camera.translateY(moveSpeed);
    }
    if (keys.current['ArrowDown'] || keys.current['KeyS']) {
      camera.translateY(-moveSpeed);
    }
    if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
      camera.translateX(-moveSpeed);
    }
    if (keys.current['ArrowRight'] || keys.current['KeyD']) {
      camera.translateX(moveSpeed);
    }
  });

  return null;
};

export default KeyboardControls;
