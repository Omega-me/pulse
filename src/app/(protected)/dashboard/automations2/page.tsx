import Aside from "@/components/global/automation/aside";
import AutomationList2 from "@/components/global/automation/automation-list2";
import React from "react";

const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
      <div className="order-2 lg:order-1 lg:col-span-4">
        <AutomationList2 />
      </div>
      <div className="order-1 lg:order-2 lg:col-span-2">
        <Aside />
      </div>
    </div>
  );
};

export default Page;
