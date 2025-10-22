import { BookOpen, GraduationCap } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface EducationalPopoverProps {
    concept: string;
    explanation: string;
    funFact?: string;
    relatedConcepts?: string[];
    children: React.ReactNode;
    theme?: "day" | "night";
}

/**
 * Reusable educational popover for explaining 3D concepts
 * Makes learning accessible and fun
 */
const EducationalPopover = ({
    concept,
    explanation,
    funFact,
    relatedConcepts,
    children,
    theme = "night",
}: EducationalPopoverProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative inline-flex items-center gap-1 cursor-help">
                    {children}
                    <GraduationCap className="w-3 h-3 opacity-50 hover:opacity-100 transition-opacity" />
                </div>
            </PopoverTrigger>
            <PopoverContent 
                className={`w-80 ${theme === "day" ? "bg-white" : "bg-gray-900"}`}
                side="right"
            >
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 mt-1 text-blue-400" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{concept}</h4>
                            <p className="text-xs opacity-80 leading-relaxed">{explanation}</p>
                        </div>
                    </div>

                    {funFact && (
                        <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                            <p className="text-xs">
                                <span className="font-semibold">🎯 Fun Fact: </span>
                                {funFact}
                            </p>
                        </div>
                    )}

                    {relatedConcepts && relatedConcepts.length > 0 && (
                        <div className="pt-2 border-t border-gray-700">
                            <p className="text-[10px] opacity-60 mb-1">Related Concepts:</p>
                            <div className="flex flex-wrap gap-1">
                                {relatedConcepts.map(related => (
                                    <span
                                        key={related}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700"
                                    >
                                        {related}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default EducationalPopover;
