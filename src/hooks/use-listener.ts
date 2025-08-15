"use client";
import { useMemo, useState } from "react";
import { z } from "zod";
import useZodForm from "./use-zod-form";
import { useAutomationQuery } from "./use-queries";
import { ListenerType, TriggerType } from "@prisma/client";
import {
  useChangeListenerMessageResponsesMutation,
  useSaveListenerMutation,
} from "./use-mutations";

const promptSchema = z.object({
  prompt: z.string().min(1),
  reply: z.string(),
});

const useListener = (
  automationId: string,
  listenerId?: string,
  defaultValues?: z.infer<typeof promptSchema>
) => {
  const { data: automation } = useAutomationQuery(automationId);
  const [listener, setListener] = useState<ListenerType>(null);

  const onSetListener = (type: ListenerType) => setListener(type);

  // save listener
  const { isPending, mutate: saveListener } = useSaveListenerMutation(
    automationId,
    listener || ListenerType.MESSAGE,
    automation?.data.keywords
      .filter((k) => k.listenerId === null)
      .map((k) => k.id) || []
  );
  const { onFormSubmit, register } = useZodForm(promptSchema, saveListener);

  // change listener prompt
  const { isPending: isChangingPrompt, mutate: changePrompt } =
    useChangeListenerMessageResponsesMutation();
  const { onFormSubmit: onSavePrompt, register: registerPrompt } = useZodForm(
    z.object({
      id: z.string(),
      prompt: z.string().min(1),
    }),
    changePrompt,
    { ...defaultValues, id: listenerId }
  );

  // change listener comment reply
  const { isPending: isChangingCommentReply, mutate: changeCommentReply } =
    useChangeListenerMessageResponsesMutation();
  const { onFormSubmit: onSaveCommentReply, register: registerCommentReply } =
    useZodForm(
      z.object({
        id: z.string(),
        reply: z.string(),
      }),
      changeCommentReply,
      { ...defaultValues, id: listenerId }
    );

  const hasOnlyDmTrigger = useMemo(() => {
    return (
      automation?.data?.triggers.length === 1 &&
      automation?.data?.triggers[0].type === TriggerType.DM
    );
  }, [automation]);

  return {
    onSetListener,
    register,
    onFormSubmit,
    listener,
    isPending,
    hasOnlyDmTrigger,
    registerPrompt,
    onSavePrompt,
    isChangingPrompt,
    registerCommentReply,
    onSaveCommentReply,
    isChangingCommentReply,
  };
};

export default useListener;
