import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import DynamicSceneObject from "../../components/scene/objects/DynamicSceneObject";
import { createMockSceneObject } from "../test-utils";

// Mock Three.js Canvas
vi.mock("@react-three/fiber", () => ({
    useThree: () => ({
        camera: {},
        gl: {
            domElement: {
                setPointerCapture: vi.fn(),
                releasePointerCapture: vi.fn(),
            },
        },
    }),
}));

describe("DynamicSceneObject", () => {
    const mockObject = createMockSceneObject();
    const mockOnSelect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render without crashing", () => {
        const { container } = render(
            <SceneObjectsProvider>
                <DynamicSceneObject
                    object={mockObject}
                    isSelected={false}
                    onSelect={mockOnSelect}
                />
            </SceneObjectsProvider>
        );

        expect(container).toBeTruthy();
    });
});
