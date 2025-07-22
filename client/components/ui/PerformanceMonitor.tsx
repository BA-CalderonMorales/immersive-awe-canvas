import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Zap, Eye, Cpu } from "lucide-react";

interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    renderCalls: number;
    triangles: number;
    memoryUsage: number;
    qualityLevel: "low" | "medium" | "high" | "extreme";
}

interface PerformanceMonitorProps {
    isVisible?: boolean;
    onQualityChange?: (quality: PerformanceMetrics["qualityLevel"]) => void;
}

const PerformanceMonitor = ({
    isVisible = false,
    onQualityChange,
}: PerformanceMonitorProps) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 60,
        frameTime: 16.67,
        renderCalls: 0,
        triangles: 0,
        memoryUsage: 0,
        qualityLevel: "high",
    });

    const frameTimeHistory = useRef<number[]>([]);
    const lastTime = useRef(0);
    const frameCount = useRef(0);

    // Adaptive quality based on performance
    const adaptiveQuality = useRef({
        targetFPS: 60,
        minFPS: 30,
        qualityAdjustmentCooldown: 0,
        lastQualityChange: 0,
    });

    useFrame((state, delta) => {
        const currentTime = performance.now();
        frameCount.current++;

        // Calculate FPS
        if (currentTime - lastTime.current >= 1000) {
            const fps =
                (frameCount.current * 1000) / (currentTime - lastTime.current);
            frameCount.current = 0;
            lastTime.current = currentTime;

            // Frame time tracking
            const frameTime = delta * 1000;
            frameTimeHistory.current.push(frameTime);
            if (frameTimeHistory.current.length > 60) {
                frameTimeHistory.current.shift();
            }

            // Calculate average frame time
            const avgFrameTime =
                frameTimeHistory.current.reduce((a, b) => a + b, 0) /
                frameTimeHistory.current.length;

            // Memory estimation (approximate)
            const memoryEstimate =
                (state.gl.info.memory?.geometries || 0) +
                (state.gl.info.memory?.textures || 0);

            // Adaptive quality adjustment
            const adaptive = adaptiveQuality.current;
            if (
                currentTime - adaptive.lastQualityChange >
                adaptive.qualityAdjustmentCooldown
            ) {
                let newQuality = metrics.qualityLevel;

                if (fps < adaptive.minFPS && metrics.qualityLevel !== "low") {
                    // Reduce quality if FPS is too low
                    const qualityLevels: PerformanceMetrics["qualityLevel"][] =
                        ["extreme", "high", "medium", "low"];
                    const currentIndex = qualityLevels.indexOf(
                        metrics.qualityLevel
                    );
                    if (currentIndex < qualityLevels.length - 1) {
                        newQuality = qualityLevels[currentIndex + 1];
                    }
                } else if (
                    fps > adaptive.targetFPS + 10 &&
                    metrics.qualityLevel !== "extreme"
                ) {
                    // Increase quality if FPS is consistently high
                    const qualityLevels: PerformanceMetrics["qualityLevel"][] =
                        ["low", "medium", "high", "extreme"];
                    const currentIndex = qualityLevels.indexOf(
                        metrics.qualityLevel
                    );
                    if (currentIndex < qualityLevels.length - 1) {
                        newQuality = qualityLevels[currentIndex + 1];
                    }
                }

                if (newQuality !== metrics.qualityLevel) {
                    adaptive.lastQualityChange = currentTime;
                    adaptive.qualityAdjustmentCooldown = 5000; // 5 second cooldown
                    onQualityChange?.(newQuality);
                }
            }

            setMetrics({
                fps: Math.round(fps),
                frameTime: avgFrameTime,
                renderCalls: state.gl.info.render.calls,
                triangles: state.gl.info.render.triangles,
                memoryUsage: memoryEstimate,
                qualityLevel: metrics.qualityLevel,
            });
        }
    });

    // Performance status indicators
    const getFPSStatus = (fps: number) => {
        if (fps >= 55) return { color: "bg-green-500", label: "Excellent" };
        if (fps >= 45) return { color: "bg-yellow-500", label: "Good" };
        if (fps >= 30) return { color: "bg-orange-500", label: "Fair" };
        return { color: "bg-red-500", label: "Poor" };
    };

    const getQualityColor = (quality: PerformanceMetrics["qualityLevel"]) => {
        const colors = {
            low: "bg-red-100 text-red-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-green-100 text-green-800",
            extreme: "bg-purple-100 text-purple-800",
        };
        return colors[quality];
    };

    if (!isVisible) return null;

    const fpsStatus = getFPSStatus(metrics.fps);

    return (
        <Card className="fixed top-4 right-4 z-50 w-64 bg-black/80 backdrop-blur-md border-gray-700 text-white">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                    <Monitor className="w-4 h-4" />
                    Performance Monitor
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* FPS Display */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">FPS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-2 h-2 rounded-full ${fpsStatus.color}`}
                        />
                        <span className="font-mono text-sm">{metrics.fps}</span>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                            {fpsStatus.label}
                        </Badge>
                    </div>
                </div>

                {/* Frame Time */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Frame Time</span>
                    </div>
                    <span className="font-mono text-sm">
                        {metrics.frameTime.toFixed(1)}ms
                    </span>
                </div>

                {/* Quality Level */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        <span className="text-sm">Quality</span>
                    </div>
                    <Badge className={getQualityColor(metrics.qualityLevel)}>
                        {metrics.qualityLevel.toUpperCase()}
                    </Badge>
                </div>

                {/* Render Stats */}
                <div className="border-t border-gray-600 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Draw Calls</span>
                        <span className="font-mono">{metrics.renderCalls}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span>Triangles</span>
                        <span className="font-mono">
                            {metrics.triangles.toLocaleString()}
                        </span>
                    </div>
                    {metrics.memoryUsage > 0 && (
                        <div className="flex justify-between text-xs">
                            <span>Memory</span>
                            <span className="font-mono">
                                {Math.round(metrics.memoryUsage / 1024)}KB
                            </span>
                        </div>
                    )}
                </div>

                {/* Performance Tips */}
                {metrics.fps < 30 && (
                    <div className="bg-red-900/50 border border-red-500 rounded p-2 text-xs">
                        💡 Performance low. Quality will auto-adjust.
                    </div>
                )}

                {metrics.fps > 55 && metrics.qualityLevel !== "extreme" && (
                    <div className="bg-green-900/50 border border-green-500 rounded p-2 text-xs">
                        ✨ Great performance! Quality may increase.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PerformanceMonitor;
