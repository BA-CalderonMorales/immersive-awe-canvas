
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { World } from "@/types/world";
import { Globe } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorldSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  worlds: World[] | undefined;
  onSelectWorld: (index: number) => void;
}

const WorldSearchDialog = ({ isOpen, onOpenChange, worlds, onSelectWorld }: WorldSearchDialogProps) => {
  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Search Worlds</DialogTitle>
      <DialogDescription className="sr-only">
        Search for a world by name and jump to it directly.
      </DialogDescription>
      <CommandInput placeholder="Search for a world..." />
      <CommandList>
        <ScrollArea className="h-[300px] pr-3">
          <CommandEmpty>No results found.</CommandEmpty>
          {worlds && worlds.length > 0 && (
            <CommandGroup heading="Worlds">
              {worlds.map((world, index) => (
                <CommandItem
                  key={world.id}
                  value={world.name}
                  onSelect={() => {
                    onSelectWorld(index);
                    onOpenChange(false);
                  }}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span>{world.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
};

export default WorldSearchDialog;
