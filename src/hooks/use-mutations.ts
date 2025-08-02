"use client";
import {
  onActivateAutomation,
  onChangeListenerMessageResponses,
  onChangeListenerPriority,
  onCreateAutomation,
  onDeleteAutomation,
  onRemoveListener,
  onSaveListener2,
  onToggleActiveListener,
  onUpdateAutomationName,
} from "@/actions/automation";
import { useMutationData } from "./use-mutation-data";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IntegrationType, ListenerType } from "@prisma/client";
import {
  onDisconnectIntegration,
  onUpdateFacebookAdAccounts,
} from "@/actions/integrations";
import { Integration } from "@/lib/utils";
import { AdAccountProps } from "@/types/ads.types";

export const useCreateAutomationMutation = () => {
  const router = useRouter();
  const { isPending, mutate, variables } = useMutationData(
    ["create-automation"],
    onCreateAutomation,
    ["user-automations"],
    (data) => {
      router.push(`/dashboard/automations2/${data.id}`);
    },
    {
      create: true,
    }
  );

  return { isPending, mutate, variables };
};

export const useEditAutomationMutation = (id: string) => {
  const [edit, setIsEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const enableEdit = () => setIsEdit(true);
  const disableEdit = () => setIsEdit(false);

  const { isPending, mutate, variables } = useMutationData(
    ["update-automation"],
    async (data) => {
      const { name } = data as unknown as { name: string };
      return await onUpdateAutomationName(id, {
        name,
      });
    },
    ["automation-info"]
  );

  const handleUpdate = () => {
    if (inputRef.current) {
      const name = inputRef.current.value;
      if (name) {
        mutate({ name } as any);
        disableEdit();
      }
    }
  };

  return {
    isPending,
    variables: variables as unknown as { name: string },
    edit,
    enableEdit,
    disableEdit,
    inputRef,
    handleUpdate,
  };
};

export const useActivateAutomationMutation = (id: string) => {
  const { mutate, isPending, variables } = useMutationData(
    ["activate"],
    async (data) => {
      const { state } = data as unknown as { state: boolean };
      return await onActivateAutomation(id, state);
    },
    ["automation-info"]
  );

  return { mutate, isPending, variables };
};

export const useDeleteAutomationMutation = (query?: string) => {
  const automationKey = query
    ? ["user-automations", query]
    : ["user-automations"];
  const router = useRouter();
  const { mutate, isPending, variables } = useMutationData(
    ["delete-automation"],
    async (data) => {
      const { id } = data as unknown as { id: string };
      return await onDeleteAutomation(id);
    },
    automationKey,
    () => {
      if (!query) {
        router.push("/dashboard/automations2");
      }
    },
    {
      delete: true,
    }
  );

  return { mutate, isPending, variables };
};

export const useDisconnectIntegrationMutation = (strategy: IntegrationType) => {
  const { mutate, isPending, variables } = useMutationData(
    ["disconnect-integration"],
    () => onDisconnectIntegration(strategy),
    ["user-profile"]
  );

  return { mutate, isPending, variables };
};

export const useAddFacebookAdAccountMutation = () => {
  const { mutate, isPending, variables } = useMutationData(
    ["add-facebook-ad-account"],
    async (data) => {
      const { integration, adAccounts } = data as unknown as {
        integration: Integration;
        adAccounts: AdAccountProps[];
      };
      return await onUpdateFacebookAdAccounts(integration, adAccounts);
    },
    ["user-profile"]
  );

  return { mutate, isPending, variables };
};

export const useRemoveListenerMutation = (
  automationId?: string,
  query?: string
) => {
  const queryKey = automationId
    ? ["automation-info"]
    : query
    ? ["user-automations", query]
    : ["user-automations"];
  const { mutate, isPending, variables } = useMutationData(
    ["remove-listener"],
    async (data) => {
      const { id } = data as unknown as { id: string };
      return await onRemoveListener(id);
    },
    queryKey
  );

  return { mutate, isPending, variables };
};

export const useChangeListenerPriorityMutation = (query?: string) => {
  const automationKey = query
    ? ["user-automations", query]
    : ["user-automations"];
  const { mutate, isPending, variables } = useMutationData(
    ["change-listener-priority"],
    async (data) => {
      const { automationId, activeListenerId, swapedListenerId } =
        data as unknown as {
          automationId: string;
          activeListenerId: string;
          swapedListenerId: string;
        };
      return await onChangeListenerPriority(
        automationId,
        activeListenerId,
        swapedListenerId
      );
    },
    automationKey
  );

  return { mutate, isPending, variables };
};

export const useChangeListenerMessageResponsesMutation = () => {
  const { mutate, isPending, variables } = useMutationData(
    ["change-listener-message-responses"],
    async (data) => {
      const { id, prompt, reply } = data as unknown as {
        id: string;
        prompt?: string;
        reply?: string;
      };

      return await onChangeListenerMessageResponses(id, { prompt, reply });
    },
    ["automation-info"]
  );

  return { mutate, isPending, variables };
};

export const useToggleActiveListenerMutation = () => {
  const { mutate, isPending, variables } = useMutationData(
    ["toggle-active-listener"],
    async (data) => {
      const { id } = data as unknown as {
        id: string;
      };

      return await onToggleActiveListener(id);
    },
    ["automation-info"]
  );

  return { mutate, isPending, variables };
};

export const useSaveListenerMutation = (
  automationId: string,
  listenerType: ListenerType,
  keywords: string[]
) => {
  const { isPending, mutate, variables } = useMutationData(
    ["create-listener"],
    async (data) => {
      const { prompt, reply } = data as unknown as {
        prompt: string;
        reply: string;
      };
      return await onSaveListener2(
        automationId,
        listenerType,
        keywords,
        prompt,
        reply
      );
    },
    ["automation-info"]
  );

  return { isPending, mutate, variables };
};
