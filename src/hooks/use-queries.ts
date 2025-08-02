import {
  onGetAllAutomations,
  onGetAutomationInfo,
  onGetProfilePosts,
} from "@/actions/automation";
import { onGetFacebookAdAccounts } from "@/actions/integrations";
import { onUserInfo } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";

export const useAutomationsQuery = (query?: string) => {
  const automationKey = query
    ? ["user-automations", query]
    : ["user-automations"];
  return useQuery({
    queryKey: automationKey,
    queryFn: () => onGetAllAutomations(query),
  });
};

export const useAutomationQuery = (id: string) => {
  return useQuery({
    queryKey: ["automation-info"],
    queryFn: () => onGetAutomationInfo(id),
  });
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: onUserInfo,
  });
};

export const useAutomationPostsQuery = () => {
  const fetchPosts = async () => await onGetProfilePosts();
  return useQuery({
    queryKey: ["instagram-media"],
    queryFn: fetchPosts,
  });
};

export const useFacebookAdAccountsQuery = () => {
  const fetchAdAccounts = async () => await onGetFacebookAdAccounts();
  return useQuery({
    queryKey: ["facebook-ad-accounts"],
    queryFn: fetchAdAccounts,
  });
};
