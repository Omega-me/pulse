"use client";
import React, { PropsWithChildren, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import PopOver from "../../popover";

interface Props extends PropsWithChildren {
  trigger: React.JSX.Element;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

function TriggerButton2({
  trigger,
  title,
  description,
  footer,
  children,
}: Props) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <PopOver className="w-[400px]" trigger={trigger}>
        <div>
          <p>{title}</p>
          <p>{description}</p>
        </div>
        {children}
        <div>{footer}</div>
      </PopOver>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-center items-center w-full p-3">
          {children}
        </div>
        <DrawerFooter>{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default TriggerButton2;
