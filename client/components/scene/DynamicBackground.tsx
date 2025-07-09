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
      return <Sky sunPosition={background.sunPosition || [100, 20, 100]} />;
    
    case 'stars':
      return (
        <>
          <color attach="background" args={['#000008']} />
          <Stars 
            radius={background.radius || 100}
            depth={background.depth || 50}
            count={background.count || 5000}
            factor={background.factor || 4}
            saturation={background.saturation || 0}
            fade={background.fade !== false}
            speed={background.speed || 1}
          />
        </>
      );
    
    case 'sparkles':
      return (
        <>
          <VoidBackground theme={theme} />
          <Sparkles 
            count={background.count || 100}
            scale={background.scale || 10}
            size={background.size || 2}
            speed={background.speed || 0.3}
            opacity={background.opacity || 1}
            color={background.color || '#ffffff'}
          />
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
      return <GradientBackground config={background} />;
    
    case 'noise':
      return <NoiseBackground config={background} />;
    
    case 'plasma':
      return <PlasmaBackground config={background} />;
    
    case 'aurora':
      return <AuroraBackground config={background} />;
    
    case 'sunset':
      return <SunsetBackground config={background} />;
    
    case 'void':
      return <VoidBackground theme={theme} />;
    
    case 'fog':
      return (
        <>
          <fog 
            attach="fog" 
            args={[
              background.color || '#ffffff', 
              background.near || 1, 
              background.far || 100
            ]} 
          />
          <color attach="background" args={[background.color || '#ffffff']} />
          {renderClouds()}
        </>
      );
    
    case 'environment':
      return (
        <>
          <Environment preset={background.preset || 'sunset'} background blur={background.blur} />
          {renderClouds()}
        </>
      );
    
    default:
      return null;
  }
};

export default DynamicBackground;