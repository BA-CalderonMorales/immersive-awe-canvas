
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUp, ArrowDown, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface MovementModeSelectorProps {
  movementMode: 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand';
  onModeChange: (mode: 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand') => void;
}

const MovementModeSelector = ({ movementMode, onModeChange }: MovementModeSelectorProps) => {
  const handleToggleMoveMode = (mode: typeof movementMode) => {
    const newMode = movementMode === mode ? 'none' : mode;
    onModeChange(newMode);
    
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

  return (
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
  );
};

export default MovementModeSelector;
