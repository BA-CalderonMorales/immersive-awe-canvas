import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { SceneConfig } from "@/types/scene";

interface ShareWorldButtonProps {
    sceneConfig: SceneConfig;
    theme?: "day" | "night";
}

const ShareWorldButton = ({ sceneConfig, theme = "night" }: ShareWorldButtonProps) => {
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const generateShareableLink = () => {
        // Encode the scene config as a base64 URL parameter
        const configString = JSON.stringify(sceneConfig);
        const encoded = btoa(configString);
        const baseUrl = window.location.origin;
        return `${baseUrl}/world?config=${encoded}`;
    };

    const handleCopy = async () => {
        const link = generateShareableLink();
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    title="Share your world with friends!"
                >
                    <Share2 className="w-4 h-4" />
                    Share World
                </Button>
            </DialogTrigger>
            <DialogContent className={theme === "day" ? "bg-white" : "bg-gray-900"}>
                <DialogHeader>
                    <DialogTitle>Share Your World! 🌍</DialogTitle>
                    <DialogDescription>
                        Copy this link to share your 3D creation with friends, family, or
                        classmates. They'll see exactly what you created!
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            readOnly
                            value={generateShareableLink()}
                            className="flex-1 text-xs"
                        />
                        <Button
                            onClick={handleCopy}
                            variant={copied ? "default" : "outline"}
                            size="sm"
                            className="gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="text-xs opacity-70 space-y-1">
                        <p>💡 <strong>Pro Tip:</strong> Your world is saved in the link itself!</p>
                        <p>🎨 No account needed - just share and create!</p>
                        <p>📱 Works on phones, tablets, and computers!</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareWorldButton;
