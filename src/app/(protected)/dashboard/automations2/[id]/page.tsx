import { onGetAutomationInfo } from "@/actions/automation";
import AutomationAlert from "@/components/global/automation/automation-alert";
import DuplicateButton from "@/components/global/automation/dublicate-button";
import NodeTitle from "@/components/global/automation/node/node-title";
import PostNode2 from "@/components/global/automation/post/post-node2";
import ThenNode2 from "@/components/global/automation/then/then-node2";
import AutomationTrigger2 from "@/components/global/automation/trigger/automation-trigger2";
import AutomationBreadCrumb from "@/components/global/bread-crumbs/automation-bread-crumb";
import GlowCard from "@/components/global/glow-card";
import { prefetchUserAutomation } from "@/react-query/prefetch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CircleAlert, CopyPlus } from "lucide-react";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const id = (await params).id;
  try {
    const info = await onGetAutomationInfo(id);
    const title = info?.data?.name || "Automation";
    return { title };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return { title: "Automation Not Found" };
  }
}

const Page = async (props: Props) => {
  const { id } = await props.params;
  const query = new QueryClient();
  await prefetchUserAutomation(query, id);

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="w-full flex flex-col items-center gap-y-2">
        <AutomationAlert id={id} />
        <AutomationBreadCrumb id={id} />
        <GlowCard
          spread={50}
          glow={true}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
          containerClassName="rounded-md w-[99%] md:w-11/12 lg:w-10/12 xl:w-6/12"
        >
          <div className="group  p-5 rounded-md flex flex-col bg-[#1d1d1d] gap-y-3">
            <div className="flex gap-x-2 items-center justify-between">
              <NodeTitle
                title="When..."
                icon={<CircleAlert size={18} />}
                className="text-purple-500 font-semibold"
              />
              {/* TODO: handle duplicate automation settings */}
              <DuplicateButton
                trigger={
                  <CopyPlus
                    size={16}
                    className="text-purple-500 scale-0 transition-transform duration-300 group-hover:scale-100 text-muted-foreground cursor-pointer"
                  />
                }
              >
                <div>
                  <p className="text-sm font-light">
                    This will create a copy of the automation, choose the
                    settings you want to keep.
                  </p>
                </div>
              </DuplicateButton>
            </div>
            <AutomationTrigger2 id={id} />
          </div>
        </GlowCard>
        <PostNode2 id={id} />
        <ThenNode2 id={id} />
      </div>
    </HydrationBoundary>
  );
};

export default Page;
