
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
        return (
          <>
            <fog attach="fog" args={[background.color || '#ffffff', background.near || 0, background.far || 20]} />
            <color attach="background" args={[background.color || '#ffffff']} />
            {extras?.map((extra, i) => {
              if (extra.type === 'cloud') {
                // @ts-ignore
                return <Cloud key={`cloud-${i}`} {...extra} />
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
