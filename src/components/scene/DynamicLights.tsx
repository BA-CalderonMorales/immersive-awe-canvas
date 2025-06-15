
import { LightConfig } from '@/types/scene';

const DynamicLights = ({ lights }: { lights: LightConfig[] }) => {
  return (
    <>
      {lights.map((light, index) => {
        const { type, ...props } = light;
        const key = `light-${index}`;
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
