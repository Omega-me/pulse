import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  title: string;
  icon: React.ReactNode;
  className?: string;
}

const NodeTitle = ({ title, icon, className }: Props) => {
  return (
    <div className={cn("flex gap-x-2 items-center", className)}>
      {icon}
      {title}
    </div>
  );
};

export default NodeTitle;
