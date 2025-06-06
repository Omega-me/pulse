'use client';
import { onActivateAutomation, onCreateAutomation, onDeleteAutomation, onUpdateAutomationName } from '@/actions/automation';
import { useMutationData } from './use-mutation-data';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useCreateAutomation = () => {
  const router = useRouter();
  const { isPending, mutate, variables } = useMutationData(
    ['create-automation'],
    () => onCreateAutomation(),
    ['user-automations'],
    (data: { id: string }) => {
      router.push(`/dashboard/automations/${data.id}`);
    }
  );

  return { isPending, mutate, variables };
};

export const useEditAutomation = (id: string) => {
  const [edit, setIsEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const enableEdit = () => setIsEdit(true);
  const disableEdit = () => setIsEdit(false);

  const { isPending, mutate, variables } = useMutationData(
    ['update-automation'],
    async (data) => {
      const { name } = data as unknown as { name: string };
      return await onUpdateAutomationName(id, {
        name,
      });
    },
    ['automation-info']
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

export const useActivateAutomation = (id: string) => {
  const { mutate, isPending, variables } = useMutationData(
    ['activate'],
    async (data) => {
      const { state } = data as unknown as { state: boolean };
      return await onActivateAutomation(id, state);
    },
    ['automation-info']
  );

  return { mutate, isPending, variables };
};

export const useDeleteAutomation = () => {
  const router = useRouter();
  const { mutate, isPending, variables } = useMutationData(
    ['delete-automation'],
    async (data) => {
      const { id } = data as unknown as { id: string };
      return await onDeleteAutomation(id);
    },
    ['user-automations'],
    () => {
      router.push('/dashboard/automations');
    }
  );

  return { mutate, isPending, variables };
};
