import {
    ConeGeometry,
    CylinderGeometry,
    DodecahedronGeometry,
    IcosahedronGeometry,
    OctahedronGeometry,
    RingGeometry,
    TetrahedronGeometry,
} from "three";

export const CONTEMPLATIVE_FIELD_COUNT = 80; // Increased for richer wobble field
export const HARMONY_MULTIPLIER = 2.0; // Increased for more pronounced wobble effects

export const generateChaoticField = () => {
    const positions = [];
    const scales = [];
    const rotations = [];
    const types = [];
    const colors = [];
    const meanings = []; // Add philosophical meaning to each element

    for (let i = 0; i < CONTEMPLATIVE_FIELD_COUNT; i++) {
        // Create wobble field distribution patterns
        const distributionType = Math.random();
        let x, y, z;

        if (distributionType < 0.4) {
            // Wobble field rings - concentric waves
            const rings = 6;
            const ringIndex = Math.floor(
                i / (CONTEMPLATIVE_FIELD_COUNT / rings)
            );
            const angle =
                ((i % (CONTEMPLATIVE_FIELD_COUNT / rings)) * (Math.PI * 2)) /
                (CONTEMPLATIVE_FIELD_COUNT / rings);
            const radius = (ringIndex + 1) * 1.5;
            // Add some random wobble to ring positions
            const wobbleOffset = (Math.random() - 0.5) * 0.8;
            x = Math.cos(angle) * (radius + wobbleOffset);
            y = (Math.random() - 0.5) * 4 + Math.sin(ringIndex * 0.7) * 1.5;
            z = Math.sin(angle) * (radius + wobbleOffset);
        } else if (distributionType < 0.7) {
            // Wobble field spirals - energy flow patterns
            const t = i / CONTEMPLATIVE_FIELD_COUNT;
            const spiralTurns = 4;
            const angle = t * Math.PI * 2 * spiralTurns;
            const radius = t * 6 + Math.sin(t * 8) * 0.5; // Add wobble to spiral
            x = Math.cos(angle) * radius;
            y = (t - 0.5) * 8 + Math.sin(angle * 3) * 0.8; // Wobble vertically
            z = Math.sin(angle) * radius;
        } else {
            // Random wobble field scatter
            const sphericalRadius = 3 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            x = sphericalRadius * Math.sin(phi) * Math.cos(theta);
            y = sphericalRadius * Math.cos(phi);
            z = sphericalRadius * Math.sin(phi) * Math.sin(theta);
            // Add wobble distortion
            x += (Math.random() - 0.5) * 1.2;
            y += (Math.random() - 0.5) * 1.2;
            z += (Math.random() - 0.5) * 1.2;
        }

        positions.push([x, y, z]);

        // Wobble field responsive scales
        const baseScale = 0.3 + Math.random() * 0.4;
        const wobbleScale = baseScale * (0.8 + Math.sin(i * 0.3) * 0.4); // Varied for field effect
        scales.push([
            wobbleScale,
            wobbleScale * (0.8 + Math.random() * 0.4),
            wobbleScale,
        ]);

        rotations.push([
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
        ]);

        // More diverse types for richer wobble field
        types.push(Math.floor(Math.random() * 7));

        // Wobble field energy colors
        const energyHue = (i * 31 + Math.random() * 30) % 360; // Prime distribution
        const fieldSaturation = 40 + Math.random() * 35; // More vibrant for energy
        const energyBrightness = 45 + Math.random() * 35;
        colors.push(
            `hsl(${energyHue}, ${fieldSaturation}%, ${energyBrightness}%)`
        );

        // Assign philosophical meaning for wobble field interactions
        const meaningTypes = [
            "memory",
            "question",
            "insight",
            "doubt",
            "wonder",
            "truth",
            "mystery",
        ];
        meanings.push(meaningTypes[i % meaningTypes.length]);
    }

    return { positions, scales, rotations, types, colors, meanings };
};

// Enhanced Geometry Factory for wobble field compatibility
export const createRickGeometry = (
    type: number,
    scale: [number, number, number]
) => {
    const [sx, sy, sz] = scale;
    const baseSize = Math.max(sx, sy, sz);

    switch (type) {
        case 0: // Wobble cones - energy spikes
            return new ConeGeometry(baseSize * 0.4, baseSize * 2.5, 12);
        case 1: // Wobble cylinders - field columns
            return new CylinderGeometry(
                baseSize * 0.3,
                baseSize * 0.5,
                baseSize * 1.8,
                16
            );
        case 2: // Wobble rings - energy halos
            return new RingGeometry(baseSize * 0.4, baseSize * 0.9, 20, 3);
        case 3: // Wobble icosahedrons - complex field nodes
            return new IcosahedronGeometry(baseSize * 0.7, 3);
        case 4: // Wobble tetrahedra - field spikes
            return new TetrahedronGeometry(baseSize * 1.0);
        case 5: // Wobble octahedra - dual field points
            return new OctahedronGeometry(baseSize * 0.8);
        case 6: // Wobble dodecahedra - cosmic field harmonics
            return new DodecahedronGeometry(baseSize * 0.65);
        default: // Default wobble cylinders
            return new CylinderGeometry(
                baseSize * 0.35,
                baseSize * 0.35,
                baseSize * 1.5,
                12
            );
    }
};
