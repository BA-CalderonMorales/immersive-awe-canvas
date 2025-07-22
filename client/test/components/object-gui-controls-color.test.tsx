import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { render, createMockSceneObject } from "../test-utils";
import ObjectGuiControls from "../../components/scene/controls/components/ObjectGuiControls";

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

describe("ObjectGuiControls color input", () => {
    it("renders GUI container", () => {
        const object = createMockSceneObject();
        const onUpdate = vi.fn();
        const { container } = render(
            <ObjectGuiControls object={object} onUpdate={onUpdate} />
        );

        // Test that the GUI container is rendered
        expect(container.querySelector(".w-full")).toBeInTheDocument();
    });
});
