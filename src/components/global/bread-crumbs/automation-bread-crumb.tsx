"use client";
import { Activity, ChevronRight, Pencil } from "lucide-react";
import React from "react";
import ActivateAutomationButton from "./activate-automation-button";
import { useQueryAutomation } from "@/hooks/use-queries";
import { useEditAutomation } from "@/hooks/use-mutations";
import { Input } from "@/components/ui/input";
import AppTooltip from "../app-tooltip";
import DeleteAutomationButton from "./delete-automation-button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import usePaths from "@/hooks/use-navs";

interface Props {
  id: string;
}

const AutomationBreadCrumb = (props: Props) => {
  const { handleGoToRoute } = usePaths();
  const isMobile = useIsMobile();
  const { data: automationInfo } = useQueryAutomation(props.id);
  const { edit, enableEdit, inputRef, handleUpdate, isPending, variables } =
    useEditAutomation(props.id);

  return (
    <div
      className={cn(
        automationInfo?.data?.active ? "mt-5" : "mt-0",
        "w-full lg:mt-0 p-5 bg-[#18181b1a] rounded-xl border-[1px] flex justify-between items-center"
      )}
    >
      <div className="flex justify-between items-center">
        <p
          onClick={() => handleGoToRoute("/dashboard/automations")}
          className="text-[#bec0c5] cursor-pointer flex items-center gap-x-2"
        >
          {isMobile ? (
            <Activity className="mr-2" />
          ) : (
            <>
              <Activity />
              <span>Automation</span>
            </>
          )}
        </p>
        {!isMobile && <ChevronRight color="#9b9ca0" />}
        <span className="flex justify-between items-center gap-x-2">
          {edit ? (
            <Input
              className="mr-3"
              ref={inputRef}
              defaultValue={automationInfo?.data?.name}
              placeholder={isPending ? variables?.name : "Add new name"}
              onBlur={handleUpdate}
            />
          ) : (
            <AppTooltip text="Double click to edit">
              <p
                onDoubleClick={enableEdit}
                className="text-[#9b9ca0] cursor-pointer"
              >
                {variables?.name || automationInfo?.data?.name}
              </p>
            </AppTooltip>
          )}
          {edit ? (
            <></>
          ) : (
            <span
              onClick={enableEdit}
              className="cursor-pointer hover:opacity-75 duration-100 transition"
            >
              <Pencil color="#9b9ca0" size={15} />
            </span>
          )}
        </span>
      </div>
      <div className="flex gap-x-2">
        <ActivateAutomationButton id={props.id} />
        <DeleteAutomationButton id={props.id} />
      </div>
    </div>
  );
};

export default AutomationBreadCrumb;
