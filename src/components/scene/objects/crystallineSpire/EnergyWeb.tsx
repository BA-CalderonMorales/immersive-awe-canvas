
import { MaterialConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import DynamicMaterial from '../../materials/DynamicMaterial';

interface EnergyWebProps {
  color: string;
  materialConfig: MaterialConfig;
}

const EnergyWeb = ({ color, materialConfig }: EnergyWebProps) => {
  const { theme } = useExperience();

  return (
    <group>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 12;
        return (
          <mesh
            key={`energy-web-${i}`}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.02, 0.02, radius * 2, 8]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: theme === 'day' ? 0.1 : 0.2,
                emissive: color,
                emissiveIntensity: 0.8
              }}
              color={color}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default EnergyWeb;
