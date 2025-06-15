
import { Sky, Stars, Sparkles, Cloud } from '@react-three/drei';
import { BackgroundConfig, ExtraConfig } from '@/types/scene';

const DynamicBackground = ({ background, extras }: { background: BackgroundConfig, extras?: ExtraConfig[] }) => {
  switch (background.type) {
    case 'sky':
      // @ts-ignore
      return <Sky sunPosition={background.sunPosition} />;
    case 'stars':
      // @ts-ignore
      return <Stars {...background} />;
    case 'sparkles':
        // @ts-ignore
        return <Sparkles {...background} />;
    case 'fog':
        const hasClouds = extras?.some(e => e.type === 'cloud');
        return (
          <>
            <fog attach="fog" args={[background.color || '#ffffff', background.near || 0, background.far || 20]} />
            <color attach="background" args={[background.color || '#ffffff']} />
            {!hasClouds && ( // Add default clouds if none are provided
              <>
                <Cloud position={[-10, -5, -15]} speed={0.2} opacity={0.3} segments={40} frustumCulled={false} />
                <Cloud position={[10, 5, -20]} speed={0.2} opacity={0.25} segments={40} frustumCulled={false} />
              </>
            )}
            {extras?.map((extra, i) => {
              if (extra.type === 'cloud') {
                // @ts-ignore
                return <Cloud key={`cloud-${i}`} {...extra} frustumCulled={false} />
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
