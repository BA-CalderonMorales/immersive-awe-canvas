
import { Sky, Stars, Sparkles, Cloud, Environment } from '@react-three/drei';
import { BackgroundConfig, ExtraConfig } from '@/types/scene';
import VoidBackground from './effects/VoidBackground';
import { useExperience } from '@/hooks/useExperience';

const DynamicBackground = ({ background, extras }: { background: BackgroundConfig, extras?: ExtraConfig[] }) => {
  const { theme } = useExperience();
  
  switch (background.type) {
    case 'sky':
      // @ts-ignore
      return <Sky sunPosition={background.sunPosition} />;
    case 'stars':
      // @ts-ignore
      return <Stars {...background} />;
    case 'sparkles':
      return (
        <>
          <VoidBackground theme={theme} />
          {/* @ts-ignore */}
          <Sparkles {...background} />
        </>
      );
    case 'color':
        return <color attach="background" args={[background.color || '#000000']} />;
    case 'fog':
        return (
          <>
            <fog attach="fog" args={[background.color || '#ffffff', background.near || 0, background.far || 20]} />
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
            
            {/* Add atmospheric enhancement for better crystal visibility */}
            <fog attach="fog" args={['#000020', 15, 40]} />
            
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
