"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  trigger: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  actionText?: React.ReactNode;
  node?: React.ReactNode;
  className?: string;
  onConfirm?: () => void;
}

const AppDialog = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-[800px] rounded-md", props?.className)}
      >
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          {props.description && (
            <DialogDescription>{props.description}</DialogDescription>
          )}
        </DialogHeader>
        {props.node}
        <DialogFooter>
          {props.actionText && (
            <Button
              className="bg-gradient-to-br hover:opacity-80 text-white rounded-md from-[#3352cc] font-medium to-[#1c2d70]"
              type="button"
              onClick={props.onConfirm}
            >
              {props.actionText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
