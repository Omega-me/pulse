import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteButton from "./delete-button";
import NavigateButton from "./naviagation-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";

const AutomationActionButtons = ({
  onNavigate,
  onDelete,
  isTouchDevice,
}: {
  onNavigate: () => void;
  onDelete: () => void;
  isTouchDevice: boolean;
}) => {
  const ButtonGroup = () => (
    <div className="flex gap-x-2">
      <NavigateButton onNavigate={onNavigate} />
      <DeleteButton onDelete={onDelete} />
    </div>
  );

  if (isTouchDevice) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "scale-0 transition-transform duration-300 absolute right-0 top-0 lg:top-1/2 lg:-translate-y-1/2 h-8 w-8 p-0",
              {
                "group-hover:scale-100 group-hover:bg-gray-500/15":
                  isTouchDevice,
              }
            )}
            variant="ghost"
            size="icon"
          >
            <EllipsisVertical size={16} className="text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          align="center"
          className="w-auto bg-transparent border-none shadow-none p-0"
          sideOffset={8}
        >
          <ButtonGroup />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
      <ButtonGroup />
    </div>
  );
};

export default AutomationActionButtons;
