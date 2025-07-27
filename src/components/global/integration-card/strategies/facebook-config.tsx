import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { FaAd } from "react-icons/fa";
import { useFacebookAdAccountsQuery } from "@/hooks/use-queries";
import Loader from "../../loader";
import { AdAccountProps } from "@/types/ads.types";
import AppDialog from "../../app-dialog";
import { useFacebookAds } from "@/hooks/use-facebook-ads";
import { Integration } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  integrated: Integration;
}

const FacebookConfig = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: adAccounts } = useFacebookAdAccountsQuery();
  const {
    adAccounts: facebookAdAccounts,
    handleRemoveAdAccount,
    isAddAccountPending,
    handleSaveAdAccount,
    isRemoveAccountPending,
    filterOutUsedAdAccounts,
    handleSetDefaultAdAccount,
    isSetDefaultAccountPending,
    handleSetClickedAdAccountId,
    clickedAdAccountId,
  } = useFacebookAds();

  const filteredAdAccounts = filterOutUsedAdAccounts(
    adAccounts as { data: AdAccountProps[]; status: number }
  );

  return (
    <div>
      {!props.integrated ? (
        <>
          <div>Facebook is not connected</div>
        </>
      ) : (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex w-full flex-col gap-2"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between gap-4 px-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <FaAd size={18} />
                <h4 className="text-sm font-semibold">
                  Your connected Ad accounts
                </h4>
              </div>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only"></span>
              </Button>
            </div>
          </CollapsibleTrigger>

          {facebookAdAccounts.length > 0 ? (
            <>
              {facebookAdAccounts.map((account) => (
                <AppDialog
                  className="!w-[400px]"
                  key={account.id}
                  title="Select Ad Account"
                  trigger={
                    <div className="rounded-md border px-4 py-2 font-mono text-sm flex items-center justify-between cursor-pointer">
                      <span>{account.name}</span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetClickedAdAccountId(account.id);
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Loader
                          state={
                            isSetDefaultAccountPending &&
                            clickedAdAccountId === account.id
                          }
                        >
                          <Label htmlFor="default_account">Default</Label>
                        </Loader>
                        <Switch
                          checked={account.isDefault}
                          id="default_account"
                          onCheckedChange={() =>
                            handleSetDefaultAdAccount(account.id)
                          }
                        />
                      </div>
                    </div>
                  }
                  description="Are you sure you want to remove this ad account?"
                  actionText={
                    <span className="flex items-center gap-x-2">
                      <Loader state={isRemoveAccountPending}>
                        <Trash2 />
                      </Loader>
                      <span>Remove</span>
                    </span>
                  }
                  onConfirm={() => handleRemoveAdAccount(account.id)}
                />
              ))}
            </>
          ) : (
            <div className="rounded-md border px-4 py-2 font-mono text-sm flex items-center justify-between cursor-pointer">
              <span>No ad account is selected</span>
            </div>
          )}

          <CollapsibleContent className="flex flex-col gap-2">
            {filteredAdAccounts.length > 0 ? (
              <>
                {filteredAdAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-md border px-4 py-2 font-mono text-sm flex items-center justify-between cursor-pointer"
                  >
                    <span>{account.name}</span>
                    <Button
                      onClick={() => {
                        handleSaveAdAccount({ ...account, isDefault: false });
                      }}
                      variant="ghost"
                      size="icon"
                      className="size-8"
                    >
                      <Loader
                        state={
                          isAddAccountPending &&
                          clickedAdAccountId === account.id
                        }
                      >
                        <Plus />
                      </Loader>
                    </Button>
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded-md border px-4 py-5 font-mono text-sm flex items-center justify-center gap-2">
                <p>No Ad Accounts found</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default FacebookConfig;
