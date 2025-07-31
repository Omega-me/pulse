import { useState, useMemo } from "react";
import usePaths from "./use-navs";
import { useAutomationsQuery } from "./use-queries";
import {
  useChangeListenerPriorityMutation,
  useDeleteAutomationMutation,
  useRemoveListenerMutation,
} from "./use-mutations";
import { arrayMove } from "@dnd-kit/sortable";

const useAutomations = () => {
  const { pathname, handleGoToRoute } = usePaths();
  const { data: automations, isPending: automationsPending } =
    useAutomationsQuery();
  const automationsData = useMemo(() => automations?.data ?? [], [automations]);

  const [listeners, setListeners] = useState([]);

  const { mutate: removeAutomation, isPending: isRemovingAutomation } =
    useDeleteAutomationMutation();
  const { mutate: removeListener } = useRemoveListenerMutation();
  const { mutate: changeListenerPriority } =
    useChangeListenerPriorityMutation();

  /**
   * Reorders listener items and triggers backend priority update.
   */
  const handleSwapListeners = async (event: any, automationId: string) => {
    const { active, over } = event ?? {};
    if (!active?.id || !over?.id || active.id === over.id) return;

    const oldIndex = listeners.findIndex((i) => i.id === active.id);
    const newIndex = listeners.findIndex((i) => i.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newListeners = arrayMove(listeners, oldIndex, newIndex);
      setListeners(newListeners);

      changeListenerPriority({
        automationId,
        activeListenerId: active.id,
        swapedListenerId: over.id,
      } as any);
    }
  };

  /**
   * Removes a listener and updates state.
   */
  const handleDeleteListener = (listenerId: string) => {
    removeListener({ id: listenerId } as any);
    setListeners((prev) => prev.filter((i) => i.id !== listenerId));
  };

  /**
   * Removes an automation.
   */
  const handleDeleteAutomation = (id: string) => {
    removeAutomation({ id } as any);
  };

  /**
   * Navigates to an automation detail page.
   */
  const handleGoToAutomation = (id: string) => {
    handleGoToRoute(`${pathname}/${id}`);
  };

  const handleSelectAutomation = (id?: string) => {
    if (!id) return;
    const selected = automationsData.find((a) => a.id === id);
    setListeners(
      selected?.listener.sort((a, b) => b.priority - a.priority) || []
    );
  };

  return {
    automationsData,
    automationsPending,
    listeners,
    handleDeleteAutomation,
    isRemovingAutomation,
    handleGoToAutomation,
    handleDeleteListener,
    handleSwapListeners,
    handleSelectAutomation,
  };
};

export default useAutomations;
