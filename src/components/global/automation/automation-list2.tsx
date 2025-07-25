"use client";
import React, { useState } from "react";
import {
  BadgeCheckIcon,
  CircleAlert,
  Ellipsis,
  MessageCircleHeart,
  MoveRight,
  SendHorizontal,
  Sparkles,
  Trash2,
  X,
  Zap,
  ZapOff,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import moment from "moment";

import { Button } from "@/components/ui/button";
import AppTooltip from "../app-tooltip";
import CreateAutomation from "./create-automation";
import AppDialog from "../app-dialog";
import Loader from "../loader";
import { AppSkeleton } from "../app-skeleton";
import GlowCard from "../glow-card";
import GradientButton from "../gradient-button";
import Sortable from "../sortable";

import usePaths from "@/hooks/use-navs";
import { useQueryAutomations } from "@/hooks/use-queries";
import { useDeleteAutomation } from "@/hooks/use-mutations";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  Automations,
  Keyword,
  Listener,
  ListenerType,
  Trigger,
  TriggerType,
} from "@prisma/client";
import TriggerButton2 from "./trigger-button-2";
import { Badge } from "@/components/ui/badge";

const AutomationList2 = () => {
  const { pathname, handleGoToRoute } = usePaths();
  const { data: automations, isPending: automationsPending } =
    useQueryAutomations();
  const { mutate: remove, isPending } = useDeleteAutomation();
  const [items, setItems] = useState([]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setItems(arrayMove(items, oldIndex, newIndex));
        console.log(`Swapped: ${active.id} ↔ ${over.id}`);
        // TODO: handle listener order update here
      }
    }
  };

  if (automationsPending) return <AppSkeleton span={3} />;

  if (automations.data.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center gap-y-3">
        <h3 className="text-lg text-gray-400">No Automations</h3>
        <CreateAutomation />
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="flex flex-col gap-y-3"
      onValueChange={(id) => {
        const selected = automations.data.find((a) => a.id === id);
        setItems(selected?.listener || []);
      }}
    >
      {automations.data.map((automation) => (
        <GlowCard
          key={automation.id}
          spread={50}
          glow
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
          containerClassName="bg-[#1d1d1d] rounded-xl w-[99%] mx-auto h-auto"
        >
          <AccordionItem value={automation.id} className="border-none group">
            <AccordionTrigger className="hover:no-underline px-5">
              <AutomationHeader
                automation={automation}
                onDelete={() => remove({ id: automation.id } as any)}
                onNavigate={() =>
                  handleGoToRoute(`${pathname}/${automation.id}`)
                }
                isPending={isPending}
              />
            </AccordionTrigger>
            <AccordionContent className="p-5 flex flex-col gap-y-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToParentElement, restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  disabled={items.length <= 1}
                  items={items.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No listeners found for this automation.
                    </p>
                  ) : (
                    items.map((listener) => (
                      <Sortable
                        key={listener.id}
                        id={listener.id}
                        showHandle={items.length > 1}
                        className="bg-[#1d1d1d] pr-5 group/listener border border-muted-foreground/20 rounded-md flex justify-between items-center"
                      >
                        <ListenerItem
                          automation={automation}
                          listener={listener}
                          onDelete={() => console.log(listener)}
                        />
                      </Sortable>
                    ))
                  )}
                </SortableContext>
              </DndContext>
            </AccordionContent>
          </AccordionItem>
        </GlowCard>
      ))}
    </Accordion>
  );
};

export default AutomationList2;

interface AutomationHeaderProps {
  automation: Automations & { keywords: Keyword[]; triggers: Trigger[] };
  onDelete: () => void;
  onNavigate: () => void;
  isPending: boolean;
}

