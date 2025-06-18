
import { MaterialConfig } from '@/types/scene';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMatcapTexture } from '@react-three/drei';
import { useMemo } from 'react';

interface DynamicMaterialProps {
    materialConfig: MaterialConfig;
    color: string;
}

const DynamicMaterial = ({ materialConfig, color }: DynamicMaterialProps) => {
    const { gl } = useThree();

    // Helper function to filter out undefined values and validate
    const filterUndefined = (obj: Record<string, any>) => {
        const filtered: Record<string, any> = {};
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (value !== undefined && value !== null) {
                // Additional validation for specific properties
                if (key === 'opacity' && (typeof value !== 'number' || isNaN(value))) {
                    filtered[key] = 1.0;
                } else if (key === 'emissiveIntensity' && (typeof value !== 'number' || isNaN(value))) {
                    filtered[key] = 0.0;
                } else {
                    filtered[key] = value;
                }
            }
        });
        return filtered;
    };

    // Memoize gradient maps to prevent recreation on every render
    const gradientMaps = useMemo(() => {
        const fiveTone = new THREE.DataTexture(
            new Uint8Array([0, 0, 0, 64, 64, 64, 128, 128, 128, 192, 192, 192, 255, 255, 255]), 
            5, 1, THREE.RedFormat, THREE.UnsignedByteType
        );
        fiveTone.minFilter = THREE.NearestFilter;
        fiveTone.magFilter = THREE.NearestFilter;
        fiveTone.needsUpdate = true;
        
        const threeTone = new THREE.DataTexture(
            new Uint8Array([0, 0, 0, 128, 128, 128, 255, 255, 255]), 
            3, 1, THREE.RedFormat, THREE.UnsignedByteType
        );
        threeTone.minFilter = THREE.NearestFilter;
        threeTone.magFilter = THREE.NearestFilter;
        threeTone.needsUpdate = true;

        return { fiveTone, threeTone };
    }, []);

    const MATCAP_TEXTURES = {
        chrome: '3B3C3F_DAD9D5_929290_ABACA8',
        purple: '4F439F_A28BE5_8570D6_7765C9',
        gold: '5A492B_DEC583_987D4D_AC9C74',
    };
    
    const [matcap] = useMatcapTexture(MATCAP_TEXTURES[materialConfig.matcapTexture || 'chrome'], 256);

    // Validate and prepare common properties
    const commonProps = useMemo(() => filterUndefined({
        color: color || '#ffffff',
        wireframe: materialConfig.wireframe,
        emissive: materialConfig.emissive,
        emissiveIntensity: materialConfig.emissiveIntensity,
        transparent: materialConfig.transparent,
        opacity: materialConfig.opacity,
    }), [materialConfig, color]);

    // Ensure material type is valid
    const materialType = materialConfig.materialType || 'standard';

    switch (materialType) {
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
                gradientMap={materialConfig.gradientMap === 'five' ? gradientMaps.fiveTone : gradientMaps.threeTone}
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
