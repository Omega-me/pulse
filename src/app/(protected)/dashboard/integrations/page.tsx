import IntegrationCard from "@/components/global/integration-card";
import { INTEGRATIONS_CARDS } from "@/constants/integrations";
import React from "react";
import { toast } from "sonner";

interface Props {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
}

const Page = async (props: Props) => {
  const { message } = await props.searchParams;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full lg:w-8/12 gap-y-5">
        {INTEGRATIONS_CARDS.map((card) => (
          <IntegrationCard message={message} key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Page;
