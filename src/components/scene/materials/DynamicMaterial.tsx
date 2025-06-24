
import { MaterialConfig } from '@/types/scene';
import { useMatcapTexture } from '@react-three/drei';

interface DynamicMaterialProps {
    materialConfig: MaterialConfig;
    color: string;
}

const DynamicMaterial = ({ materialConfig, color }: DynamicMaterialProps) => {
    // Matcap texture configuration for unlit performance
    const MATCAP_TEXTURES = {
        chrome: '3B3C3F_DAD9D5_929290_ABACA8',
        purple: '4F439F_A28BE5_8570D6_7765C9',
        gold: '5A492B_DEC583_987D4D_AC9C74',
    };
    
    const [matcap] = useMatcapTexture(
        MATCAP_TEXTURES[materialConfig.matcapTexture as keyof typeof MATCAP_TEXTURES] || MATCAP_TEXTURES.chrome, 
        256
    );

    // FIXED: Ensure all properties are always defined to prevent undefined uniforms
    const safeBaseProps = {
        color: color || '#ffffff',
        wireframe: Boolean(materialConfig.wireframe),
        transparent: Boolean(materialConfig.transparent),
        opacity: typeof materialConfig.opacity === 'number' ? Math.max(0, Math.min(1, materialConfig.opacity)) : 1.0,
    };

    // FIXED: Always provide emissive properties to prevent undefined uniforms error
    const safeUnlitProps = {
        ...safeBaseProps,
        emissive: materialConfig.emissive || '#000000',
        emissiveIntensity: typeof materialConfig.emissiveIntensity === 'number' ? materialConfig.emissiveIntensity : 0.0
    };

    // Performance-optimized material selection with safety checks
    switch (materialConfig.materialType) {
        case 'matcap':
            return <meshMatcapMaterial {...safeBaseProps} matcap={matcap} />;
        
        case 'normal':
            return <meshNormalMaterial {...safeBaseProps} />;
        
        case 'standard':
            return (
                <meshStandardMaterial 
                    {...safeBaseProps}
                    roughness={typeof materialConfig.roughness === 'number' ? materialConfig.roughness : 0.5}
                    metalness={typeof materialConfig.metalness === 'number' ? materialConfig.metalness : 0.5}
                    emissive={materialConfig.emissive || '#000000'}
                    emissiveIntensity={typeof materialConfig.emissiveIntensity === 'number' ? materialConfig.emissiveIntensity : 0}
                />
            );
        
        case 'basic':
        default:
            // FIXED: Always provide complete uniform set to prevent Three.js errors
            return <meshBasicMaterial {...safeUnlitProps} />;
    }
};

export default DynamicMaterial;
