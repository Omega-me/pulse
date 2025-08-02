import { Popover, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PopoverTrigger } from "@radix-ui/react-popover";
import React, { JSX, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  trigger: JSX.Element;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const PopOver = (props: Props) => {
  return (
    <Popover onOpenChange={(open) => props.onOpenChange?.(open)}>
      <PopoverTrigger asChild>{props.trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className={cn("bg-[#1d1d1d] shadow-lg", props.className)}
      >
        {props.children}
      </PopoverContent>
    </Popover>
  );
};

export default PopOver;
