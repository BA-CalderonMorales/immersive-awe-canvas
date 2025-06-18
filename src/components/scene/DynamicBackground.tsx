
import { Sky, Stars, Sparkles, Cloud, Environment } from '@react-three/drei';
import { BackgroundConfig, ExtraConfig } from '@/types/scene';
import VoidBackground from './effects/VoidBackground';
import GradientBackground from './effects/GradientBackground';
import NoiseBackground from './effects/NoiseBackground';
import PlasmaBackground from './effects/PlasmaBackground';
import AuroraBackground from './effects/AuroraBackground';
import { useExperience } from '@/hooks/useExperience';

const DynamicBackground = ({ background, extras }: { background: BackgroundConfig, extras?: ExtraConfig[] }) => {
  const { theme } = useExperience();
  
  switch (background.type) {
    case 'sky':
      // @ts-ignore
      return <Sky sunPosition={background.sunPosition} />;
    
    case 'stars':
      return (
        <>
          <color attach="background" args={['#000008']} />
          {/* @ts-ignore */}
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
          {/* @ts-ignore */}
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
            density={background.density}
          />
          <color attach="background" args={[background.color || '#ffffff']} />
          
          {/* Render extra clouds if provided */}
          {extras?.map((extra, i) => {
            if (extra.type === 'cloud') {
              // @ts-ignore
              return <Cloud key={`extra-cloud-${i}`} {...extra} frustumCulled={false} />
            }
            return null
          })}
          
          {/* Add default atmospheric clouds if no extras provided */}
          {(!extras || extras.length === 0) && (
            <>
              <Cloud position={[-15, -8, -20]} speed={0.1} opacity={0.2} segments={30} frustumCulled={false} />
              <Cloud position={[12, 6, -25]} speed={0.08} opacity={0.18} segments={25} frustumCulled={false} />
              <Cloud position={[0, 0, -35]} speed={0.12} opacity={0.15} segments={35} frustumCulled={false} />
            </>
          )}
        </>
      );
    
    case 'environment':
      return (
        <>
          {/* @ts-ignore */}
          <Environment preset={background.preset} background blur={background.blur} />
          
          {/* Add atmospheric clouds for environment backgrounds too */}
          {extras?.map((extra, i) => {
            if (extra.type === 'cloud') {
              // @ts-ignore
              return <Cloud key={`env-cloud-${i}`} {...extra} frustumCulled={false} />
            }
            return null
          })}
        </>
      );
    
    default:
      return null;
  }
};

export default DynamicBackground;
