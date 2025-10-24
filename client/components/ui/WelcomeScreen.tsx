import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
    onComplete: () => void;
    theme?: "day" | "night";
}

/**
 * First-time user welcome screen
 * Sets expectations and provides a warm, encouraging introduction
 */
const WelcomeScreen = ({ onComplete, theme = "night" }: WelcomeScreenProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('seen-welcome');
        if (!hasSeenWelcome) {
            setShow(true);
        }
    }, []);

    const handleContinue = () => {
        localStorage.setItem('seen-welcome', 'true');
        setShow(false);
        setTimeout(onComplete, 300);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md ${
                    theme === "day" 
                        ? "bg-white/90" 
                        : "bg-black/90"
                }`}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className={`max-w-2xl w-full rounded-2xl shadow-2xl p-8 md:p-12 ${
                        theme === "day"
                            ? "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200"
                            : "bg-gradient-to-br from-gray-900 to-purple-900 border-2 border-purple-700"
                    }`}
                >
                    <div className="text-center space-y-6">
                        {/* Animated Icon */}
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse"
                            }}
                            className="inline-block"
                        >
                            <Rocket className="w-16 h-16 md:w-20 md:h-20 text-purple-500" />
                        </motion.div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Welcome to 3D World Builder!
                            </h1>
                            <p className="text-lg md:text-xl opacity-80">
                                Create, explore, and share amazing 3D worlds
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                            >
                                <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                                <h3 className="font-semibold mb-1">Learn by Doing</h3>
                                <p className="text-sm opacity-70">
                                    Discover math, geometry, and 3D concepts through play
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                            >
                                <Heart className="w-8 h-8 mx-auto mb-2 text-red-400" />
                                <h3 className="font-semibold mb-1">Share Your Creations</h3>
                                <p className="text-sm opacity-70">
                                    Send worlds to friends with a simple link
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                            >
                                <Rocket className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                                <h3 className="font-semibold mb-1">No Limits</h3>
                                <p className="text-sm opacity-70">
                                    Free forever. No account required.
                                </p>
                            </motion.div>
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-6"
                        >
                            <Button
                                size="lg"
                                onClick={handleContinue}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg gap-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                Let's Create Something Amazing
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </motion.div>

                        {/* Hint */}
                        <p className="text-xs opacity-50 pt-2">
                            Tip: Use your mouse to rotate and zoom the camera
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WelcomeScreen;
