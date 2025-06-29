import { useState } from 'react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useMovementMode } from '@/context/MovementModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Move, RotateCcw, Scale, Palette, Trash2, ArrowRight, ArrowUp, ArrowDown, Navigation } from 'lucide-react';
import { toast } from 'sonner';

const ObjectMoveControls = () => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const { movementMode, setMovementMode } = useMovementMode();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  const handleToggleMoveMode = (mode: typeof movementMode) => {
    const newMode = movementMode === mode ? 'none' : mode;
    setMovementMode(newMode);
    
    if (newMode !== 'none') {
      const modeNames = {
        'x-axis': 'X-Axis Movement',
        'y-axis': 'Y-Axis Movement', 
        'z-axis': 'Z-Axis Movement',
        'freehand': 'Freehand Movement'
      };
      
      toast.info(`🎯 ${modeNames[newMode]} Activated`, {
        description: newMode === 'freehand' 
          ? 'Long press or Ctrl+drag to move objects freely in 3D space'
          : `Long press or Ctrl+drag to move objects along the ${mode.split('-')[0].toUpperCase()} axis`,
        duration: 3000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          backdropFilter: 'blur(8px)',
        },
      });
    } else {
      toast.success('✅ Movement Mode Deactivated', {
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

  const handleMoveObject = (axis: 'x' | 'y' | 'z', direction: number) => {
    if (!selectedObject) return;
    
    const moveAmount = 0.5 * direction;
    const newPosition: [number, number, number] = [...selectedObject.position];
    
    switch (axis) {
      case 'x':
        newPosition[0] += moveAmount;
        break;
      case 'y':
        newPosition[1] += moveAmount;
        break;
      case 'z':
        newPosition[2] += moveAmount;
        break;
    }
    
    actions.updateObject(selectedObject.id, { position: newPosition });
    
    toast.success(`📍 Moved along ${axis.toUpperCase()}-axis`, {
      description: `Position: [${newPosition.map(n => n.toFixed(1)).join(', ')}]`,
      duration: 1500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
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
          {/* Movement Mode Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-cyan-400">Movement Modes</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleToggleMoveMode('x-axis')}
                variant={movementMode === 'x-axis' ? "default" : "outline"}
                size="sm"
                className={movementMode === 'x-axis' 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "border-red-500/50 hover:bg-red-500/10 text-red-400"
                }
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                X-Axis
              </Button>
              
              <Button
                onClick={() => handleToggleMoveMode('y-axis')}
                variant={movementMode === 'y-axis' ? "default" : "outline"}
                size="sm"
                className={movementMode === 'y-axis' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "border-green-500/50 hover:bg-green-500/10 text-green-400"
                }
              >
                <ArrowUp className="w-3 h-3 mr-1" />
                Y-Axis
              </Button>
              
              <Button
                onClick={() => handleToggleMoveMode('z-axis')}
                variant={movementMode === 'z-axis' ? "default" : "outline"}
                size="sm"
                className={movementMode === 'z-axis' 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
                }
              >
                <ArrowDown className="w-3 h-3 mr-1" />
                Z-Axis
              </Button>
              
              <Button
                onClick={() => handleToggleMoveMode('freehand')}
                variant={movementMode === 'freehand' ? "default" : "outline"}
                size="sm"
                className={movementMode === 'freehand' 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                }
              >
                <Navigation className="w-3 h-3 mr-1" />
                Freehand
              </Button>
            </div>
          </div>

          <Separator className="bg-cyan-500/30" />

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
              
              {/* Position Display */}
              <div className="text-xs text-gray-300 bg-gray-900/50 p-2 rounded">
                <p>Position: [{selectedObject.position.map(n => n.toFixed(1)).join(', ')}]</p>
                <p>Scale: [{selectedObject.scale.map(n => n.toFixed(1)).join(', ')}]</p>
              </div>

              {/* Manual Movement Controls */}
              {movementMode !== 'none' && movementMode !== 'freehand' && (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-cyan-300">Manual Movement</h5>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleMoveObject(movementMode.split('-')[0] as 'x' | 'y' | 'z', -1)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400"
                    >
                      -0.5
                    </Button>
                    <Button
                      onClick={() => handleMoveObject(movementMode.split('-')[0] as 'x' | 'y' | 'z', 1)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400"
                    >
                      +0.5
                    </Button>
                  </div>
                </div>
              )}
              
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
          <div className="text-xs text-gray-400 bg-gray-900/50 p-2 rounded space-y-1">
            <p><strong>Movement Modes:</strong></p>
            <p>• <span className="text-red-400">X-Axis:</span> Left/Right movement</p>
            <p>• <span className="text-green-400">Y-Axis:</span> Up/Down movement</p>
            <p>• <span className="text-blue-400">Z-Axis:</span> Forward/Backward movement</p>
            <p>• <span className="text-purple-400">Freehand:</span> 3D movement in all directions</p>
            <p><strong>Controls:</strong> Long press (mobile) or Ctrl+drag (desktop)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectMoveControls;
