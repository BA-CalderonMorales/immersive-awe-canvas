
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
            // @ts-expect-error - Three.js light props are not fully typed
            return <ambientLight key={key} {...props} />;
          case 'directional':
            // @ts-expect-error - Three.js light props are not fully typed
            return <directionalLight key={key} {...props} />;
          case 'point':
            // @ts-expect-error - Three.js light props are not fully typed
            return <pointLight key={key} {...props} />;
          case 'hemisphere':
            // @ts-expect-error - Three.js light props are not fully typed
            return <hemisphereLight key={key} {...props} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default DynamicLights;
