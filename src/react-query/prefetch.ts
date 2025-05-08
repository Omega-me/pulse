import { onGetAllAutomations, onGetAutomationInfo } from '@/actions/automation';
import { findAutomation } from '@/actions/automation/query';
import { onUserInfo } from '@/actions/user';
import { QueryClient, QueryFunction } from '@tanstack/react-query';

const prefetch = async (
  client: QueryClient,
  action: QueryFunction,
  key: string,
) => {
  return await client.prefetchQuery({
    queryKey: [key],
    queryFn: action,
    staleTime: 60000,
  });
};

export const PrefetchUserProfile = async (client: QueryClient) => {
  return await prefetch(client, onUserInfo, 'user-profile');
};

export const PrefetchAutomations = async (client: QueryClient) => {
  return await prefetch(client, onGetAllAutomations, 'user-automations');
};

export const PrefetchUserAutomation = async (
  client: QueryClient,
  automationId: string,
) => {
  return await prefetch(
    client,
    () => onGetAutomationInfo(automationId),
    'automation-info',
  );
};
