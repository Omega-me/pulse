"use client";
import React, { useState } from "react";
import {
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
  PointerSensor,
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
import { Automations, Keyword, Listener } from "@prisma/client";

const AutomationList2 = () => {
  const { pathname, handleGoToRoute } = usePaths();
  const { data: automations, isPending: automationsPending } =
    useQueryAutomations();
  const { mutate: remove, isPending } = useDeleteAutomation();
  const [items, setItems] = useState([]);

  // const detectSensor = JSON.parse(
  //   sessionStorage.getItem("isWebEntry") ?? "true"
  // )
  //   ? PointerSensor
  //   : TouchSensor;

  // const pointerSensor = useSensor(detectSensor, {
  //   // Additional sensor options
  //   activationConstraint: {
  //     distance: 8,
  //   },
  // });
  // const sensors = useSensors(
  //   // pointerSensor
  //   useSensor(PointerSensor),
  //   useSensor(TouchSensor, {
  //     activationConstraint: {
  //       delay: 150,
  //       tolerance: 5,
  //     },
  //   })
  // );

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
          containerClassName="bg-[#1d1d1d] rounded-xl p-2 w-[99%] mx-auto"
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
                        className="bg-[#1d1d1d] py-5 pr-5 gap-y-5 group/listener border-muted-foreground/20 rounded-lg border flex justify-between items-center"
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

const AutomationHeader = ({ automation, onDelete, onNavigate, isPending }) => (
  <div className="w-full flex items-center justify-between">
    <div className="flex flex-col flex-1 items-start">
      <div className="flex items-center gap-x-2">
        <AppTooltip side="top" text={automation.active ? "Active" : "Disabled"}>
          {automation.active ? (
            <Zap color="#3352cc" size={20} />
          ) : (
            <ZapOff size={20} />
          )}
        </AppTooltip>
        <h2 className="text-sm md:text-xl font-semibold">{automation.name}</h2>
        <p className="capitalize text-sm font-light text-[#9b9ca0] whitespace-nowrap">
          {moment(automation.updatedAt).fromNow()}
        </p>
      </div>
      <div>
        {automation.triggers.map((trigger) => (
          <div key={trigger.id} className="flex items-center gap-x-2">
            {trigger.type === "COMMENT" ? (
              <FaInstagram size={16} className="text-muted-foreground" />
            ) : (
              <SendHorizontal size={16} className="text-muted-foreground" />
            )}
            <p className="text-muted-foreground text-sm font-light my-2">
              {trigger.type === "COMMENT"
                ? "User comments on my post."
                : "User sends me a direct message."}
            </p>
          </div>
        ))}
        {automation.triggers.length === 1 && <br />}
      </div>
    </div>
    <div className="h-[100px] flex flex-col justify-between items-end">
      <AppDialog
        className="!w-[400px]"
        trigger={
          <Button
            variant="ghost"
            className="scale-0 transition duration-300 group-hover:scale-100 rounded-full p-3 text-[#9b9ca0]"
            onClick={(e) => e.stopPropagation()}
          >
            <X />
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
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
        variant="ghost"
        className="rounded-full p-3 text-[#9b9ca0] transition group-hover:px-5 group-hover:bg-muted duration-300"
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
  automation: Automations & { keywords: Keyword[] };
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
  const showKeywords: Keyword[] = keywords.slice(0, 3);
  const keywordColors = [
    "bg-green-500/15 border-green-800",
    "bg-purple-500/15 border-purple-800",
    "bg-yellow-500/15 border-yellow-800",
    "bg-red-500/15 border-red-800",
  ];

  return (
    <div className="flex flex-1 justify-between items-center gap-x-3">
      <div className="flex flex-col gap-y-2">
        <p className="flex items-center gap-x-2 text-muted-foreground text-sm font-light">
          <SendHorizontal size={16} />
          <span className="truncate  max-w-[120px] md:max-w-[150px] lg:max-w-[200px] xl:max-w-[400px]">
            {listener.prompt}
          </span>
        </p>
        {listener.commentReply && (
          <p className="flex items-center gap-x-2 text-muted-foreground text-sm font-light">
            <MessageCircleHeart size={16} />
            <span className="truncate max-w-[120px] md:max-w-[150px] lg:max-w-[200px] xl:max-w-[400px]">
              {listener.commentReply}
            </span>
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {showKeywords.map((keyword, i) => (
            <div
              key={keyword.id}
              className={cn(
                "rounded-full px-4 py-1 capitalize border-2 max-w-[150px]",
                keywordColors[i % keywordColors.length]
              )}
            >
              <span className="truncate block">{keyword.word}</span>
            </div>
          ))}

          {keywords.length > 3 && (
            <div className="rounded-full px-4 py-1 border-2 bg-red-500/15 border-red-700 flex items-center">
              <Ellipsis />
            </div>
          )}

          {keywords.length === 0 && (
            <div className="rounded-full border-2 border-dashed border-white/60 px-3 py-1">
              <p className="text-sm text-[#bfc0c3]">No Keywords</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col h-[100px] justify-between items-end">
        <div className="flex items-center gap-x-2">
          <p className="text-muted-foreground whitespace-nowrap text-sm font-light transition-transform duration-300 translate-x-10 group-hover/listener:translate-x-0">
            {moment(listener.createdAt).fromNow()}
          </p>
          <AppDialog
            className="!w-[400px]"
            trigger={
              <Button
                variant="ghost"
                className="scale-0 transition group-hover/listener:scale-100 rounded-full p-3 text-[#9b9ca0] duration-300 "
                onClick={(e) => e.stopPropagation()}
              >
                <X />
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
        <div>
          {listener.listener === "SMARTAI" ? (
            <GradientButton
              type="BUTTON"
              className="w-full bg-muted text-white hover:bg-muted"
            >
              <Sparkles className="text-purple-500" />
              <span className="text-purple-500">Smart AI</span>
            </GradientButton>
          ) : (
            <Button className="bg-muted hover:bg-muted">
              <CircleAlert className="text-white" />
              <span className="text-white">Standard</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
