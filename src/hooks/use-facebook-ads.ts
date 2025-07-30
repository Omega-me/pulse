export interface FacebookAdAccountPayload {
  integration: Integration;
  adAccounts: AdAccountProps[];
}

import { findIntegration, Integration } from "@/lib/utils";
import { AdAccountProps } from "@/types/ads.types";
import { IntegrationMetadataProps } from "@/types/integrationMetadata.types";
import { IntegrationType } from "@prisma/client";
import { useUserQuery } from "./use-queries";
import { useAddFacebookAdAccountMutation } from "./use-mutations";
import { useCallback, useEffect, useState } from "react";

export const useFacebookAds = () => {
  const [clickedAdAccountId, setClickedAdAccountId] = useState<string | null>(
    null
  );

  const { data: user } = useUserQuery();

  const { mutate: addAdAccount, isPending: isAddAccountPending } =
    useAddFacebookAdAccountMutation();
  const { mutate: removeAdAccount, isPending: isRemoveAccountPending } =
    useAddFacebookAdAccountMutation();
  const { mutate: setDefaultAdAccount, isPending: isSetDefaultAccountPending } =
    useAddFacebookAdAccountMutation();

  const integration = findIntegration(
    user?.data?.integrations,
    IntegrationType.FACEBOOK
  );

  const metadata = integration?.metadata as IntegrationMetadataProps;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adAccounts =
    metadata?.facebookAdAccounts.sort((a, b) => (a.isDefault ? -1 : 1)) ?? [];

  useEffect(() => {
    if (!clickedAdAccountId && adAccounts.length > 0) {
      const defaultAccount = adAccounts.find((acc) => acc.isDefault);
      setClickedAdAccountId(defaultAccount?.id ?? null);
    }
  }, [adAccounts, clickedAdAccountId]);

  const handleSaveAdAccount = async (adAccount: AdAccountProps) => {
    if (!integration?.id) return;

    // Prevent duplicates
    if (adAccounts.some((acc) => acc.id === adAccount.id)) return;

    if (adAccounts.length === 0) {
      adAccount.isDefault = true;
    }

    const updatedAccounts = [...adAccounts, adAccount];

    const payload: FacebookAdAccountPayload = {
      integration,
      adAccounts: updatedAccounts,
    };

    addAdAccount(payload as any);
    handleSetClickedAdAccountId(adAccount.id);
  };

  const handleRemoveAdAccount = async (adAccountId: string) => {
    if (!integration?.id) return;

    const updatedAccounts = adAccounts.filter((acc) => acc.id !== adAccountId);

    const payload: FacebookAdAccountPayload = {
      integration,
      adAccounts: updatedAccounts,
    };

    removeAdAccount(payload as any);
  };

  const getAdAccountById = (id: string) => {
    return adAccounts.find((acc) => acc.id === id);
  };

  const filterOutUsedAdAccounts = useCallback(
    (accounts?: {
      data?: AdAccountProps[];
      status?: number;
    }): AdAccountProps[] => {
      if (!accounts || accounts.status !== 200 || !accounts.data?.length)
        return [];

      if (!adAccounts?.length) return accounts.data;

      const savedIds = new Set(adAccounts.map((acc) => acc.id));
      return accounts.data.filter((acc) => !savedIds.has(acc.id));
    },
    [adAccounts]
  );

  const getDefaultAdAccount = () => {
    return adAccounts.find((acc) => acc.isDefault) || adAccounts[0] || null;
  };

  const handleSetDefaultAdAccount = (id: string) => {
    if (!integration?.id) return;
    if (id === clickedAdAccountId) return;

    const updatedAccounts = adAccounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));

    const payload: FacebookAdAccountPayload = {
      integration,
      adAccounts: updatedAccounts,
    };

    setDefaultAdAccount(payload as any);
  };

  const handleSetClickedAdAccountId = (id: string | null) => {
    setClickedAdAccountId(id);
  };

  return {
    adAccounts,
    handleSaveAdAccount,
    isAddAccountPending,
    getAdAccountById,
    handleRemoveAdAccount,
    isRemoveAccountPending,
    filterOutUsedAdAccounts,
    getDefaultAdAccount,
    handleSetDefaultAdAccount,
    isSetDefaultAccountPending,
    handleSetClickedAdAccountId,
    clickedAdAccountId,
  };
};
