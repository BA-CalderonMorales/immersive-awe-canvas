
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Edit3, Trash2, Copy, Move, Palette } from 'lucide-react';
import { SceneObject } from '@/types/sceneObjects';

interface ObjectContextMenuProps {
  children: React.ReactNode;
  object: SceneObject;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: () => void;
  onChangeColor: () => void;
}

const ObjectContextMenu = ({
  children,
  object,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
  onChangeColor,
}: ObjectContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-black/90 backdrop-blur-sm border border-cyan-500/30 text-white">
        <ContextMenuItem onClick={onEdit} className="hover:bg-cyan-500/20">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Properties
        </ContextMenuItem>
        <ContextMenuItem onClick={onMove} className="hover:bg-cyan-500/20">
          <Move className="w-4 h-4 mr-2" />
          Move Object
        </ContextMenuItem>
        <ContextMenuItem onClick={onChangeColor} className="hover:bg-cyan-500/20">
          <Palette className="w-4 h-4 mr-2" />
          Change Color
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-cyan-500/30" />
        <ContextMenuItem onClick={onDuplicate} className="hover:bg-cyan-500/20">
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="hover:bg-red-500/20 text-red-400">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ObjectContextMenu;
