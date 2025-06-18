
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

    // Helper function to filter out undefined values
    const filterUndefined = (obj: Record<string, any>) => {
        const filtered: Record<string, any> = {};
        Object.keys(obj).forEach(key => {
            if (obj[key] !== undefined) {
                filtered[key] = obj[key];
            }
        });
        return filtered;
    };

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
    
    const [matcap] = useMatcapTexture(MATCAP_TEXTURES[materialConfig.matcapTexture || 'chrome'], 256);

    const commonProps = filterUndefined({
        color: color,
        wireframe: materialConfig.wireframe,
        emissive: materialConfig.emissive,
        emissiveIntensity: materialConfig.emissiveIntensity,
        transparent: materialConfig.transparent,
        opacity: materialConfig.opacity,
    });

    switch (materialConfig.materialType) {
        case 'physical':
            return <meshPhysicalMaterial
                {...commonProps}
                {...filterUndefined({
                    roughness: materialConfig.roughness,
                    metalness: materialConfig.metalness,
                    clearcoat: materialConfig.clearcoat,
                    clearcoatRoughness: materialConfig.clearcoatRoughness,
                    ior: materialConfig.ior,
                    thickness: materialConfig.thickness,
                    specularIntensity: materialConfig.specularIntensity,
                    specularColor: materialConfig.specularColor,
                })}
            />;
        case 'toon':
            return <meshToonMaterial
                {...commonProps}
                gradientMap={materialConfig.gradientMap === 'five' ? fiveTone : threeTone}
            />;
        case 'matcap':
            return <meshMatcapMaterial {...commonProps} matcap={matcap} />;
        case 'lambert':
            return <meshLambertMaterial {...commonProps} />;
        case 'phong':
            return <meshPhongMaterial 
                {...commonProps} 
                {...filterUndefined({
                    shininess: materialConfig.shininess,
                    specular: materialConfig.specularColor,
                })}
            />;
        case 'normal':
            return <meshNormalMaterial {...commonProps} />;
        case 'basic':
            return <meshBasicMaterial {...commonProps} />;
        case 'standard':
        default:
            return <meshStandardMaterial
                {...commonProps}
                {...filterUndefined({
                    roughness: materialConfig.roughness,
                    metalness: materialConfig.metalness,
                })}
            />;
    }
};

export default DynamicMaterial;
