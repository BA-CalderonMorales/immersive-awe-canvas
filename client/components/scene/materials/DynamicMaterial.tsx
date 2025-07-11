
import { MaterialConfig } from '@/types/scene';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMatcapTexture } from '@react-three/drei';

interface DynamicMaterialProps {
    materialConfig: MaterialConfig;
    color: string;
}

const DynamicMaterial = ({ materialConfig, color }: DynamicMaterialProps) => {
    const { gl } = useThree();

    // Re-usable gradient maps for toon material
    const fiveTone = new THREE.DataTexture(new Uint8Array([0, 0, 0, 64, 64, 64, 128, 128, 128, 192, 192, 192, 255, 255, 255]), 5, 1, THREE.RedFormat, THREE.UnsignedByteType);
    fiveTone.minFilter = THREE.NearestFilter;
    fiveTone.magFilter = THREE.NearestFilter;
    fiveTone.needsUpdate = true;
    
    const threeTone = new THREE.DataTexture(new Uint8Array([0, 0, 0, 128, 128, 128, 255, 255, 255]), 3, 1, THREE.RedFormat, THREE.UnsignedByteType);
    threeTone.minFilter = THREE.NearestFilter;
    threeTone.magFilter = THREE.NearestFilter;
    threeTone.needsUpdate = true;

    const MATCAP_TEXTURES = {
        chrome: '3B3C3F_DAD9D5_929290_ABACA8',
        purple: '4F439F_A28BE5_8570D6_7765C9',
        gold: '5A492B_DEC583_987D4D_AC9C74',
    };
    
    // Safe matcap texture loading with fallback
    const matcapKey = materialConfig.matcapTexture as keyof typeof MATCAP_TEXTURES || 'chrome';
    const [matcap] = useMatcapTexture(MATCAP_TEXTURES[matcapKey] || MATCAP_TEXTURES.chrome, 256);

    const commonProps = {
        color: color,
        wireframe: materialConfig.wireframe || false,
        emissive: materialConfig.emissive || '#000000',
        emissiveIntensity: materialConfig.emissiveIntensity || 0,
        transparent: materialConfig.transparent || false,
        opacity: materialConfig.opacity !== undefined ? materialConfig.opacity : 1,
    };

    switch (materialConfig.materialType) {
        case 'physical':
            return <meshPhysicalMaterial
                {...commonProps}
                roughness={materialConfig.roughness !== undefined ? materialConfig.roughness : 0.5}
                metalness={materialConfig.metalness !== undefined ? materialConfig.metalness : 0}
                clearcoat={materialConfig.clearcoat || 0}
                clearcoatRoughness={materialConfig.clearcoatRoughness || 0}
                ior={materialConfig.ior || 1.5}
                thickness={materialConfig.thickness || 0}
                specularIntensity={materialConfig.specularIntensity || 1}
                specularColor={materialConfig.specularColor || '#ffffff'}
            />;
        case 'toon':
            return <meshToonMaterial
                {...commonProps}
                gradientMap={materialConfig.gradientMap === 'five' ? fiveTone : threeTone}
            />;
        case 'matcap':
            return <meshMatcapMaterial 
                {...commonProps} 
                matcap={matcap}
            />;
        case 'lambert':
            return <meshLambertMaterial {...commonProps} />;
        case 'phong':
            return <meshPhongMaterial 
                {...commonProps} 
                shininess={materialConfig.shininess !== undefined ? materialConfig.shininess : 30} 
                specular={materialConfig.specularColor || '#111111'} 
            />;
        case 'normal':
            return <meshNormalMaterial 
                wireframe={materialConfig.wireframe || false}
                transparent={materialConfig.transparent || false}
                opacity={materialConfig.opacity !== undefined ? materialConfig.opacity : 1}
            />;
        case 'basic':
            return <meshBasicMaterial {...commonProps} />;
        case 'standard':
        default:
            return <meshStandardMaterial
                {...commonProps}
                roughness={materialConfig.roughness !== undefined ? materialConfig.roughness : 0.5}
                metalness={materialConfig.metalness !== undefined ? materialConfig.metalness : 0}
            />;
    }
};

export default DynamicMaterial;
