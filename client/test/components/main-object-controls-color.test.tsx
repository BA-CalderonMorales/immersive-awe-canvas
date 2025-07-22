import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { render } from "../test-utils";
import MainObjectControls from "../../components/scene/controls/MainObjectControls";
import { SceneConfig } from "@/types/scene";

vi.mock("lil-gui", () => {
    class MockController {
        onChange = vi.fn().mockReturnThis();
        name = vi.fn().mockReturnThis();
        setValue = vi.fn().mockReturnThis();
        min = vi.fn().mockReturnThis();
        max = vi.fn().mockReturnThis();
        step = vi.fn().mockReturnThis();
        updateDisplay = vi.fn().mockReturnThis();
    }

    class MockGUI {
        domElement = document.createElement("div");
        destroy = vi.fn();
        add = vi.fn(() => new MockController());
        addColor = vi.fn(() => new MockController());
        addFolder = vi.fn(() => new MockGUI());
        open = vi.fn();
    }

    return { default: MockGUI };
});

vi.mock("@/hooks/useExperience", () => ({
    useExperience: () => ({ theme: "day" }),
}));

describe("MainObjectControls color input", () => {
    const sceneConfig: SceneConfig = {
        type: "TorusKnot",
        day: {
            mainObjectColor: "#ffffff",
            material: {},
            background: { type: "void" },
            lights: [],
        },
        night: {
            mainObjectColor: "#000000",
            material: {},
            background: { type: "void" },
            lights: [],
        },
    };

    it("renders GUI container", () => {
        const onUpdate = vi.fn();
        const { container } = render(
            <MainObjectControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
        );

        // Test that the GUI container is rendered
        expect(container.querySelector(".w-full")).toBeInTheDocument();
    });
});
