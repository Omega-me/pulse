import { onGetAllAutomations, onGetAutomationInfo } from "@/actions/automation";
import { onUserInfo } from "@/actions/user";
import { QueryClient, QueryFunction } from "@tanstack/react-query";

const prefetch = async (
  client: QueryClient,
  action: QueryFunction,
  key: string
) => {
  return await client.prefetchQuery({
    queryKey: [key],
    queryFn: action,
    staleTime: 60000,
  });
};

export const prefetchUserProfile = async (client: QueryClient) => {
  return await prefetch(client, onUserInfo, "user-profile");
};

export const prefetchAutomations = async (
  client: QueryClient,
  query?: string
) => {
  return await prefetch(
    client,
    () => onGetAllAutomations(query),
    "user-automations"
  );
};

export const prefetchUserAutomation = async (
  client: QueryClient,
  automationId: string
) => {
  return await prefetch(
    client,
    () => onGetAutomationInfo(automationId),
    "automation-info"
  );
};
