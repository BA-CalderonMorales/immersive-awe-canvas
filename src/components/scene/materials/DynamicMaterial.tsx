
import { MaterialConfig } from '@/types/scene';
import { useMatcapTexture } from '@react-three/drei';

interface DynamicMaterialProps {
    materialConfig: MaterialConfig;
    color: string;
}

const DynamicMaterial = ({ materialConfig, color }: DynamicMaterialProps) => {
    // Matcap textures for unlit shading performance
    const MATCAP_TEXTURES = {
        chrome: '3B3C3F_DAD9D5_929290_ABACA8',
        purple: '4F439F_A28BE5_8570D6_7765C9',
        gold: '5A492B_DEC583_987D4D_AC9C74',
    };
    
    const [matcap] = useMatcapTexture(MATCAP_TEXTURES[materialConfig.matcapTexture || 'chrome'], 256);

    // Common properties optimized for performance
    const commonProps = {
        color: color,
        wireframe: materialConfig.wireframe,
        transparent: materialConfig.transparent,
        opacity: materialConfig.opacity,
    };

    // Unlit material properties for better performance
    const unlitProps = {
        ...commonProps,
        emissive: materialConfig.emissive || color,
        emissiveIntensity: materialConfig.emissiveIntensity || 0.3,
    };

    // Use unlit materials for better performance across devices
    switch (materialConfig.materialType) {
        case 'matcap':
            return <meshMatcapMaterial {...commonProps} matcap={matcap} />;
        
        case 'basic':
            return <meshBasicMaterial {...unlitProps} />;
        
        case 'normal':
            return <meshNormalMaterial {...commonProps} />;
        
        case 'toon':
        case 'lambert':
        case 'phong':
        case 'physical':
        case 'standard':
        default:
            // Default to basic material with emissive properties for unlit look
            return <meshBasicMaterial {...unlitProps} />;
    }
};

export default DynamicMaterial;
