"use client";
import { cn } from "@/lib/utils";
import React from "react";
import GradientButton from "../gradient-button";
import { CircleAlert, Ellipsis, Trash2, X, Zap, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryAutomations } from "@/hooks/use-queries";
import CreateAutomation from "./create-automation";
import moment from "moment";
import usePaths from "@/hooks/use-navs";
import AppTooltip from "../app-tooltip";
import { useDeleteAutomation } from "@/hooks/use-mutations";
import AppDialog from "../app-dialog";
import Loader from "../loader";
import { AppSkeleton } from "../app-skeleton";

const AutomationList = () => {
  const { pathname, handleGoToRoute } = usePaths();
  const { data: automations, isPending: automationsPending } =
    useQueryAutomations();
  const { mutate: remove, isPending } = useDeleteAutomation();

  if (automationsPending) {
    return <AppSkeleton span={3} />;
  }

  if (automations.data.length === 0) {
    return (
      <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
        <h3 className="text-lg text-gray-400">No Automations</h3>
        <CreateAutomation />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      {automations?.data?.map((automation) => (
        <div
          key={automation?.id}
          className="bg-[#1d1d1d] hover:opacity-80 hover:border-[#545454] transition duration-100 rounded-xl p-5 border-[1px] flex cursor-pointer"
        >
          <div
            onClick={() => handleGoToRoute(`${pathname}/${automation?.id}`)}
            className="flex flex-col flex-1 items-start"
          >
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl font-semibold">{automation?.name}</h2>{" "}
              <span>
                <AppTooltip
                  side="top"
                  text={automation.active ? "Active" : "Disabled"}
                >
                  {automation.active ? (
                    <Zap color="#3352cc" size={20} />
                  ) : (
                    <ZapOff size={20} />
                  )}
                </AppTooltip>
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-light mb-2 truncate w-[170px] md:w-[400px] lg:w-[320px] xl:w-[500px]">
              {automation?.listener[0]?.prompt}
            </p>
            <div className="flex justify-between items-center flex-wrap gap-x-2 mt-3">
              {automation?.keywords?.length > 0 && (
                <>
                  {automation.keywords.slice(0, 3).map((keyword, index) => {
                    const colors = [
                      "bg-green-500/15 border-green-700",
                      "bg-purple-500/15 border-purple-700",
                      "bg-yellow-500/15 border-yellow-700",
                      "bg-red-500/15 border-red-700",
                    ];

                    const colorClass = colors[index % colors.length];

                    return (
                      <div
                        key={keyword.id}
                        className={cn(
                          "rounded-full px-4 py-1 capitalize border-2",
                          colorClass
                        )}
                      >
                        {keyword.word}
                      </div>
                    );
                  })}
                </>
              )}
              {automation.keywords.length > 3 && (
                <div className="rounded-full px-4 py-1 border-2 bg-red-500/15 border-red-700 flex items-center">
                  <Ellipsis />
                </div>
              )}
              {automation?.keywords?.length === 0 && (
                <div className="rounded-full border-2 mt-3 border-dashed border-white/60 px-3 py-1">
                  <p className="text-sm text-[#bfc0c3]">No Keywords</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <p className="capitalize text-sm font-light text-[#9b9ca0]">
                {moment(automation?.updatedAt).format("MMM Do YY")}
              </p>
              <AppDialog
                trigger={
                  <Button
                    variant="ghost"
                    className="rounded-full m-0 p-3 text-[#9b9ca0]"
                  >
                    <X />
                  </Button>
                }
                onConfirm={() =>
                  remove({ id: automation?.id } as unknown as any)
                }
                actionText={
                  <span className="flex items-center gap-x-2">
                    <Loader state={isPending}>
                      <Trash2 />
                    </Loader>
                    Remove
                  </span>
                }
                title={"Remove"}
                description={"Do you want to remove this automation?"}
              />
            </div>

            {automation?.listener[0]?.listener === "SMARTAI" ? (
              <GradientButton
                type="BUTTON"
                className="w-full bg-muted text-white hover:bg-muted"
              >
                <CircleAlert className="text-purple-500" />{" "}
                <span className="text-purple-500">Smart AI</span>
              </GradientButton>
            ) : (
              <Button className="bg-muted hover:bg-muted">
                <CircleAlert className="text-white" />{" "}
                <span className="text-white">Standard</span>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutomationList;
