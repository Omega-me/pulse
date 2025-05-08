import { onGetAutomationInfo } from '@/actions/automation';
import AutomationAlert from '@/components/global/automation/automation-alert';
import PostNode from '@/components/global/automation/post/post-node';
import ThenNode from '@/components/global/automation/then/then-node';
import AutomationTrigger from '@/components/global/automation/trigger/automation-trigger';
import AutomationBreadCrumb from '@/components/global/bread-crumbs/automation-bread-crumb';
import { PrefetchUserAutomation } from '@/react-query/prefetch';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import React from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const id = (await params).id;
  try {
    const info = await onGetAutomationInfo(id);

    const title = info?.data?.name || 'Automation';

    return { title };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return { title: 'Automation Not Found' };
  }
}

const Page = async (props: Props) => {
  const { id } = await props.params;
  const query = new QueryClient();
  await PrefetchUserAutomation(query, id);

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="w-full flex flex-col items-center gap-y-2">
        <AutomationAlert id={id} />
        <AutomationBreadCrumb id={id} />
        <div className="mt-5 w-full lg:w-10/12 xl:w-6/12 p-5 rounded-xl flex flex-col bg-[#1d1d1d] gap-y-3">
          <div className="flex gap-x-2">
            <CircleAlert color="#3352cc" />
            When...
          </div>
          <AutomationTrigger id={id} />
        </div>
        <ThenNode id={id} />
        <PostNode id={id} />
      </div>
    </HydrationBoundary>
  );
};

export default Page;