const AutomationHeader = ({
  automation,
  onDelete,
  onNavigate,
  isPending,
}: AutomationHeaderProps) => (
  <div className="w-full flex gap-x-2 justify-between">
    <div className="w-3 h-3">
      <AppTooltip side="top" text={automation.active ? "Active" : "Disabled"}>
        {automation.active ? (
          <Badge
            className="w-full h-full rounded-full px-1 bg-green-500/30 border-green-500 hover:bg-green-500/30"
            variant="default"
          />
        ) : (
          <Badge
            className="w-full h-full rounded-full px-1 bg-gray-500/30 border-gray-500 hover:bg-gray-500/30"
            variant="default"
          />
        )}
      </AppTooltip>
    </div>
    <div className="flex flex-col flex-1 items-start">
      <p className="text-sm md:text-md font-semibold">{automation.name}</p>
      <div className="flex flex-col mt-3 gap-y-1">
        {automation.triggers.map((trigger: Trigger) => (
          <div key={trigger.id} className="flex items-center gap-x-2">
            {trigger.type === TriggerType.COMMENT ? (
              <FaInstagram size={16} className="text-pink-400" />
            ) : (
              <SendHorizontal size={16} className="text-blue-400" />
            )}
            <p className="text-muted-foreground text-sm font-light">
              {trigger.type === TriggerType.COMMENT
                ? "User comments on my post."
                : "User sends me a direct message."}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col justify-between items-end min-h-fit">
      <div className="flex items-center gap-x-1 sm:gap-x-2 flex-shrink-0">
        <p className="text-muted-foreground whitespace-nowrap text-[10px] sm:text-[11px] font-light transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:block">
          {moment(automation.updatedAt).fromNow()}
        </p>
        <AppDialog
          className="!w-[400px]"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 transition-all group-hover:opacity-100 rounded-full h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <X size={12} className="sm:hidden" />
              <X size={14} className="hidden sm:block" />
            </Button>
          }
          onConfirm={onDelete}
          title="Remove"
          description="Do you want to remove this automation?"
          actionText={
            <span className="flex items-center gap-x-2">
              <Loader state={isPending}>
                <Trash2 />
              </Loader>
              Remove
            </span>
          }
        />
      </div>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
        variant="ghost"
        className="rounded-full p-3 text-[#9b9ca0] transition group-hover:px-5 group-hover:bg-muted duration-300 mt-auto"
      >
        <span className="transition-transform group-hover:-translate-x-1 duration-300">
          Go to
        </span>
        <MoveRight className="transition-transform group-hover:translate-x-1 duration-300" />
      </Button>
    </div>
  </div>
);
interface ListenerItemProps {
  listener: Listener;
  automation: Automations & { keywords: Keyword[]; triggers: Trigger[] };
  onDelete: () => void;
}

const ListenerItem = ({
  listener,
  automation,
  onDelete,
}: ListenerItemProps) => {
  const keywords: Keyword[] = automation.keywords.filter(
    (k: Keyword) => k.listenerId === listener.id
  );
  const hasCommentTrigger = automation.triggers.find(
    (t) => t.type === TriggerType.COMMENT
  );
  const showKeywords: Keyword[] = keywords.slice(0, 3);
  const keywordColors = [
    "bg-green-500/15 border-green-800",
    "bg-purple-500/15 border-purple-800",
    "bg-yellow-500/15 border-yellow-800",
    "bg-red-500/15 border-red-800",
  ];

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 w-full">
      {/* Header with AI type and actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-shrink-0">
          {listener.listener === ListenerType.SMARTAI ? (
            <div className="flex items-center justify-center text-[10px] sm:text-[11px] rounded-full px-2 sm:px-3 py-1 border-[1px] bg-purple-500/15 border-purple-800">
              <Sparkles size={10} className="text-purple-500 mr-1" />
              <span className="text-purple-500 font-medium">Smart AI</span>
            </div>
          ) : (
            <div className="flex items-center justify-center text-[10px] sm:text-[11px] rounded-full px-2 sm:px-3 py-1 border-[1px] bg-gray-500/15 border-gray-500">
              <CircleAlert size={10} className="text-gray-400 mr-1" />
              <span className="text-gray-400 font-medium">Standard</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-1 sm:gap-x-2 flex-shrink-0">
          <p className="text-muted-foreground whitespace-nowrap text-[10px] sm:text-[11px] font-light transition-all duration-300 opacity-0 group-hover/listener:opacity-100 hidden sm:block">
            {moment(listener.createdAt).fromNow()}
          </p>
          <AppDialog
            className="!w-[400px]"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 transition-all group-hover/listener:opacity-100 rounded-full h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <X size={12} className="sm:hidden" />
                <X size={14} className="hidden sm:block" />
              </Button>
            }
            onConfirm={onDelete}
            title="Remove"
            description="Do you want to remove this automation?"
            actionText={
              <span className="flex items-center gap-x-2">
                <Loader state={false}>
                  <Trash2 />
                </Loader>
                Remove
              </span>
            }
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="space-y-2">
        {/* DM Response */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#0f0f0f]/30 rounded-md border border-muted-foreground/10">
          {listener.listener === ListenerType.SMARTAI ? (
            <Sparkles
              size={14}
              className="text-purple-500 flex-shrink-0 sm:size-4"
            />
          ) : (
            <SendHorizontal
              size={14}
              className="text-blue-400 flex-shrink-0 sm:size-4"
            />
          )}

          <div className="flex-1 min-w-0">
            <p
              className={cn("text-[10px] sm:text-[11px] font-medium mb-0.5", {
                "text-purple-500": listener.listener === ListenerType.SMARTAI,
                "text-blue-400": listener.listener === ListenerType.MESSAGE,
              })}
            >
              {listener.listener === ListenerType.SMARTAI
                ? "AI prompt"
                : "DM Response"}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-snug line-clamp-3">
              {listener.prompt}
            </p>
          </div>
        </div>

        {/* Comment Reply */}
        {hasCommentTrigger && (
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#0f0f0f]/30 rounded-md border border-muted-foreground/10">
            <MessageCircleHeart
              size={14}
              className="text-pink-400 flex-shrink-0 sm:size-4"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] text-pink-400 font-medium mb-0.5">
                Comment Reply
              </p>
              <p className="text-xs sm:text-sm text-gray-400 leading-snug line-clamp-3">
                {listener.commentReply || "No comment reply set"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Keywords section */}
      <div className="space-y-2">
        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
          Keywords {keywords.length > 0 && `(${keywords.length})`}
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {showKeywords.map((keyword, i) => (
            <div
              key={keyword.id}
              className={cn(
                "flex items-center justify-center text-[10px] sm:text-[11px] rounded-full px-2 sm:px-3 py-1 border-[1px] font-medium",
                keywordColors[i % keywordColors.length]
              )}
            >
              <p className="truncate max-w-[80px] sm:max-w-[120px]">
                {keyword.word}
              </p>
            </div>
          ))}

          {keywords.length > 3 && (
            <TriggerButton2
              trigger={
                <div className="flex items-center justify-center rounded-full px-2 sm:px-3 py-1 border-[1px] bg-gray-500/15 border-gray-500 hover:bg-gray-500/30 cursor-pointer text-[10px] sm:text-[11px] font-medium">
                  <span className="text-gray-300 mr-1">
                    +{keywords.length - 3}
                  </span>
                  <Ellipsis size={10} className="text-gray-300 sm:size-3" />
                </div>
              }
              title="All keywords"
            >
              <div className="flex flex-wrap gap-2 mt-5">
                {keywords.map((keyword, i) => (
                  <div
                    key={keyword.id}
                    className={cn(
                      "flex items-center justify-center text-[11px] sm:text-[12px] rounded-full py-2 px-3 border-[1px] font-medium",
                      keywordColors[i % keywordColors.length]
                    )}
                  >
                    <p>{keyword.word}</p>
                  </div>
                ))}
              </div>
            </TriggerButton2>
          )}

          {keywords.length === 0 && (
            <div className="flex items-center justify-center rounded-full border-[1px] bg-muted/50 border-dashed border-muted-foreground/40 py-1 px-2 sm:px-3">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium italic">
                No keywords configured
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
