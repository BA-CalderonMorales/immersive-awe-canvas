import TransitionSplash from "@/components/TransitionSplash";

interface LoadingOverlayProps {
    message?: string;
    theme?: "day" | "night";
}

const LoadingOverlay = ({
    message = "Loading...",
    theme = "day",
}: LoadingOverlayProps) => {
    return (
        <TransitionSplash
            show={true}
            theme={theme}
            type="loading"
            message={message}
        />
    );
};

export default LoadingOverlay;
