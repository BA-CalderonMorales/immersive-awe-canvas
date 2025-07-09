
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
            return <ambientLight key={key} {...props} />;
          case 'directional':
            return <directionalLight key={key} {...props} />;
          case 'point':
            return <pointLight key={key} {...props} />;
          case 'hemisphere':
            return <hemisphereLight key={key} {...props} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default DynamicLights;
