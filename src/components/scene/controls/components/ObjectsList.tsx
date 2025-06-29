
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, RotateCcw, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import ObjectGuiControls from '../../objects/components/ObjectGuiControls';

const ObjectsList = () => {
  const { objects, selectedObject, actions } = useSceneObjectsContext();
  const guiContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <>
      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Objects: {objects.length}
          </span>
          {objects.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={actions.clearObjects}
              className="h-6 w-6 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {objects.map((object) => (
            <Collapsible key={object.id}>
              <div
                className={`p-2 rounded border cursor-pointer transition-all ${
                  object.id === selectedObject?.id
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => actions.selectObject(object.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize">
                    {object.type} #{object.id.slice(-4)}
                  </span>
                  <div className="flex items-center gap-1">
                    <CollapsibleTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                        className="h-6 w-6 p-0"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.removeObject(object.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CollapsibleContent className="mt-2">
                <div className="bg-background/50 rounded-lg p-2 border">
                  <div
                    ref={(el) => { guiContainerRefs.current[object.id] = el; }}
                    className="
                      [&_.lil-gui]:static
                      [&_.lil-gui.root]:w-full
                      [&_.lil-gui.root]:font-size-xs
                      [&_.lil-gui]:text-xs
                      [&_.lil-gui.root_.title]:text-xs
                      [&_.lil-gui.root_.title]:font-medium
                      [&_.lil-gui.root_.title]:mb-1
                    "
                  />
                  <ObjectGuiControls
                    object={object}
                    onUpdate={(updates) => actions.updateObject(object.id, updates)}
                    containerRef={guiContainerRefs.current[object.id]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </>
  );
};

export default ObjectsList;
