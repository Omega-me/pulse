import { Button } from "@/components/ui/button";
import AppDialog from "../../app-dialog";
import { Trash2, X } from "lucide-react";

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => (
  <AppDialog
    className="!w-[400px] border-md"
    trigger={
      <Button
        variant="ghost"
        size="icon"
        className="group/btn flex items-center justify-center text-[10px] sm:text-[11px] rounded-md px-2 sm:px-3 py-1 border bg-gray-500/15 border-gray-500 hover:bg-red-500/15 hover:border-red-500 shadow-lg transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <X
          size={12}
          className="text-gray-400 transition-colors duration-300 group-hover/btn:text-red-500"
        />
      </Button>
    }
    onConfirm={onDelete}
    title="Remove"
    description="Do you want to remove this automation?"
    actionText={
      <span className="flex items-center gap-x-2">
        <Trash2 />
        Remove
      </span>
    }
  />
);

export default DeleteButton;
