import { findIntegration } from "@/lib/utils";
import { AdAccountProps } from "@/types/ads.types";
import { IntegrationMetadataProps } from "@/types/integrationMetadata.types";
import { IntegrationType } from "@prisma/client";
import { useQueryUser } from "./use-queries";
import { useAddFacebookAdAccount } from "./use-mutations";

export const useFacebookAds = () => {
  const { data: user } = useQueryUser();
  const { mutate: addAdAccount, isPending: isAddAccountPending } =
    useAddFacebookAdAccount();
  const { mutate: removeAdAccount, isPending: isRemoveAccountPending } =
    useAddFacebookAdAccount();
  const integration = findIntegration(
    user?.data?.integrations,
    IntegrationType.FACEBOOK
  );
  const metadata = integration?.metadata as IntegrationMetadataProps;
  const adAccounts = metadata?.facebookAdAccounts ?? [];

  const handleSaveAdAccount = async (adAccount: AdAccountProps) => {
    if (!integration?.id) return;
    const updatedAccounts = [...adAccounts, adAccount];
    addAdAccount({ integration, adAccounts: updatedAccounts } as any);
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

  return {
    adAccounts,
    handleSaveAdAccount,
    isAddAccountPending,
    getAdAccountById,
    handleRemoveAdAccount,
    isRemoveAccountPending,
    filterOutUsedAdAccounts,
  };
};
