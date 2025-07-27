"use client";
import { useState } from "react";
import { z } from "zod";
import { useMutationData } from "./use-mutation-data";
import { onSaveListener2 } from "@/actions/automation";
import useZodForm from "./use-zod-form";
import { useAutomationQuery } from "./use-queries";
import { ListenerType } from "@prisma/client";

const promptSchema = z.object({
  prompt: z.string().min(1),
  reply: z.string(),
});

interface Data extends z.infer<typeof promptSchema> {}

const useListener2 = (id: string) => {
  const { data: automation } = useAutomationQuery(id);
  const [listener, setListener] = useState<ListenerType>(null);

  const onSetListener = (type: ListenerType) => setListener(type);

  const { isPending, mutate } = useMutationData(
    ["create-listener"],
    async (data) => {
      const { prompt, reply } = data as unknown as Data;
      return await onSaveListener2(
        id,
        listener || ListenerType.MESSAGE,
        automation?.data.keywords
          .filter((k) => k.listenerId === null)
          .map((k) => k.id) || [],
        prompt,
        reply
      );
    },
    ["automation-info"]
  );

  const { onFormSubmit, register } = useZodForm(promptSchema, mutate);

  return { onSetListener, register, onFormSubmit, listener, isPending };
};

export default useListener2;
