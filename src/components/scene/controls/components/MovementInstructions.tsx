
const MovementInstructions = () => {
  return (
    <div className="text-xs text-gray-400 bg-gray-900/50 p-2 rounded space-y-1">
      <p><strong>Movement Modes:</strong></p>
      <p>• <span className="text-red-400">X-Axis:</span> Left/Right movement</p>
      <p>• <span className="text-green-400">Y-Axis:</span> Up/Down movement</p>
      <p>• <span className="text-blue-400">Z-Axis:</span> Forward/Backward movement</p>
      <p>• <span className="text-purple-400">Freehand:</span> 3D movement in all directions</p>
      <p><strong>Controls:</strong> Long press (mobile) or Ctrl+drag (desktop)</p>
    </div>
  );
};

export default MovementInstructions;
