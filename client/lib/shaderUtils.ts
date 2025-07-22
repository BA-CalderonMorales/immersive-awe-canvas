// Shared shader utilities for production-grade effects
// This eliminates ~300 lines of duplicated code across background effects

import * as THREE from "three";

export const ShaderLibrary = {
    // Common noise functions used across all shaders
    noise: {
        // High-quality 3D hash function for randomness
        hash3: `
      vec3 hash3(vec3 p) {
        p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                 dot(p, vec3(269.5, 183.3, 246.1)),
                 dot(p, vec3(113.5, 271.9, 124.6)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }
    `,

        // Production-grade 3D Simplex noise
        simplex3d: `
      float simplex3d(vec3 p) {
        const float K1 = 0.333333333;
        const float K2 = 0.166666667;
        
        vec3 i = floor(p + (p.x + p.y + p.z) * K1);
        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
        
        vec3 e = step(vec3(0.0), d0 - d0.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);
        
        vec3 d1 = d0 - (i1 - 1.0 * K2);
        vec3 d2 = d0 - (i2 - 2.0 * K2);
        vec3 d3 = d0 - (1.0 - 3.0 * K2);
        
        vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
        vec4 n = h * h * h * h * vec4(dot(d0, hash3(i)), dot(d1, hash3(i + i1)),
                                      dot(d2, hash3(i + i2)), dot(d3, hash3(i + 1.0)));
        return dot(vec4(31.316), n);
      }
    `,

        // Fractal Brownian Motion with configurable octaves
        fbm: `
      float fbm(vec3 p, int octaves, float frequency, float amplitude) {
        float value = 0.0;
        float currentAmplitude = amplitude;
        float currentFrequency = frequency;
        
        for(int i = 0; i < 8; i++) {
          if(i >= octaves) break;
          value += currentAmplitude * simplex3d(p * currentFrequency);
          currentFrequency *= 2.02;
          currentAmplitude *= 0.485;
        }
        return value;
      }
    `,

        // Optimized FBM with default parameters
        fbmDefault: `
      float fbm(vec3 p, int octaves) {
        return fbm(p, octaves, 1.0, 0.5);
      }
    `,
    },

    // Color manipulation utilities
    color: {
        // HSV to RGB conversion for richer color palettes
        hsv2rgb: `
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
    `,

        // Professional color grading with gamma correction
        colorGrading: `
      vec3 colorGrade(vec3 color, float contrast, float brightness, float saturation) {
        // Gamma correction
        color = pow(color, vec3(1.0 / 2.2));
        
        // Saturation adjustment
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(luminance), color, saturation);
        
        // Contrast and brightness
        color = ((color - 0.5) * contrast + 0.5) * brightness;
        
        // Back to linear space
        return pow(clamp(color, 0.0, 1.0), vec3(2.2));
      }
    `,
    },

    // Atmospheric and physics effects
    atmospheric: {
        // Rayleigh scattering for realistic atmosphere
        rayleighScattering: `
      vec3 rayleighScattering(float cosTheta, vec3 wavelength) {
        const float PI = 3.14159265359;
        return (3.0 / (16.0 * PI)) * (1.0 + cosTheta * cosTheta) / pow(wavelength, vec3(4.0));
      }
    `,

        // Mie scattering with Henyey-Greenstein phase function
        miePhase: `
      float miePhase(float cosTheta, float g) {
        const float PI = 3.14159265359;
        float g2 = g * g;
        return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
      }
    `,

        // Volumetric scattering approximation
        volumetricScattering: `
      float computeVolumetricScattering(vec3 rayPos, vec3 lightPos, float density) {
        vec3 lightDir = normalize(lightPos - rayPos);
        float distance = length(lightPos - rayPos);
        
        // Beer's law for light attenuation
        float attenuation = exp(-density * distance * 0.1);
        
        // Simple volumetric approximation
        return attenuation * density * 0.5;
      }
    `,
    },
};

export enum RenderLayers {
    BACKGROUND_FAR = -1000,
    BACKGROUND_MIDDLE = -995,
    BACKGROUND_NEAR = -990,
    ATMOSPHERIC_FAR = -985,
    ATMOSPHERIC_NEAR = -980,
    PARTICLES_FAR = -975,
    PARTICLES_NEAR = -970,
    OBJECTS_FAR = -965,
    OBJECTS_NEAR = -960,
}

// Utility class for building shader programs with fluent API
export class ShaderProgramBuilder {
    private vertexShader = "";
    private fragmentShader = "";
    private uniforms: Record<string, any> = {};
    private includes: string[] = [];

    vertex(shader: string): ShaderProgramBuilder {
        this.vertexShader = shader;
        return this;
    }

    fragment(shader: string): ShaderProgramBuilder {
        this.fragmentShader = shader;
        return this;
    }

    include(name: keyof typeof ShaderLibrary): ShaderProgramBuilder {
        if (name === "noise") {
            this.includes.push(
                ShaderLibrary.noise.hash3,
                ShaderLibrary.noise.simplex3d,
                ShaderLibrary.noise.fbm,
                ShaderLibrary.noise.fbmDefault
            );
        } else if (name === "color") {
            this.includes.push(
                ShaderLibrary.color.hsv2rgb,
                ShaderLibrary.color.colorGrading
            );
        } else if (name === "atmospheric") {
            this.includes.push(
                ShaderLibrary.atmospheric.rayleighScattering,
                ShaderLibrary.atmospheric.miePhase,
                ShaderLibrary.atmospheric.volumetricScattering
            );
        }
        return this;
    }

    addUniforms(newUniforms: Record<string, any>): ShaderProgramBuilder {
        this.uniforms = { ...this.uniforms, ...newUniforms };
        return this;
    }

    build() {
        const finalFragmentShader =
            this.includes.join("\n") + "\n" + this.fragmentShader;

        return {
            vertexShader: this.vertexShader,
            fragmentShader: finalFragmentShader,
            uniforms: this.uniforms,
        };
    }
}

// Helper function to create common time-based uniforms
export const createTimeUniforms = (speed = 1.0) => ({
    time: { value: 0 },
    speed: { value: speed },
});

// Helper function to create common color uniforms
export const createColorUniforms = (colors: string[]) => {
    const uniforms: Record<string, any> = {};
    colors.forEach((color, index) => {
        uniforms[`color${index + 1}`] = { value: new THREE.Color(color) };
    });
    return uniforms;
};

// Export default for easy importing
export default ShaderLibrary;
