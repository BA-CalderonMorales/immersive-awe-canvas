
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
        MATCAP_TEXTURES[materialConfig.matcapTexture || 'chrome'], 
        256
    );

    // Safer base material properties to prevent undefined uniforms
    const safeBaseProps = {
        color: color || '#ffffff',
        wireframe: Boolean(materialConfig.wireframe),
        transparent: Boolean(materialConfig.transparent),
        opacity: typeof materialConfig.opacity === 'number' ? materialConfig.opacity : 1.0,
    };

    // Enhanced unlit properties with safety checks
    const safeUnlitProps = {
        ...safeBaseProps,
        // Only set emissive if we have valid values to prevent undefined uniforms
        ...(materialConfig.emissive && {
            emissive: materialConfig.emissive,
            emissiveIntensity: typeof materialConfig.emissiveIntensity === 'number' 
                ? materialConfig.emissiveIntensity 
                : 0.2
        })
    };

    // Performance-optimized material selection with safety checks
    switch (materialConfig.materialType) {
        case 'matcap':
            return <meshMatcapMaterial {...safeBaseProps} matcap={matcap} />;
        
        case 'normal':
            return <meshNormalMaterial {...safeBaseProps} />;
        
        case 'basic':
        default:
            // Default to basic material for best performance and compatibility
            return <meshBasicMaterial {...safeUnlitProps} />;
    }
};

export default DynamicMaterial;
