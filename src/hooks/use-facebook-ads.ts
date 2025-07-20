import { findIntegration } from "@/lib/utils";
import { AdAccountProps } from "@/types/ads.types";
import { IntegrationMetadataProps } from "@/types/integrationMetadata.types";
import { IntegrationType } from "@prisma/client";
import { useQueryUser } from "./use-queries";
import { useAddFacebookAdAccount } from "./use-mutations";
import { useState } from "react";

export const useFacebookAds = () => {
  const [clickedAdAccountId, setClickedAdAccountId] = useState<string | null>(
    null
  );
  const { data: user } = useQueryUser();
  const { mutate: addAdAccount, isPending: isAddAccountPending } =
    useAddFacebookAdAccount();
  const { mutate: removeAdAccount, isPending: isRemoveAccountPending } =
    useAddFacebookAdAccount();
  const { mutate: setDefaultAdAccount, isPending: isSetDefaultAccountPending } =
    useAddFacebookAdAccount();
  const integration = findIntegration(
    user?.data?.integrations,
    IntegrationType.FACEBOOK
  );
  const metadata = integration?.metadata as IntegrationMetadataProps;
  const adAccounts = metadata?.facebookAdAccounts ?? [];

  const handleSaveAdAccount = async (adAccount: AdAccountProps) => {
    if (!integration?.id) return;
    if (adAccounts.length === 0) {
      adAccount.isDefault = true;
    }
    const updatedAccounts = [...adAccounts, adAccount];
    addAdAccount({ integration, adAccounts: updatedAccounts } as any);
    handleSetClickedAdAccountId(adAccount.id);
  };

  const handleRemoveAdAccount = async (adAccountId: string) => {
    if (!integration?.id) return;
    const updatedAccounts = adAccounts.filter((acc) => acc.id !== adAccountId);
    removeAdAccount({ integration, adAccounts: updatedAccounts } as any);
  };

  const getAdAccountById = (id: string) => {
    return adAccounts.find((acc) => acc.id === id);
  };

  const filterOutUsedAdAccounts = (accounts?: {
    data?: AdAccountProps[];
    status?: number;
  }): AdAccountProps[] => {
    if (!accounts || accounts.status !== 200 || !accounts.data?.length)
      return [];

    if (!adAccounts?.length) return accounts.data;

    const savedIds = new Set(adAccounts.map((acc) => acc.id));
    return accounts.data.filter((acc) => !savedIds.has(acc.id));
  };

  const getDefaultAdAccount = () => {
    return adAccounts.find((acc) => acc.isDefault) || adAccounts[0] || null;
  };

  const handleSetDefaultAdAccount = (id: string) => {
    const updatedAccounts = adAccounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));

    setDefaultAdAccount({ integration, adAccounts: updatedAccounts } as any);
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
    setDefaultAdAccount,
    handleSetDefaultAdAccount,
    isSetDefaultAccountPending,
    handleSetClickedAdAccountId,
    clickedAdAccountId,
  };
};
