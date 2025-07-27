"use client";
import {
  onActivateAutomation,
  onChangeListenerPriority,
  onCreateAutomation,
  onDeleteAutomation,
  onRemoveListener,
  onUpdateAutomationName,
} from "@/actions/automation";
import { useMutationData } from "./use-mutation-data";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IntegrationType } from "@prisma/client";
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

export const useDeleteAutomationMutation = () => {
  const router = useRouter();
  const { mutate, isPending, variables } = useMutationData(
    ["delete-automation"],
    async (data) => {
      const { id } = data as unknown as { id: string };
      return await onDeleteAutomation(id);
    },
    ["user-automations"],
    () => {
      router.push("/dashboard/automations2");
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

export const useRemoveListenerMutation = () => {
  const { mutate, isPending, variables } = useMutationData(
    ["remove-listener"],
    async (data) => {
      const { id } = data as unknown as { id: string };
      return await onRemoveListener(id);
    },
    ["user-automations"]
    // "automation-info", id
  );

  return { mutate, isPending, variables };
};

export const useChangeListenerPriorityMutation = () => {
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
    ["user-automations"]
  );

  return { mutate, isPending, variables };
};
