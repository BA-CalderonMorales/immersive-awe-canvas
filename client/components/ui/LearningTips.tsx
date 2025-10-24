import { Lightbulb, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LearningTipsProps {
    theme?: "day" | "night";
}

const tips = [
    {
        title: "Golden Ratio",
        content: "The Fibonacci Sphere uses the golden ratio (1.618...) - the same pattern found in sunflowers, pinecones, and galaxies.",
    },
    {
        title: "Platonic Solids",
        content: "Sacred Geometry shows the 5 Platonic solids - perfect shapes that ancient Greeks believed were the building blocks of the universe.",
    },
    {
        title: "Topology",
        content: "A torus knot is a special loop that wraps around a donut shape. Mathematicians study these to understand how space works.",
    },
    {
        title: "Sine Waves",
        content: "The wavy grid uses sine waves - the same math that creates sound, light, and ocean waves.",
    },
    {
        title: "3D Rotation",
        content: "Objects rotate around X, Y, and Z axes. Try moving the camera to see all three dimensions.",
    },
    {
        title: "Materials",
        content: "Different materials (metallic, rough, transparent) change how light bounces off objects - just like in real life.",
    },
];

const LearningTips = ({ theme = "night" }: LearningTipsProps) => {
    const [currentTip, setCurrentTip] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed) return;

        const interval = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % tips.length);
        }, 15000);

        return () => clearInterval(interval);
    }, [dismissed]);

    if (dismissed) return null;

    const tip = tips[currentTip];

    const dayClasses = "bg-white/95 border-slate-200 text-slate-900";
    const nightClasses = "bg-slate-950/95 border-slate-800 text-slate-100";
    const themeClasses = theme === "day" ? dayClasses : nightClasses;

    const dayIndicator = "bg-cyan-500";
    const nightIndicator = "bg-cyan-400";
    const indicatorClass = theme === "day" ? dayIndicator : nightIndicator;

    const dayDot = "bg-slate-400";
    const nightDot = "bg-slate-600";
    const dotClass = theme === "day" ? dayDot : nightDot;

    return (
        <div
            className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40
                rounded-lg shadow-2xl backdrop-blur-sm animate-fade-in border ${themeClasses}`}
        >
            <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                    <div className={`w-1 h-12 rounded-full flex-shrink-0 ${indicatorClass}`} />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                <h4 className="font-semibold text-sm tracking-tight">{tip.title}</h4>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1 hover:bg-transparent"
                                onClick={() => setDismissed(true)}
                                aria-label="Dismiss tip"
                            >
                                <X className="w-3 h-3 opacity-50 hover:opacity-100 transition-opacity" />
                            </Button>
                        </div>
                        <p className="text-xs opacity-80 leading-relaxed">{tip.content}</p>
                    </div>
                </div>
                <div className="flex gap-1.5 justify-center pt-1">
                    {tips.map((_, idx) => (
                        <button
                            key={`tip-${idx}`}
                            type="button"
                            onClick={() => setCurrentTip(idx)}
                            className={`h-1 rounded-full transition-all ${
                                idx === currentTip
                                    ? `${indicatorClass} w-6`
                                    : `${dotClass} w-1 hover:opacity-70`
                            }`}
                            aria-label={`View tip ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearningTips;
