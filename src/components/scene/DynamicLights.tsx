
import { LightConfig } from '@/types/scene';
import AnimatedPointLight from './lights/AnimatedPointLight';

const DynamicLights = ({ lights }: { lights: LightConfig[] }) => {
  return (
    <>
      {lights.map((light, index) => {
        const { type, ref, ...props } = light;
        const key = `light-${index}`;

        if (type === 'point' && ref) {
          return <AnimatedPointLight key={key} animationType={ref} {...props} />;
        }

        switch (type) {
          case 'ambient':
            // @ts-ignore
            return <ambientLight key={key} {...props} />;
          case 'directional':
            // @ts-ignore
            return <directionalLight key={key} {...props} />;
          case 'point':
            // @ts-ignore
            return <pointLight key={key} {...props} />;
          case 'hemisphere':
            // @ts-ignore
            return <hemisphereLight key={key} {...props} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default DynamicLights;
