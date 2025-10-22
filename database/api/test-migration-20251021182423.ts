import { createClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/types";

/**
 * Test suite for verifying migration 20251021182423
 * Tests new geometries and enhanced backgrounds
 */

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function testNewGeometries() {
    console.log("\nTesting new geometry entries...");

    const newGeometryTypes = [
        "FibonacciSphere",
        "SacredGeometry",
        "MandalaFlower",
    ];

    for (const geometryType of newGeometryTypes) {
        const { data, error } = await supabase
            .from("default_geometries")
            .select("*")
            .eq("geometry_type", geometryType)
            .single();

        if (error) {
            console.error(`Failed to fetch ${geometryType}:`, error.message);
            continue;
        }

        if (!data) {
            console.error(`${geometryType} not found in database`);
            continue;
        }

        console.log(`✓ ${geometryType}:`, {
            name: data.name,
            description: data.description,
            color_day: data.color_day,
            color_night: data.color_night,
            material: data.material_config,
        });

        // Validate material config
        const config = data.material_config as Record<string, unknown>;
        if (config?.materialType) {
            console.log(
                `  Material type: ${config.materialType} | Metalness: ${config.metalness} | Transmission: ${config.transmission || "N/A"}`,
            );
        }
    }
}

async function testEnhancedGeometries() {
    console.log("\nTesting enhanced existing geometries...");

    const enhancedTypes = [
        "CrystallineSpire",
        "TorusKnot",
        "DistortionSphere",
        "WobbleField",
    ];

    for (const geometryType of enhancedTypes) {
        const { data, error } = await supabase
            .from("default_geometries")
            .select("material_config, color_day, color_night")
            .eq("geometry_type", geometryType)
            .single();

        if (error) {
            console.error(`Failed to fetch ${geometryType}:`, error.message);
            continue;
        }

        if (!data) {
            console.error(`${geometryType} not found in database`);
            continue;
        }

        const config = data.material_config as Record<string, unknown>;
        console.log(`✓ ${geometryType}:`, {
            colors: `${data.color_day} / ${data.color_night}`,
            emissive: config.emissive || "none",
            emissiveIntensity: config.emissiveIntensity || 0,
            transmission: config.transmission || "opaque",
        });
    }
}

async function testNewBackgrounds() {
    console.log("\nTesting new background entries...");

    const newBackgrounds = ["Plasma Storm", "Nebula Cloud", "Ethereal Gradient"];

    for (const backgroundName of newBackgrounds) {
        const { data, error } = await supabase
            .from("backgrounds")
            .select("*")
            .eq("name", backgroundName)
            .single();

        if (error) {
            console.error(`Failed to fetch ${backgroundName}:`, error.message);
            continue;
        }

        if (!data) {
            console.error(`${backgroundName} not found in database`);
            continue;
        }

        console.log(`✓ ${backgroundName}:`, {
            description: data.description,
            config: data.background_config,
        });
    }
}

async function testEnhancedBackgrounds() {
    console.log("\nTesting enhanced backgrounds...");

    const enhancedBackgrounds = [
        "Starry Night",
        "Sunset Glory",
        "Aurora Dreams",
    ];

    for (const backgroundName of enhancedBackgrounds) {
        const { data, error } = await supabase
            .from("backgrounds")
            .select("background_config")
            .eq("name", backgroundName)
            .single();

        if (error) {
            console.error(`Failed to fetch ${backgroundName}:`, error.message);
            continue;
        }

        if (!data) {
            console.error(`${backgroundName} not found in database`);
            continue;
        }

        const config = data.background_config as Record<string, unknown>;
        console.log(`✓ ${backgroundName}:`, {
            type: config.type,
            intensity: config.intensity || config.auroraIntensity || "default",
            count: config.count || "N/A",
        });
    }
}

async function testMaterialConfigValidation() {
    console.log("\nValidating material configurations...");

    const { data: geometries, error } = await supabase
        .from("default_geometries")
        .select("name, geometry_type, material_config");

    if (error) {
        console.error("Failed to fetch geometries:", error.message);
        return;
    }

    if (!geometries) {
        console.error("No geometries found");
        return;
    }

    for (const geometry of geometries) {
        const config = geometry.material_config as Record<string, unknown>;

        // Validate required fields
        if (!config?.materialType) {
            console.warn(
                `⚠ ${geometry.name}: Missing materialType in material_config`,
            );
            continue;
        }

        // Validate physical materials have proper properties
        if (config.materialType === "physical") {
            const hasTransmission = typeof config.transmission === "number";
            const hasClearcoat = typeof config.clearcoat === "number";

            if (!hasTransmission && !hasClearcoat) {
                console.warn(
                    `⚠ ${geometry.name}: Physical material lacks transmission or clearcoat`,
                );
            } else {
                console.log(
                    `✓ ${geometry.name}: Valid physical material config`,
                );
            }
        } else {
            console.log(
                `✓ ${geometry.name}: Valid ${config.materialType} material config`,
            );
        }
    }
}

async function runAllTests() {
    console.log("=".repeat(60));
    console.log("Migration 20251021182423 Test Suite");
    console.log("=".repeat(60));

    try {
        await testNewGeometries();
        await testEnhancedGeometries();
        await testNewBackgrounds();
        await testEnhancedBackgrounds();
        await testMaterialConfigValidation();

        console.log("\n" + "=".repeat(60));
        console.log("All tests completed");
        console.log("=".repeat(60));
    } catch (error) {
        console.error("\nTest suite failed:", error);
        process.exit(1);
    }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests();
}

export { runAllTests };
