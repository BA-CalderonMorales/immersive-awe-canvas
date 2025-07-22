/**
 * Component for managing user-saved scenes
 * Displays saved scenes with load, edit, delete, and export functionality
 */

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Library,
    Search,
    Play,
    Edit,
    Trash2,
    Download,
    Copy,
    Upload,
    Calendar,
    Tag,
    Globe,
    Lock,
} from "lucide-react";
import { SceneConfig } from "@/types/scene";
import { UserScene } from "@/types/userScenes";
import { useUserScenes } from "@/hooks/useUserScenes";
import { formatDistanceToNow } from "date-fns";

interface UserScenesManagerProps {
    onLoadScene: (sceneConfig: SceneConfig) => void;
    trigger?: React.ReactNode;
}

const UserScenesManager = ({
    onLoadScene,
    trigger,
}: UserScenesManagerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const { scenes, isLoading, actions } = useUserScenes();

    // Filter scenes based on search and tag
    const filteredScenes = scenes.filter(scene => {
        const matchesSearch =
            searchQuery === "" ||
            scene.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scene.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesTag =
            selectedTag === null || scene.tags.includes(selectedTag);

        return matchesSearch && matchesTag;
    });

    // Get all unique tags
    const allTags = Array.from(
        new Set(scenes.flatMap(scene => scene.tags))
    ).sort();

    const handleLoadScene = async (scene: UserScene) => {
        try {
            await actions.loadScene(scene.id);
            onLoadScene(scene.sceneConfig);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to load scene:", error);
        }
    };

    const handleDeleteScene = async (sceneId: string) => {
        if (
            confirm(
                "Are you sure you want to delete this scene? This action cannot be undone."
            )
        ) {
            try {
                await actions.deleteScene(sceneId);
            } catch (error) {
                console.error("Failed to delete scene:", error);
            }
        }
    };

    const handleExportScene = async (scene: UserScene) => {
        try {
            const exportData = await actions.exportScene(scene.id);

            // Create and download file
            const blob = new Blob([exportData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${scene.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export scene:", error);
        }
    };

    const handleDuplicateScene = async (scene: UserScene) => {
        const newName = prompt(
            "Enter a name for the duplicated scene:",
            `${scene.name} (Copy)`
        );
        if (newName && newName.trim()) {
            try {
                await actions.duplicateScene(scene.id, newName.trim());
            } catch (error) {
                console.error("Failed to duplicate scene:", error);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Library className="h-4 w-4" />
                        My Scenes
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Library className="h-5 w-5" />
                        My Saved Scenes ({scenes.length})
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search scenes..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Import Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = ".json";
                                input.onchange = async e => {
                                    const file = (e.target as HTMLInputElement)
                                        .files?.[0];
                                    if (file) {
                                        try {
                                            const text = await file.text();
                                            await actions.importScene(text);
                                        } catch (error) {
                                            console.error(
                                                "Failed to import scene:",
                                                error
                                            );
                                        }
                                    }
                                };
                                input.click();
                            }}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Import
                        </Button>
                    </div>

                    {/* Tag Filters */}
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            <Button
                                variant={
                                    selectedTag === null ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedTag(null)}
                            >
                                All
                            </Button>
                            {allTags.map(tag => (
                                <Button
                                    key={tag}
                                    variant={
                                        selectedTag === tag
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        setSelectedTag(
                                            selectedTag === tag ? null : tag
                                        )
                                    }
                                    className="gap-1"
                                >
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    )}

                    <Separator />

                    {/* Scenes List */}
                    <ScrollArea className="h-[400px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="text-muted-foreground">
                                    Loading scenes...
                                </div>
                            </div>
                        ) : filteredScenes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                <Library className="h-8 w-8 text-muted-foreground mb-2" />
                                <div className="text-muted-foreground">
                                    {scenes.length === 0
                                        ? "No saved scenes yet. Create your first scene!"
                                        : "No scenes match your search criteria."}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredScenes.map(scene => (
                                    <Card
                                        key={scene.id}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        {scene.name}
                                                        {scene.isPublic ? (
                                                            <Globe className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </CardTitle>
                                                    {scene.description && (
                                                        <CardDescription className="text-sm">
                                                            {scene.description}
                                                        </CardDescription>
                                                    )}
                                                </div>

                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleLoadScene(
                                                                scene
                                                            )
                                                        }
                                                        className="gap-1"
                                                    >
                                                        <Play className="h-3 w-3" />
                                                        Load
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDuplicateScene(
                                                                scene
                                                            )
                                                        }
                                                        className="gap-1"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleExportScene(
                                                                scene
                                                            )
                                                        }
                                                        className="gap-1"
                                                    >
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteScene(
                                                                scene.id
                                                            )
                                                        }
                                                        className="gap-1 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0">
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                scene.createdAt
                                                            ),
                                                            {
                                                                addSuffix: true,
                                                            }
                                                        )}
                                                    </div>

                                                    {scene.tags.length > 0 && (
                                                        <div className="flex gap-1">
                                                            {scene.tags
                                                                .slice(0, 3)
                                                                .map(tag => (
                                                                    <Badge
                                                                        key={
                                                                            tag
                                                                        }
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        {tag}
                                                                    </Badge>
                                                                ))}
                                                            {scene.tags.length >
                                                                3 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    +
                                                                    {scene.tags
                                                                        .length -
                                                                        3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-xs">
                                                    {scene.sceneConfig.type}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserScenesManager;
