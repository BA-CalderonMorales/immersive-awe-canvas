
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ObjectMoveControls from "@/components/scene/controls/ObjectMoveControls";

interface ObjectControlsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  theme: 'day' | 'night';
}

const ObjectControlsPanel = ({ isOpen, onClose, isMobile, theme }: ObjectControlsPanelProps) => {
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[60vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Object Controls</DrawerTitle>
            <DrawerDescription>
              Move, scale, and manipulate objects in the 3D scene.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mt-4 h-full overflow-y-auto px-4">
            <ObjectMoveControls />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-80">
        <SheetHeader className="text-left">
          <SheetTitle>Object Controls</SheetTitle>
          <SheetDescription>
            Move, scale, and manipulate objects in the 3D scene.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 h-full overflow-y-auto">
          <ObjectMoveControls />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ObjectControlsPanel;
