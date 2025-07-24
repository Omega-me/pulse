"use client";
import React, { PropsWithChildren } from "react";
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
  onClick?: () => void;
}

function AppTriggerButton(props: Props) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <PopOver className="w-[400px]" trigger={props.trigger}>
        {props.children}
      </PopOver>
    );
  }

  const renderTrigger = () => {
    return props.trigger;
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>{renderTrigger()}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{props?.title}</DrawerTitle>
          <DrawerDescription>{props?.description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-center items-center w-full p-3">
          {props.children}
        </div>
        <DrawerFooter>{props?.footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AppTriggerButton;
