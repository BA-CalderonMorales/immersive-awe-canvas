import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { KeyboardShortcutsProvider } from "@/context/KeyboardShortcutsContext";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";

// Test utilities and mocks
export const createMockWorld = (overrides = {}) => ({
    id: 1,
    name: "Test World",
    slug: "test-world",
    description: "A test world",
    scene_config: {
        theme: {
            material: {
                materialType: "standard",
                roughness: 0.5,
                metalness: 0.5,
            },
            mainObjectColor: "#ff0000",
            backgroundColor: "#000000",
            backgroundType: "gradient",
        },
        objectType: "torusKnot",
    },
    ui_day_color: "#ffffff",
    ui_night_color: "#000000",
    is_featured: false,
    created_at: new Date().toISOString(),
    ...overrides,
});

export const createMockSceneConfig = (overrides = {}) => ({
    theme: {
        material: {
            materialType: "standard" as const,
            roughness: 0.5,
            metalness: 0.5,
        },
        mainObjectColor: "#ff0000",
        backgroundColor: "#000000",
        backgroundType: "gradient" as const,
    },
    objectType: "torusKnot" as const,
    ...overrides,
});

export const createMockSceneObject = (overrides = {}) => ({
    id: "test-object-1",
    type: "sphere" as const,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
    color: "#ff0000",
    material: {
        type: "standard" as const,
        metalness: 0.5,
        roughness: 0.5,
        transparent: false,
        opacity: 1,
    },
    ...overrides,
});

interface AllTheProvidersProps {
    children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: Infinity,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ExperienceProvider>
                    <KeyboardShortcutsProvider>
                        <SceneObjectsProvider>{children}</SceneObjectsProvider>
                    </KeyboardShortcutsProvider>
                </ExperienceProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
