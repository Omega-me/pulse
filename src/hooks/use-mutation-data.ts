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
  onSuccess?: (data: any) => void
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
    onSettled: async () => {
      return await client.invalidateQueries({ queryKey });
    },
  });

  return { mutate, isPending, variables };
};
