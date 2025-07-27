import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import React from "react";
import AppTooltip from "../app-tooltip";

const Notifications = () => {
  return (
    <AppTooltip text="Notifications">
      <Button className="bg-white hover:bg-white/70 rounded-md py-6">
        <Bell color="#4F46E5" fill="#4F46E5" />
      </Button>
    </AppTooltip>
  );
};

export default Notifications;
