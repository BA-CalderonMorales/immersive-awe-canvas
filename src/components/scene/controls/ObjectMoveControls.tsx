
import { useState } from 'react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Move, RotateCcw, Scale, Palette, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ObjectMoveControls = () => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const [moveMode, setMoveMode] = useState(false);
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  const handleToggleMoveMode = () => {
    setMoveMode(!moveMode);
    if (!moveMode) {
      toast.info('🎯 Object Move Mode Activated', {
        description: 'Long press or Ctrl+drag objects to move them',
        duration: 3000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          backdropFilter: 'blur(8px)',
        },
      });
    } else {
      toast.success('✅ Move Mode Deactivated', {
        description: 'Normal camera controls restored',
        duration: 2000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          backdropFilter: 'blur(8px)',
        },
      });
    }
  };

  const handleScaleObject = (factor: number) => {
    if (!selectedObject) return;
    
    const newScale: [number, number, number] = [
      Math.max(0.1, selectedObject.scale[0] * factor),
      Math.max(0.1, selectedObject.scale[1] * factor),
      Math.max(0.1, selectedObject.scale[2] * factor)
    ];
    
    actions.updateObject(selectedObject.id, { scale: newScale });
    
    toast.success(`📏 ${selectedObject.type} ${factor > 1 ? 'enlarged' : 'shrunk'}`, {
      description: `Scale: ${newScale[0].toFixed(2)}x`,
      duration: 2000,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleResetTransform = () => {
    if (!selectedObject) return;
    
    actions.updateObject(selectedObject.id, {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    });
    
    toast.success(`🔄 ${selectedObject.type} transform reset`, {
      description: 'Position, rotation, and scale restored to defaults',
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleRandomizeColor = () => {
    if (!selectedObject) return;
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#ffffff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    actions.updateObject(selectedObject.id, { color: randomColor });
    
    toast.success(`🎨 Color randomized`, {
      description: `New color: ${randomColor}`,
      duration: 2000,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: `1px solid ${randomColor}40`,
        backdropFilter: 'blur(8px)',
      },
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-black/80 border-cyan-500/30 text-white">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Move className="w-5 h-5" />
            Object Movement Controls
          </CardTitle>
          <CardDescription className="text-gray-300">
            Move and manipulate objects in the scene
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Move Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Move Mode</span>
            <Button
              onClick={handleToggleMoveMode}
              variant={moveMode ? "default" : "outline"}
              size="sm"
              className={moveMode ? "bg-yellow-600 hover:bg-yellow-700" : "border-cyan-500/50 hover:bg-cyan-500/10"}
            >
              {moveMode ? 'Deactivate' : 'Activate'}
            </Button>
          </div>

          {/* Object List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-cyan-400">Objects in Scene ({objects.length})</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {objects.length === 0 ? (
                <p className="text-xs text-gray-400">No objects in scene</p>
              ) : (
                objects.map((object) => (
                  <div
                    key={object.id}
                    className={`flex items-center justify-between p-2 rounded text-xs ${
                      selectedObjectId === object.id 
                        ? 'bg-cyan-500/20 border border-cyan-500/40' 
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-cyan-500/30 text-cyan-300"
                      >
                        {object.type}
                      </Badge>
                      <div 
                        className="w-3 h-3 rounded-full border border-white/30" 
                        style={{ backgroundColor: object.color }}
                      />
                    </div>
                    <Button
                      onClick={() => actions.selectObject(object.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs hover:bg-cyan-500/20"
                    >
                      {selectedObjectId === object.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Object Controls */}
          {selectedObject && (
            <div className="space-y-3 pt-3 border-t border-cyan-500/30">
              <h4 className="text-sm font-medium text-cyan-400">
                Selected: {selectedObject.type}
              </h4>
              
              {/* Scale Controls */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleScaleObject(1.2)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-500/50 hover:bg-green-500/10 text-green-400"
                >
                  <Scale className="w-3 h-3 mr-1" />
                  Enlarge
                </Button>
                <Button
                  onClick={() => handleScaleObject(0.8)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-orange-500/50 hover:bg-orange-500/10 text-orange-400"
                >
                  <Scale className="w-3 h-3 mr-1" />
                  Shrink
                </Button>
              </div>

              {/* Action Controls */}
              <div className="flex gap-2">
                <Button
                  onClick={handleResetTransform}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
                <Button
                  onClick={handleRandomizeColor}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                >
                  <Palette className="w-3 h-3 mr-1" />
                  Color
                </Button>
                <Button
                  onClick={() => actions.removeObject(selectedObject.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 hover:bg-red-500/10 text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-400 bg-gray-900/50 p-2 rounded">
            <p><strong>Desktop:</strong> Ctrl + Drag to move objects</p>
            <p><strong>Mobile:</strong> Long press (500ms) then drag</p>
            <p><strong>Select:</strong> Quick tap on any object</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectMoveControls;
