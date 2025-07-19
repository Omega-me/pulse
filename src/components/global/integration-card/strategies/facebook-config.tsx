import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronsUpDown, LoaderCircle, Plus, X } from "lucide-react";
import { FaAd } from "react-icons/fa";
import { useQueryFacebookAdAccounts } from "@/hooks/use-queries";
import Loader from "../../loader";
import { AdAccountProps } from "@/types/ads.types";
import AppDialog from "../../app-dialog";

const FacebookConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: adAccounts, isPending } = useQueryFacebookAdAccounts();

  return (
    <div>
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

        <AppDialog
          title="Select Ad Account"
          trigger={
            <div className="rounded-md border px-4 py-2 font-mono text-sm flex items-center justify-between cursor-pointer  hover:bg-muted hover:opacity-70">
              <span>Selected Ad Account 1 name</span>
            </div>
          }
          description="Are you sure you want to remove this ad account?"
          actionText={
            <span className="flex items-center gap-x-2">
              <Loader state={false}>
                <X />
              </Loader>
              <span>Remove</span>
            </span>
          }
          onConfirm={() => console.log("test")}
        />

        <CollapsibleContent className="flex flex-col gap-2">
          {adAccounts?.status === 200 && adAccounts?.data.length > 0 ? (
            (adAccounts?.data as AdAccountProps[]).map((account) => (
              <div
                key={account.id}
                className="rounded-md border px-4 py-2 font-mono text-sm flex items-center justify-between cursor-pointer hover:bg-muted hover:opacity-70"
              >
                <span>{account.name}</span>
                <LoaderCircle className="animate-spin" />
              </div>
            ))
          ) : (
            <div className="rounded-md border px-4 py-5 font-mono text-sm flex items-center justify-center gap-2">
              <p>No Ad Accounts found</p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FacebookConfig;
