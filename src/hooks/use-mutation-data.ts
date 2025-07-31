"use client";
import {
  MutateFunction,
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutateFunction<any, any>,
  queryKey: QueryKey,
  onSuccess?: (data: any) => void,
  optimisticSettings?: {
    delete?: boolean;
    create?: boolean;
  }
) => {
  const client = useQueryClient();
  const { mutate, isPending, variables } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (res) => {
      if (onSuccess) onSuccess(res);
      const headerTxt =
        res?.status === 200 || res?.status === 201 ? "Success" : "Error";
      return toast(headerTxt, {
        description: res?.data,
      });
    },
    onMutate: async (variables: any) => {
      await client.cancelQueries({ queryKey });

      const previousData: any = client.getQueryData(queryKey);

      if (optimisticSettings?.delete) {
        client.setQueryData(queryKey, (old: { data: any[] }) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((item) => item.id !== variables.id),
          };
        });
      }

      if (optimisticSettings?.create) {
        client.setQueryData(queryKey, (old: { data: any[] }) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: [variables, ...old.data], // Or [...old.data, variables] if you want to append
          };
        });
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback to previous data if there's an error
      if (context?.previousData) {
        client.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: async () => {
      return await client.invalidateQueries({ queryKey });
    },
  });

  return { mutate, isPending, variables };
};
