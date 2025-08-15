"use client";
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
import useAutomations from "@/hooks/useAutomations";
import { AppSkeleton } from "../../app-skeleton";
import GlowCard from "../../glow-card";
import Sortable from "../../sortable";
import CreateAutomation from "../create-automation";
import AutomationHeader from "./automation-header";
import ListenerItem from "./listener-item";

const AutomationList = () => {
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
export default AutomationList;
