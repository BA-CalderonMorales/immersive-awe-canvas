
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

    // Comprehensive validation function
    const validateAndClean = (obj: Record<string, any>) => {
        const cleaned: Record<string, any> = {};
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            
            // Skip undefined, null, or invalid values
            if (value === undefined || value === null) {
                return;
            }
            
            // Type-specific validation
            switch (key) {
                case 'opacity':
                case 'roughness':
                case 'metalness':
                case 'emissiveIntensity':
                case 'clearcoat':
                case 'clearcoatRoughness':
                case 'ior':
                case 'thickness':
                case 'specularIntensity':
                case 'shininess':
                    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
                        cleaned[key] = Math.max(0, Math.min(value, key === 'opacity' ? 1 : 10));
                    }
                    break;
                case 'color':
                case 'emissive':
                case 'specular':
                case 'specularColor':
                case 'groundColor':
                    if (typeof value === 'string' && value.length > 0) {
                        cleaned[key] = value;
                    }
                    break;
                case 'wireframe':
                case 'transparent':
                    if (typeof value === 'boolean') {
                        cleaned[key] = value;
                    }
                    break;
                default:
                    // For other properties, only include if they're valid
                    if (value !== undefined && value !== null) {
                        cleaned[key] = value;
                    }
            }
        });
        return cleaned;
    };

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

    // Prepare base properties with defaults
    const baseProps = useMemo(() => {
        const props = validateAndClean({
            color: color || '#ffffff',
            wireframe: materialConfig.wireframe || false,
            transparent: materialConfig.transparent || false,
            opacity: materialConfig.opacity !== undefined ? materialConfig.opacity : 1.0,
        });
        
        // Add emissive properties only if they exist
        if (materialConfig.emissive) {
            props.emissive = materialConfig.emissive;
            props.emissiveIntensity = materialConfig.emissiveIntensity !== undefined ? materialConfig.emissiveIntensity : 0.0;
        }
        
        return props;
    }, [materialConfig, color]);

    // Get material type with fallback
    const materialType = materialConfig.materialType || 'standard';

    // Render materials with proper prop validation
    switch (materialType) {
        case 'physical':
            const physicalProps = validateAndClean({
                ...baseProps,
                roughness: materialConfig.roughness !== undefined ? materialConfig.roughness : 0.5,
                metalness: materialConfig.metalness !== undefined ? materialConfig.metalness : 0.0,
                clearcoat: materialConfig.clearcoat || 0.0,
                clearcoatRoughness: materialConfig.clearcoatRoughness || 0.0,
                ior: materialConfig.ior || 1.5,
                thickness: materialConfig.thickness || 0.0,
                specularIntensity: materialConfig.specularIntensity || 1.0,
                specularColor: materialConfig.specularColor || '#ffffff',
            });
            return <meshPhysicalMaterial {...physicalProps} />;

        case 'toon':
            const toonProps = validateAndClean(baseProps);
            return (
                <meshToonMaterial
                    {...toonProps}
                    gradientMap={materialConfig.gradientMap === 'five' ? gradientMaps.fiveTone : gradientMaps.threeTone}
                />
            );

        case 'matcap':
            const matcapProps = validateAndClean(baseProps);
            return <meshMatcapMaterial {...matcapProps} matcap={matcap} />;

        case 'lambert':
            const lambertProps = validateAndClean(baseProps);
            return <meshLambertMaterial {...lambertProps} />;

        case 'phong':
            const phongProps = validateAndClean({
                ...baseProps,
                shininess: materialConfig.shininess || 30,
                specular: materialConfig.specularColor || '#111111',
            });
            return <meshPhongMaterial {...phongProps} />;

        case 'normal':
            const normalProps = validateAndClean({
                wireframe: baseProps.wireframe,
                transparent: baseProps.transparent,
                opacity: baseProps.opacity,
            });
            return <meshNormalMaterial {...normalProps} />;

        case 'basic':
            const basicProps = validateAndClean(baseProps);
            return <meshBasicMaterial {...basicProps} />;

        case 'standard':
        default:
            const standardProps = validateAndClean({
                ...baseProps,
                roughness: materialConfig.roughness !== undefined ? materialConfig.roughness : 0.5,
                metalness: materialConfig.metalness !== undefined ? materialConfig.metalness : 0.0,
            });
            return <meshStandardMaterial {...standardProps} />;
    }
};

export default DynamicMaterial;
