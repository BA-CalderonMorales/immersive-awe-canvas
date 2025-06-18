
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

    console.log('DynamicMaterial render - materialConfig:', materialConfig);
    console.log('DynamicMaterial render - color:', color);

    // Memoize gradient maps to prevent recreation
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

    // Safe value helpers
    const safeColor = color && typeof color === 'string' ? color : '#ffffff';
    const safeOpacity = typeof materialConfig.opacity === 'number' && !isNaN(materialConfig.opacity) ? materialConfig.opacity : 1.0;
    const safeWireframe = Boolean(materialConfig.wireframe);
    const safeTransparent = Boolean(materialConfig.transparent);

    // Get material type with fallback
    const materialType = materialConfig.materialType && typeof materialConfig.materialType === 'string' ? materialConfig.materialType : 'standard';
    console.log('Using material type:', materialType);

    // Common props for all materials
    const commonProps = {
        color: safeColor,
        wireframe: safeWireframe,
        transparent: safeTransparent,
        opacity: safeOpacity,
    };

    // Add emissive properties if they exist
    if (materialConfig.emissive && typeof materialConfig.emissive === 'string') {
        commonProps.emissive = materialConfig.emissive;
    }
    if (typeof materialConfig.emissiveIntensity === 'number' && !isNaN(materialConfig.emissiveIntensity)) {
        commonProps.emissiveIntensity = materialConfig.emissiveIntensity;
    }

    // Render materials with only the props they expect
    switch (materialType) {
        case 'physical':
            const physicalProps = {
                ...commonProps,
                roughness: typeof materialConfig.roughness === 'number' && !isNaN(materialConfig.roughness) ? materialConfig.roughness : 0.5,
                metalness: typeof materialConfig.metalness === 'number' && !isNaN(materialConfig.metalness) ? materialConfig.metalness : 0.0,
                clearcoat: typeof materialConfig.clearcoat === 'number' && !isNaN(materialConfig.clearcoat) ? materialConfig.clearcoat : 0.0,
                clearcoatRoughness: typeof materialConfig.clearcoatRoughness === 'number' && !isNaN(materialConfig.clearcoatRoughness) ? materialConfig.clearcoatRoughness : 0.0,
                ior: typeof materialConfig.ior === 'number' && !isNaN(materialConfig.ior) ? materialConfig.ior : 1.5,
                thickness: typeof materialConfig.thickness === 'number' && !isNaN(materialConfig.thickness) ? materialConfig.thickness : 0.0,
                specularIntensity: typeof materialConfig.specularIntensity === 'number' && !isNaN(materialConfig.specularIntensity) ? materialConfig.specularIntensity : 1.0,
                specularColor: materialConfig.specularColor && typeof materialConfig.specularColor === 'string' ? materialConfig.specularColor : '#ffffff',
            };
            return <meshPhysicalMaterial {...physicalProps} />;

        case 'toon':
            return (
                <meshToonMaterial
                    {...commonProps}
                    gradientMap={materialConfig.gradientMap === 'five' ? gradientMaps.fiveTone : gradientMaps.threeTone}
                />
            );

        case 'matcap':
            return <meshMatcapMaterial {...commonProps} matcap={matcap} />;

        case 'lambert':
            return <meshLambertMaterial {...commonProps} />;

        case 'phong':
            const phongProps = {
                ...commonProps,
                shininess: typeof materialConfig.shininess === 'number' && !isNaN(materialConfig.shininess) ? materialConfig.shininess : 30,
                specular: materialConfig.specularColor && typeof materialConfig.specularColor === 'string' ? materialConfig.specularColor : '#111111',
            };
            return <meshPhongMaterial {...phongProps} />;

        case 'normal':
            const normalProps = {
                wireframe: safeWireframe,
                transparent: safeTransparent,
                opacity: safeOpacity,
            };
            return <meshNormalMaterial {...normalProps} />;

        case 'basic':
            return <meshBasicMaterial {...commonProps} />;

        case 'standard':
        default:
            const standardProps = {
                ...commonProps,
                roughness: typeof materialConfig.roughness === 'number' && !isNaN(materialConfig.roughness) ? materialConfig.roughness : 0.5,
                metalness: typeof materialConfig.metalness === 'number' && !isNaN(materialConfig.metalness) ? materialConfig.metalness : 0.0,
            };
            return <meshStandardMaterial {...standardProps} />;
    }
};

export default DynamicMaterial;
