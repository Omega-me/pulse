import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  text: string;
  side?: "bottom" | "top" | "right" | "left";
}

const AppTooltip = ({ text, side, children }: Props) => {
  return (
    <TooltipProvider delayDuration={1}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side ? side : "bottom"}
          className="bg-muted text-white z-50"
        >
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AppTooltip;
