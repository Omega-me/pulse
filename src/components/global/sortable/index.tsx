"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  id: string;
  className?: string;
  showHandle?: boolean;
}

const Sortable = ({ id, className, showHandle = true, children }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    boxShadow: isDragging
      ? "0 8px 16px rgba(0, 0, 0, 0.25)" // stronger shadow when dragging
      : "none",
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(className)}>
      {showHandle ? (
        <Button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          variant="ghost"
          className="!cursor-grab m-1 w-[16px] group-hover/listener:text-white text-muted-foreground transition duration-300 active:!cursor-grabbing"
        >
          <GripVertical />
        </Button>
      ) : (
        <div className="m-1 w-[16px]" />
      )}

      {children}
    </div>
  );
};

export default Sortable;
