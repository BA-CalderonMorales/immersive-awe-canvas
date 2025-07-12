import { Sky, Stars, Sparkles, Cloud, Environment } from '@react-three/drei';
import { BackgroundConfig, ExtraConfig } from '@/types/scene';
import VoidBackground from './effects/VoidBackground';
import GradientBackground from './effects/GradientBackground';
import NoiseBackground from './effects/NoiseBackground';
import PlasmaBackground from './effects/PlasmaBackground';
import AuroraBackground from './effects/AuroraBackground';
import SunsetBackground from './effects/SunsetBackground';
import { useExperience } from '@/hooks/useExperience';

interface DynamicBackgroundProps {
  background: BackgroundConfig;
  extras?: ExtraConfig[];
}

const DynamicBackground = ({ background, extras }: DynamicBackgroundProps) => {
  const { theme } = useExperience();
  
  // Early return for unsupported types
  if (!background?.type) return null;
  
  const renderClouds = () => {
    if (!extras?.length) {
      return (
        <>
          <Cloud position={[-15, -8, -20]} speed={0.1} opacity={0.2} segments={30} frustumCulled={false} />
          <Cloud position={[12, 6, -25]} speed={0.08} opacity={0.18} segments={25} frustumCulled={false} />
          <Cloud position={[0, 0, -35]} speed={0.12} opacity={0.15} segments={35} frustumCulled={false} />
        </>
      );
    }
    
    return extras.map((extra, i) => {
      if (extra.type !== 'cloud') return null;
      return <Cloud key={`cloud-${i}`} {...extra} frustumCulled={false} />;
    });
  };
  
  switch (background.type) {
    case 'sky':
      return (
        <>
           <Sky 
            sunPosition={background.sunPosition || [120, 25, 80]} 
            turbidity={(background as any).atmosphericDensity || 1.2}
            rayleigh={(background as any).lightScattering || 1.5}
          />
          {/* Add subtle atmospheric movement */}
          <mesh scale={[8000, 8000, 8000]} renderOrder={-995}>
            <sphereGeometry args={[1, 64, 32]} />
            <meshBasicMaterial 
              color="#f0f4f8"
              transparent
              opacity={0.1}
              side={2}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        </>
      );
    
    case 'stars':
      return (
        <>
          <color attach="background" args={['#000008']} />
          <Stars 
            radius={background.radius || 300}
            depth={background.depth || 80}
            count={background.count || 8000}
            factor={background.factor || 6}
            saturation={background.saturation || 0.1}
            fade={background.fade !== false}
            speed={background.speed || 0.3}
          />
          {/* Add atmospheric glow for living feeling */}
          <mesh scale={[5000, 5000, 5000]} renderOrder={-998}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial 
              color="#0a0f1a"
              transparent
              opacity={(background as any).atmosphericGlow || 0.2}
              side={2}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        </>
      );
    
    case 'sparkles':
      return (
        <>
          <VoidBackground theme={theme} />
          <Sparkles 
            count={background.count || 300}
            scale={background.scale || 25}
            size={background.size || 3}
            speed={background.speed || 0.2}
            opacity={background.opacity || 0.8}
            color={background.color || '#e6f3ff'}
          />
          {/* Add energy field layers for organic feeling */}
          <mesh scale={[6000, 6000, 6000]} renderOrder={-997}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial 
              color="#1a237e"
              transparent
              opacity={0.15}
              side={2}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        </>
      );
    
    case 'color':
      return (
        <>
          <color attach="background" args={[background.color || '#000000']} />
          {background.colorTop && background.colorBottom && (
            <GradientBackground config={background} />
          )}
        </>
      );
    
    case 'gradient':
      return (
        <>
          <color attach="background" args={[background.colorBottom || '#000000']} />
          <GradientBackground config={background} />
        </>
      );
    
    case 'noise':
      return (
        <>
          <color attach="background" args={[background.color || '#1a1a2e']} />
          <NoiseBackground config={background} />
        </>
      );
    
    case 'plasma':
      return (
        <>
          <color attach="background" args={['#000011']} />
          <PlasmaBackground config={background} />
        </>
      );
    
    case 'aurora':
      return (
        <>
          <color attach="background" args={['#000011']} />
          <AuroraBackground config={background} />
        </>
      );
    
    case 'sunset':
      return (
        <>
          <color attach="background" args={['#1a1a2e']} />
          <SunsetBackground config={background} />
        </>
      );
    
    case 'void':
      return <VoidBackground theme={theme} />;
    
    case 'fog':
      return (
        <>
          <fog 
            attach="fog" 
            args={[
              background.color || '#f8fafc', 
              background.near || 5, 
              background.far || 200
            ]} 
          />
          <color attach="background" args={[background.color || '#f8fafc']} />
          {/* Enhanced atmospheric layers for breathing effect */}
          <mesh scale={[12000, 12000, 12000]} renderOrder={-996}>
            <sphereGeometry args={[1, 64, 32]} />
            <meshBasicMaterial 
              color={background.color || '#f8fafc'}
              transparent
              opacity={(background as any).ambientGlow || 0.3}
              side={2}
              depthWrite={false}
              fog={false}
            />
          </mesh>
          {renderClouds()}
        </>
      );
    
    case 'environment':
      return (
        <>
          <Environment 
            preset={background.preset || 'city'} 
            background 
            blur={background.blur || 0.1}
          />
          {/* Add atmospheric perspective for depth */}
          <mesh scale={[10000, 10000, 10000]} renderOrder={-994}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial 
              color="#2a2a3a"
              transparent
              opacity={0.08}
              side={2}
              depthWrite={false}
              fog={false}
            />
          </mesh>
          {renderClouds()}
        </>
      );
    
    default:
      return null;
  }
};

export default DynamicBackground;