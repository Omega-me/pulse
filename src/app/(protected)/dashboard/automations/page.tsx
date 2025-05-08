import Aside from '@/components/global/automation/aside';
import AutomationList from '@/components/global/automation/automation-list';
import React from 'react';

const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
      <div className="lg:col-span-4">
        <AutomationList />
      </div>
      <div className="lg:col-span-2">
        <Aside />
      </div>
    </div>
  );
};

export default Page;
