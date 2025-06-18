
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

    // Comprehensive validation function with logging
    const validateAndClean = (obj: Record<string, any>) => {
        console.log('validateAndClean input:', obj);
        const cleaned: Record<string, any> = {};
        
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            console.log(`Validating ${key}:`, value, typeof value);
            
            // Skip undefined, null, NaN, or invalid values
            if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
                console.warn(`Skipping invalid value for ${key}:`, value);
                return;
            }
            
            // Type-specific validation with logging
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
                        const clampedValue = Math.max(0, Math.min(value, key === 'opacity' ? 1 : 10));
                        cleaned[key] = clampedValue;
                        console.log(`Set ${key} to:`, clampedValue);
                    } else {
                        console.warn(`Invalid numeric value for ${key}:`, value);
                    }
                    break;
                case 'color':
                case 'emissive':
                case 'specular':
                case 'specularColor':
                case 'groundColor':
                    if (typeof value === 'string' && value.length > 0) {
                        cleaned[key] = value;
                        console.log(`Set ${key} to:`, value);
                    } else {
                        console.warn(`Invalid string value for ${key}:`, value);
                    }
                    break;
                case 'wireframe':
                case 'transparent':
                    if (typeof value === 'boolean') {
                        cleaned[key] = value;
                        console.log(`Set ${key} to:`, value);
                    } else {
                        console.warn(`Invalid boolean value for ${key}:`, value);
                    }
                    break;
                default:
                    // For other properties, only include if they're valid and not undefined
                    if (value !== undefined && value !== null && !isNaN(value)) {
                        cleaned[key] = value;
                        console.log(`Set ${key} to:`, value);
                    } else {
                        console.warn(`Skipping unknown property ${key}:`, value);
                    }
            }
        });
        
        console.log('validateAndClean output:', cleaned);
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

    // Prepare base properties with strict defaults and validation
    const baseProps = useMemo(() => {
        console.log('Creating baseProps with materialConfig:', materialConfig);
        
        const safeColor = color && typeof color === 'string' ? color : '#ffffff';
        console.log('Using safe color:', safeColor);
        
        // Define all possible properties with proper typing
        const rawProps: Record<string, any> = {
            color: safeColor,
            wireframe: Boolean(materialConfig.wireframe),
            transparent: Boolean(materialConfig.transparent),
            opacity: typeof materialConfig.opacity === 'number' && !isNaN(materialConfig.opacity) ? materialConfig.opacity : 1.0,
        };
        
        // Add emissive properties only if they exist and are valid
        if (materialConfig.emissive && typeof materialConfig.emissive === 'string') {
            rawProps.emissive = materialConfig.emissive;
        }
        if (typeof materialConfig.emissiveIntensity === 'number' && !isNaN(materialConfig.emissiveIntensity)) {
            rawProps.emissiveIntensity = materialConfig.emissiveIntensity;
        }
        
        const props = validateAndClean(rawProps);
        console.log('Final baseProps:', props);
        return props;
    }, [materialConfig, color]);

    // Get material type with fallback and validation
    const materialType = materialConfig.materialType && typeof materialConfig.materialType === 'string' ? materialConfig.materialType : 'standard';
    console.log('Using material type:', materialType);

    // Render materials with proper prop validation and error boundaries
    switch (materialType) {
        case 'physical':
            const physicalProps = validateAndClean({
                ...baseProps,
                roughness: typeof materialConfig.roughness === 'number' && !isNaN(materialConfig.roughness) ? materialConfig.roughness : 0.5,
                metalness: typeof materialConfig.metalness === 'number' && !isNaN(materialConfig.metalness) ? materialConfig.metalness : 0.0,
                clearcoat: typeof materialConfig.clearcoat === 'number' && !isNaN(materialConfig.clearcoat) ? materialConfig.clearcoat : 0.0,
                clearcoatRoughness: typeof materialConfig.clearcoatRoughness === 'number' && !isNaN(materialConfig.clearcoatRoughness) ? materialConfig.clearcoatRoughness : 0.0,
                ior: typeof materialConfig.ior === 'number' && !isNaN(materialConfig.ior) ? materialConfig.ior : 1.5,
                thickness: typeof materialConfig.thickness === 'number' && !isNaN(materialConfig.thickness) ? materialConfig.thickness : 0.0,
                specularIntensity: typeof materialConfig.specularIntensity === 'number' && !isNaN(materialConfig.specularIntensity) ? materialConfig.specularIntensity : 1.0,
                specularColor: materialConfig.specularColor && typeof materialConfig.specularColor === 'string' ? materialConfig.specularColor : '#ffffff',
            });
            console.log('Rendering meshPhysicalMaterial with props:', physicalProps);
            return <meshPhysicalMaterial {...physicalProps} />;

        case 'toon':
            const toonProps = validateAndClean(baseProps);
            console.log('Rendering meshToonMaterial with props:', toonProps);
            return (
                <meshToonMaterial
                    {...toonProps}
                    gradientMap={materialConfig.gradientMap === 'five' ? gradientMaps.fiveTone : gradientMaps.threeTone}
                />
            );

        case 'matcap':
            const matcapProps = validateAndClean(baseProps);
            console.log('Rendering meshMatcapMaterial with props:', matcapProps);
            return <meshMatcapMaterial {...matcapProps} matcap={matcap} />;

        case 'lambert':
            const lambertProps = validateAndClean(baseProps);
            console.log('Rendering meshLambertMaterial with props:', lambertProps);
            return <meshLambertMaterial {...lambertProps} />;

        case 'phong':
            const phongProps = validateAndClean({
                ...baseProps,
                shininess: typeof materialConfig.shininess === 'number' && !isNaN(materialConfig.shininess) ? materialConfig.shininess : 30,
                specular: materialConfig.specularColor && typeof materialConfig.specularColor === 'string' ? materialConfig.specularColor : '#111111',
            });
            console.log('Rendering meshPhongMaterial with props:', phongProps);
            return <meshPhongMaterial {...phongProps} />;

        case 'normal':
            const normalProps = validateAndClean({
                wireframe: baseProps.wireframe,
                transparent: baseProps.transparent,
                opacity: baseProps.opacity,
            });
            console.log('Rendering meshNormalMaterial with props:', normalProps);
            return <meshNormalMaterial {...normalProps} />;

        case 'basic':
            const basicProps = validateAndClean(baseProps);
            console.log('Rendering meshBasicMaterial with props:', basicProps);
            return <meshBasicMaterial {...basicProps} />;

        case 'standard':
        default:
            const standardProps = validateAndClean({
                ...baseProps,
                roughness: typeof materialConfig.roughness === 'number' && !isNaN(materialConfig.roughness) ? materialConfig.roughness : 0.5,
                metalness: typeof materialConfig.metalness === 'number' && !isNaN(materialConfig.metalness) ? materialConfig.metalness : 0.0,
            });
            console.log('Rendering meshStandardMaterial with props:', standardProps);
            return <meshStandardMaterial {...standardProps} />;
    }
};

export default DynamicMaterial;
