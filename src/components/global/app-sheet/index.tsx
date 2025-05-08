'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useSidebar from '@/hooks/use-sidebar';
import React, { PropsWithChildren, useState } from 'react';

interface Props extends PropsWithChildren {
  trigger: React.ReactNode;
  className?: string;
}
const AppSheet = (props: Props) => {
  const { open, onSetSidebarOpen } = useSidebar();
  return (
    <Sheet onOpenChange={(open) => onSetSidebarOpen(open)} open={open}>
      <SheetTrigger className={props.className}>{props.trigger}</SheetTrigger>
      <SheetContent side="left" className="p-0 w-[250px]">
        {props.children}
      </SheetContent>
    </Sheet>
  );
};

export default AppSheet;
