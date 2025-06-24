
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

    // Base material properties optimized for performance
    const baseProps = {
        color: color,
        wireframe: materialConfig.wireframe || false,
        transparent: materialConfig.transparent || false,
        opacity: materialConfig.opacity || 1.0,
    };

    // Enhanced unlit properties for better visual quality
    const unlitProps = {
        ...baseProps,
        emissive: materialConfig.emissive || color,
        emissiveIntensity: materialConfig.emissiveIntensity || 0.2,
    };

    // Performance-optimized material selection
    switch (materialConfig.materialType) {
        case 'matcap':
            return <meshMatcapMaterial {...baseProps} matcap={matcap} />;
        
        case 'basic':
            return <meshBasicMaterial {...unlitProps} />;
        
        case 'normal':
            return <meshNormalMaterial {...baseProps} />;
        
        // All other materials default to optimized basic material
        case 'toon':
        case 'lambert':
        case 'phong':
        case 'physical':
        case 'standard':
        default:
            return <meshBasicMaterial {...unlitProps} />;
    }
};

export default DynamicMaterial;
