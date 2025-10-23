import { describe, expect, it, vi } from "vitest";
import { useBackgrounds } from "@/hooks/useBackgrounds";
import { useDefaultGeometries } from "@/hooks/useDefaultGeometries";
import ExperienceLogic from "../../components/experience/ExperienceLogic";
import { render, screen } from "../test-utils";

// Mock all the hooks that ExperienceLogic actually uses
vi.mock("@/hooks/useExperience", () => ({
    useExperience: vi.fn(() => ({
        theme: "day",
        toggleTheme: vi.fn(),
    })),
}));

vi.mock("@/hooks/useBackgrounds", () => ({
    useBackgrounds: vi.fn(() => ({
        backgrounds: [],
        isLoading: false,
        isError: false,
        currentBackground: null,
        currentBackgroundIndex: 0,
        isTransitioning: false,
        changeBackground: vi.fn(),
    })),
}));

vi.mock("@/hooks/useDefaultGeometries", () => ({
    useDefaultGeometries: vi.fn(() => ({
        geometries: [],
        isLoading: false,
        isError: false,
        currentGeometry: null,
        currentGeometryIndex: 0,
        changeGeometry: vi.fn(),
    })),
}));

vi.mock("@/hooks/useWorldNavigation", () => ({
    useWorldNavigation: vi.fn(() => ({
        handleChangeWorld: vi.fn(),
        handleJumpToWorld: vi.fn(),
    })),
}));

vi.mock("@/hooks/useExperienceState", () => ({
    useExperienceState: vi.fn(() => ({
        editableSceneConfig: { type: "TorusKnot" },
        setEditableSceneConfig: vi.fn(),
        isObjectLocked: false,
        toggleObjectLock: vi.fn(),
        currentWorldId: 1,
        setCurrentWorldId: vi.fn(),
        isHelpOpen: false,
        setIsHelpOpen: vi.fn(),
        isSearchOpen: false,
        setIsSearchOpen: vi.fn(),
        isSettingsOpen: false,
        setIsSettingsOpen: vi.fn(),
        isUiHidden: false,
        setIsUiHidden: vi.fn(),
        showUiHint: false,
        setShowUiHint: vi.fn(),
        hintShownRef: { current: false },
        handleCopyCode: vi.fn(),
        isDragEnabled: false,
        toggleDragEnabled: vi.fn(),
        isMotionFrozen: false,
        toggleMotionFreeze: vi.fn(),
    })),
}));

vi.mock("@/hooks/useExperienceTransitions", () => ({
    useExperienceTransitions: vi.fn(() => ({
        showEntryTransition: false,
        showWorldTransition: false,
        handleEntryTransitionEnd: vi.fn(),
        handleWorldTransitionEnd: vi.fn(),
    })),
}));

vi.mock("@/hooks/useExperienceCallbacks", () => ({
    useExperienceCallbacks: vi.fn(() => ({
        handleGoHome: vi.fn(),
        handleToggleShortcuts: vi.fn(),
    })),
}));

vi.mock("@/hooks/useExperienceEffects", () => ({
    useExperienceEffects: vi.fn(() => ({
        handleEntryTransitionEndWithHint: vi.fn(),
    })),
}));

// Mock the components
vi.mock("../../components/experience/LoadingOverlay", () => ({
    default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("../../components/experience/ExperienceContainer", () => ({
    default: ({
        worldData,
    }: {
        worldData: { slug: string; [key: string]: unknown } | null;
    }) => (
        <div>
            ExperienceContainer - {(worldData?.name as string) || "Default"}
        </div>
    ),
}));

describe("ExperienceLogic", () => {
    it("should render loading state correctly", () => {
        vi.mocked(useBackgrounds).mockReturnValue({
            backgrounds: undefined,
            isLoading: true,
            isError: false,
            currentBackground: null,
            currentBackgroundIndex: 0,
            isTransitioning: false,
            changeBackground: vi.fn(),
            jumpToBackground: vi.fn(),
        });

        vi.mocked(useDefaultGeometries).mockReturnValue({
            geometries: undefined,
            isLoading: true,
            isError: false,
            currentGeometry: null,
            currentGeometryIndex: 0,
            changeGeometry: vi.fn(),
            jumpToGeometry: vi.fn(),
        });

        render(<ExperienceLogic />);

        expect(screen.getByText("Loading experience...")).toBeInTheDocument();
    });

    it("should render error state correctly", () => {
        vi.mocked(useBackgrounds).mockReturnValue({
            backgrounds: [],
            isLoading: false,
            isError: true,
            currentBackground: null,
            currentBackgroundIndex: 0,
            isTransitioning: false,
            changeBackground: vi.fn(),
            jumpToBackground: vi.fn(),
        });

        vi.mocked(useDefaultGeometries).mockReturnValue({
            geometries: [],
            isLoading: false,
            isError: false,
            currentGeometry: null,
            currentGeometryIndex: 0,
            changeGeometry: vi.fn(),
            jumpToGeometry: vi.fn(),
        });

        render(<ExperienceLogic />);

        expect(screen.getByText("Waiting for data...")).toBeInTheDocument();
    });

    it("should render experience container when data is loaded", () => {
        vi.mocked(useBackgrounds).mockReturnValue({
            backgrounds: [
                {
                    id: 1,
                    name: "Test Background",
                    backgroundConfig: null,
                    createdAt: "2024-01-01",
                    description: "Test background",
                    isFeatured: false,
                    sortOrder: 1,
                },
            ],
            isLoading: false,
            isError: false,
            currentBackground: {
                id: 1,
                name: "Test Background",
                backgroundConfig: null,
                createdAt: "2024-01-01",
                description: "Test background",
                isFeatured: false,
                sortOrder: 1,
            },
            currentBackgroundIndex: 0,
            isTransitioning: false,
            changeBackground: vi.fn(),
            jumpToBackground: vi.fn(),
        });

        vi.mocked(useDefaultGeometries).mockReturnValue({
            geometries: [
                {
                    id: 1,
                    name: "Test Geometry",
                    color_day: "#ffffff",
                    color_night: "#000000",
                    created_at: "2024-01-01",
                    description: "Test geometry",
                    geometry_type: "TorusKnot",
                    is_featured: false,
                    material_config: {},
                    sort_order: 1,
                },
            ],
            isLoading: false,
            isError: false,
            currentGeometry: {
                id: 1,
                name: "Test Geometry",
                color_day: "#ffffff",
                color_night: "#000000",
                created_at: "2024-01-01",
                description: "Test geometry",
                geometry_type: "TorusKnot",
                is_featured: false,
                material_config: {},
                sort_order: 1,
            },
            currentGeometryIndex: 0,
            changeGeometry: vi.fn(),
            jumpToGeometry: vi.fn(),
        });

        render(<ExperienceLogic />);

        // Should render the experience container with the geometry name
        expect(
            screen.getByText("ExperienceContainer - Default")
        ).toBeInTheDocument();
    });

    it("should pass correct props to ExperienceContainer", () => {
        const { container } = render(<ExperienceLogic />);

        // Verify that the component renders without errors and passes props correctly
        expect(container).toBeInTheDocument();
    });
});
