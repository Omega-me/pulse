"use client";
import {
  CircleAlert,
  Ellipsis,
  EllipsisVertical,
  MessageCircleHeart,
  MoveRight,
  SendHorizontal,
  Sparkles,
  Trash2,
  X,
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
import Sortable from "../sortable";

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
import NodeTitle from "./node/node-title";
import useAutomations from "@/hooks/useAutomations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useTouch from "@/hooks/use-touch";

const AutomationList2 = () => {
  const {
    automationsData,
    automationsPending,
    listeners,
    handleDeleteAutomation,
    handleGoToAutomation,
    handleDeleteListener,
    handleSwapListeners,
    handleSelectAutomation,
  } = useAutomations();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  if (automationsPending) return <AppSkeleton span={3} />;

  if (automationsData.length === 0) {
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
      onValueChange={handleSelectAutomation}
    >
      {automationsData.map((automation) => (
        <GlowCard
          key={automation?.id}
          spread={50}
          glow
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
          containerClassName="bg-[#1d1d1d] rounded-md w-[99%] mx-auto h-auto"
        >
          <AccordionItem value={automation?.id} className="border-none group">
            <AccordionTrigger className="hover:no-underline px-5">
              <AutomationHeader
                automation={automation}
                onDelete={() => handleDeleteAutomation(automation?.id)}
                onNavigate={() => handleGoToAutomation(automation?.id)}
              />
            </AccordionTrigger>
            <AccordionContent className="p-4 flex flex-col gap-y-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToParentElement, restrictToVerticalAxis]}
                onDragEnd={(event) => handleSwapListeners(event, automation.id)}
              >
                <SortableContext
                  disabled={listeners.length <= 1}
                  items={listeners.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {listeners.length === 0 ? (
                    <div className="text-muted-foreground text-sm p-4">
                      <span>No listeners found for this automation.</span>
                    </div>
                  ) : (
                    listeners.map((listener) => (
                      <Sortable
                        key={listener.id}
                        id={listener.id}
                        showHandle={listeners.length > 1}
                        className={cn(
                          "bg-[#1d1d1d] group/listener border border-muted-foreground/20 rounded-md p-4",
                          {
                            "flex justify-between items-center pl-0":
                              listeners.length > 1,
                          }
                        )}
                      >
                        <ListenerItem
                          automation={automation}
                          listener={listener}
                          onDelete={() => handleDeleteListener(listener.id)}
                          showHandle={listeners.length > 1}
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
}
const AutomationHeader = ({
  automation,
  onDelete,
  onNavigate,
}: AutomationHeaderProps) => {
  const isTouchDevice = useTouch();
  return (
    <div className="relative p-4 w-full flex gap-x-2 justify-between">
      <div className="w-3 h-3">
        <AppTooltip side="top" text={automation.active ? "Active" : "Disabled"}>
          {automation.active ? (
            <Badge
              className="w-full h-full px-1 bg-green-500/30 border-green-500 hover:bg-green-500/30"
              variant="default"
            />
          ) : (
            <Badge
              className="w-full h-full px-1 bg-gray-500/30 border-gray-500 hover:bg-gray-500/30"
              variant="default"
            />
          )}
        </AppTooltip>
      </div>
      <div className="flex flex-col flex-1 items-start">
        <div className="flex items-center gap-x-2">
          <p className="text-sm md:text-md font-semibold">{automation.name}</p>
          <p className="text-muted-foreground whitespace-nowrap text-[9px] sm:text-[11px] font-light">
            {moment(automation.updatedAt).fromNow()}
          </p>
        </div>
        <div className="flex flex-col mt-3 gap-y-1">
          {automation.triggers.map((trigger: Trigger) => (
            <NodeTitle
              key={trigger.id}
              title={
                trigger.type === TriggerType.COMMENT
                  ? "User comments on my post"
                  : "User sends me a direct message"
              }
              icon={
                trigger.type === TriggerType.COMMENT ? (
                  <FaInstagram size={16} className="text-pink-400" />
                ) : (
                  <SendHorizontal size={16} className="text-blue-400" />
                )
              }
              className="text-muted-foreground text-sm font-light"
            />
          ))}
        </div>
      </div>
      <AutomationActionButtons
        onNavigate={onNavigate}
        onDelete={onDelete}
        isTouchDevice={isTouchDevice}
      />
    </div>
  );
};

// Extract button components for reusability
const NavigateButton = ({ onNavigate }: { onNavigate: () => void }) => (
  <Button
    onClick={(e) => {
      e.stopPropagation();
      onNavigate();
    }}
    variant="ghost"
    className="group/btn flex items-center justify-center text-[10px] sm:text-[11px] rounded-md px-3 border bg-gray-500/15 border-gray-500 hover:bg-blue-500/15 hover:border-blue-500 shadow-lg transition-all duration-300"
  >
    <span className="text-gray-400 group-hover/btn:text-blue-500 transition-colors duration-300">
      Go to
    </span>
    <MoveRight className="ml-1 text-gray-400 group-hover/btn:text-blue-500 transition-colors duration-300" />
  </Button>
);

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => (
  <AppDialog
    className="!w-[400px] border-md"
    trigger={
      <Button
        variant="ghost"
        size="icon"
        className="group/btn flex items-center justify-center text-[10px] sm:text-[11px] rounded-md px-2 sm:px-3 py-1 border bg-gray-500/15 border-gray-500 hover:bg-red-500/15 hover:border-red-500 shadow-lg transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <X
          size={12}
          className="text-gray-400 transition-colors duration-300 group-hover/btn:text-red-500"
        />
      </Button>
    }
    onConfirm={onDelete}
    title="Remove"
    description="Do you want to remove this automation?"
    actionText={
      <span className="flex items-center gap-x-2">
        <Trash2 />
        Remove
      </span>
    }
  />
);

// Main component with cleaner structure
const AutomationActionButtons = ({
  onNavigate,
  onDelete,
  isTouchDevice,
}: {
  onNavigate: () => void;
  onDelete: () => void;
  isTouchDevice: boolean;
}) => {
  const ButtonGroup = () => (
    <div className="flex gap-x-2">
      <NavigateButton onNavigate={onNavigate} />
      <DeleteButton onDelete={onDelete} />
    </div>
  );

  if (isTouchDevice) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            className="group-hover:bg-gray-500/15 group-active:scale-100 group-hover:scale-100 scale-0 transition-transform duration-300 absolute right-0 top-0 lg:top-1/2 lg:-translate-y-1/2 h-8 w-8 p-0"
            variant="ghost"
            size="icon"
          >
            <EllipsisVertical size={16} className="text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          align="center"
          className="w-auto bg-transparent border-none shadow-none p-0"
          sideOffset={8}
        >
          <ButtonGroup />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
      <ButtonGroup />
    </div>
  );
};

interface ListenerItemProps {
  listener: Listener;
  automation: Automations & { keywords: Keyword[]; triggers: Trigger[] };
  onDelete: () => void;
  showHandle: boolean;
}
const keywordColors = [
  "bg-green-500/15 border-green-800",
  "bg-purple-500/15 border-purple-800",
  "bg-yellow-500/15 border-yellow-800",
  "bg-red-500/15 border-red-800",
];
const ListenerItem = ({
  listener,
  automation,
  onDelete,
  showHandle,
}: ListenerItemProps) => {
  const keywords: Keyword[] = automation.keywords.filter(
    (k: Keyword) => k.listenerId === listener.id
  );
  const showKeywords: Keyword[] = keywords.slice(0, 3);

  return (
    <div
      className={cn(" space-y-3 sm:space-y-4 w-full", {
        "pt-3 pr-3 pb-3 pl-0": showHandle,
        "p-3 sm:p-4": !showHandle,
      })}
    >
      {/* Header with listener type and actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-shrink-0">
          {listener.listener === ListenerType.SMARTAI ? (
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md p-[1px]">
              <div className="flex gap-x-2 w-full bg-muted text-white hover:bg-muted items-center justify-center rounded-md px-3 py-1">
                <NodeTitle
                  icon={<Sparkles size={10} />}
                  title="Smart AI"
                  className="text-purple-500 text-[11px]"
                />
                <AppTooltip
                  side="top"
                  text={listener.isActive ? "Active" : "Disabled"}
                >
                  {listener.isActive ? (
                    <Badge
                      className="p-1 bg-green-500/30 border-green-500 hover:bg-green-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  ) : (
                    <Badge
                      className="p-1 bg-red-500/30 border-red-500 hover:bg-red-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  )}
                </AppTooltip>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-x-1">
              <div className="flex gap-x-2 items-center justify-center text-[10px] sm:text-[11px] rounded-md px-2 sm:px-3 py-1 border-[1px] bg-gray-500/15 border-gray-500">
                <NodeTitle
                  icon={<CircleAlert size={10} />}
                  title="Standard"
                  className="text-gray-400 text-[11px]"
                />
                <AppTooltip
                  side="top"
                  text={listener.isActive ? "Active" : "Disabled"}
                >
                  {listener.isActive ? (
                    <Badge
                      className="p-1 bg-green-500/30 border-green-500 hover:bg-green-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  ) : (
                    <Badge
                      className="p-1 bg-red-500/30 border-red-500 hover:bg-red-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  )}
                </AppTooltip>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-1 sm:gap-x-2 flex-shrink-0">
          <p className="text-muted-foreground whitespace-nowrap text-[9px] sm:text-[11px] font-light transition-all duration-300 opacity-0 group-hover/listener:opacity-100">
            {moment(listener.createdAt).fromNow()}
          </p>
          <AppDialog
            className="!w-[400px] rounded-md"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="group/btnlistener opacity-0 transition-all group-hover/listener:opacity-100 rounded-md h-6 w-6 sm:h-7 sm:w-7 p-0 bg-gray-500/15 border-gray-500 hover:bg-red-500/15 hover:border-red-500 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <X
                  className="text-gray-400 transition-colors duration-300 group-hover/btnlistener:text-red-500"
                  size={12}
                />
              </Button>
            }
            onConfirm={onDelete}
            title="Remove"
            description="Do you want to remove this listener?"
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
          <div className="flex-1 min-w-0">
            <NodeTitle
              title={
                listener.listener === ListenerType.SMARTAI
                  ? "AI Prompt"
                  : "DM Response"
              }
              icon={
                listener.listener === ListenerType.SMARTAI ? (
                  <Sparkles size={14} />
                ) : (
                  <SendHorizontal size={14} />
                )
              }
              className={cn("text-[10px] sm:text-[11px] font-medium mb-0.5", {
                "text-purple-500": listener.listener === ListenerType.SMARTAI,
                "text-blue-400": listener.listener === ListenerType.MESSAGE,
              })}
            />
            <p className="text-xs sm:text-sm text-gray-400 leading-snug line-clamp-3">
              {listener.prompt}
            </p>
          </div>
        </div>

        {/* Comment Reply */}
        {listener.commentReply && (
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#0f0f0f]/30 rounded-md border border-muted-foreground/10">
            <div className="flex-1 min-w-0">
              <NodeTitle
                title="Comment Reply"
                icon={<MessageCircleHeart size={14} />}
                className="text-[10px] sm:text-[11px] text-pink-400 font-medium mb-0.5"
              />
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
                "flex items-center justify-center text-[10px] sm:text-[11px] rounded-md px-2 sm:px-3 py-1 border-[1px] font-medium",
                keywordColors[i % keywordColors.length]
              )}
            >
              <p className="truncate max-w-[80px] sm:max-w-[120px]">
                {keyword.word}
              </p>
            </div>
          ))}

          <TriggerButton2
            trigger={
              <div className="flex items-center justify-center rounded-md px-2 sm:px-3 py-1 border-[1px] bg-gray-500/15 border-gray-500 hover:bg-gray-500/30 cursor-pointer text-[10px] sm:text-[11px] font-medium">
                <span className="text-gray-300 ">
                  {keywords.length <= 3 ? (
                    <Ellipsis size={10} className="text-gray-300 sm:size-3" />
                  ) : (
                    <span className="flex items-center gap-x-1">
                      <span>+{keywords.length - 3}</span>
                      <Ellipsis size={10} className="text-gray-300 sm:size-3" />
                    </span>
                  )}
                </span>
              </div>
            }
            title="All keywords"
          >
            <div className="flex flex-wrap gap-2 mt-5">
              {keywords.map((keyword, i) => (
                <div
                  key={keyword.id}
                  className={cn(
                    "flex items-center justify-center text-[11px] sm:text-[12px] rounded-md py-2 px-3 border-[1px] font-medium",
                    keywordColors[i % keywordColors.length]
                  )}
                >
                  <p>{keyword.word}</p>
                </div>
              ))}
            </div>
          </TriggerButton2>

          {keywords.length === 0 && (
            <div className="flex items-center justify-center rounded-md border-[1px] bg-muted/50 border-dashed border-muted-foreground/40 py-1 px-2 sm:px-3">
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
