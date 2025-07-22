import { BackgroundConfig, ExtraConfig } from "@/types/scene";
import { BackgroundRenderer } from "./backgrounds/BackgroundRegistry";

interface DynamicBackgroundProps {
    background: BackgroundConfig;
    extras?: ExtraConfig[];
}

const DynamicBackground = ({ background, extras }: DynamicBackgroundProps) => {
    // Ruby-like elegance: delegate to registry
    return <BackgroundRenderer background={background} extras={extras} />;
};

export default DynamicBackground;
