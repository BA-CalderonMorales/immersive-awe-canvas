import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Clear the global mock for this test file
vi.unmock("@/hooks/useWorlds");

import { useWorlds } from "../useWorlds";

// Mock Supabase
const mockWorldsData = [
    {
        id: 1,
        name: "Genesis Torus",
        slug: "genesis-torus",
        scene_config: { objectType: "torusKnot" },
        ui_day_color: "#ffffff",
        ui_night_color: "#000000",
    },
    {
        id: 2,
        name: "Distortion Sphere",
        slug: "distortion-sphere",
        scene_config: { objectType: "distortionSphere" },
        ui_day_color: "#ffffff",
        ui_night_color: "#000000",
    },
];

vi.mock("@database/supabase/client", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn((field: string, value: unknown) => {
                    if (field === "is_featured") {
                        return {
                            order: vi.fn(() =>
                                Promise.resolve({
                                    data: mockWorldsData,
                                    error: null,
                                })
                            ),
                            single: vi.fn(() => {
                                // This is for fetchWorldBySlug
                                const world = mockWorldsData.find(
                                    w => w.slug === value
                                );
                                return Promise.resolve({
                                    data: world || null,
                                    error: world
                                        ? null
                                        : {
                                              code: "PGRST116",
                                              message: "Not found",
                                          },
                                });
                            }),
                        };
                    }
                    if (field === "slug") {
                        return {
                            eq: vi.fn((field2: string, _value2: unknown) => {
                                if (field2 === "is_featured") {
                                    return {
                                        single: vi.fn(() => {
                                            const world = mockWorldsData.find(
                                                w => w.slug === value
                                            );
                                            return Promise.resolve({
                                                data: world || null,
                                                error: world
                                                    ? null
                                                    : {
                                                          code: "PGRST116",
                                                          message: "Not found",
                                                      },
                                            });
                                        }),
                                    };
                                }
                                return {};
                            }),
                        };
                    }
                    return {};
                }),
            })),
        })),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: Infinity,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(
            QueryClientProvider,
            { client: queryClient },
            children
        );
};

describe("useWorlds", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load worlds successfully", async () => {
        const { result } = renderHook(() => useWorlds(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.worlds).toHaveLength(2);
        expect(result.current.worlds[0].name).toBe("Genesis Torus");
        expect(result.current.currentWorldIndex).toBe(0);
        expect(result.current.worldData).toEqual(result.current.worlds[0]);
    });

    it("should initialize with specific world slug", async () => {
        const { result } = renderHook(() => useWorlds("distortion-sphere"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Wait for the useEffect to set the currentWorldIndex based on the initial slug
        await waitFor(() => {
            expect(result.current.currentWorldIndex).toBe(1);
        });

        expect(result.current.worldData?.slug).toBe("distortion-sphere");
    });

    it("should handle world navigation", async () => {
        const { result } = renderHook(() => useWorlds(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Jump to second world
        act(() => {
            result.current.jumpToWorld(1);
        });

        // Wait for the timeout in jumpToWorld to complete
        await waitFor(
            () => {
                expect(result.current.currentWorldIndex).toBe(1);
            },
            { timeout: 2000 }
        );

        expect(result.current.worldData?.slug).toBe("distortion-sphere");
    });

    it("should handle transition state correctly", async () => {
        const { result } = renderHook(() => useWorlds(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isTransitioning).toBe(false);

        // Trigger transition
        act(() => {
            result.current.jumpToWorld(1);
        });

        // Should be transitioning immediately after calling jumpToWorld
        expect(result.current.isTransitioning).toBe(true);

        // Wait for transition to complete
        await waitFor(
            () => {
                expect(result.current.isTransitioning).toBe(false);
            },
            { timeout: 2000 }
        );
    });
});
