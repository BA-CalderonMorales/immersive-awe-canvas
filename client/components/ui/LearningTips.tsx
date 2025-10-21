import { Lightbulb, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LearningTipsProps {
    theme?: "day" | "night";
}

const tips = [
    {
        title: "Golden Ratio",
        content: "The Fibonacci Sphere uses the golden ratio (1.618...) - the same pattern found in sunflowers, pinecones, and galaxies!",
        emoji: "🌻",
    },
    {
        title: "Platonic Solids",
        content: "Sacred Geometry shows the 5 Platonic solids - perfect shapes that ancient Greeks believed were the building blocks of the universe!",
        emoji: "⭐",
    },
    {
        title: "Topology",
        content: "A torus knot is a special loop that wraps around a donut shape. Mathematicians study these to understand how space works!",
        emoji: "🍩",
    },
    {
        title: "Sine Waves",
        content: "The wavy grid uses sine waves - the same math that creates sound, light, and ocean waves!",
        emoji: "🌊",
    },
    {
        title: "3D Rotation",
        content: "Objects rotate around X, Y, and Z axes. Try moving the camera to see all three dimensions!",
        emoji: "🔄",
    },
    {
        title: "Materials",
        content: "Different materials (metallic, rough, transparent) change how light bounces off objects - just like in real life!",
        emoji: "✨",
    },
];

const LearningTips = ({ theme = "night" }: LearningTipsProps) => {
    const [currentTip, setCurrentTip] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed) return;
        
        const interval = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % tips.length);
        }, 15000); // Change tip every 15 seconds

        return () => clearInterval(interval);
    }, [dismissed]);

    if (dismissed) return null;

    const tip = tips[currentTip];

    return (
        <div
            className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40 
                rounded-lg shadow-xl p-4 backdrop-blur-sm animate-fade-in
                ${theme === "day" 
                    ? "bg-blue-50/95 border border-blue-200" 
                    : "bg-indigo-900/95 border border-indigo-700"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="text-2xl">{tip.emoji}</div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <h4 className="font-semibold text-sm">{tip.title}</h4>
                    </div>
                    <p className="text-xs opacity-90">{tip.content}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1"
                    onClick={() => setDismissed(true)}
                >
                    <X className="w-3 h-3" />
                </Button>
            </div>
            <div className="flex gap-1 mt-3 justify-center">
                {tips.map((tip, idx) => (
                    <button
                        key={`tip-${tip.title}-${idx}`}
                        type="button"
                        onClick={() => setCurrentTip(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === currentTip 
                                ? "bg-white w-4" 
                                : "bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`View tip ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default LearningTips;
