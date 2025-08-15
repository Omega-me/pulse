"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAutomationQuery } from "@/hooks/use-queries";
import { TriangleAlert } from "lucide-react";
import React from "react";

interface Props {
  id: string;
}

const AutomationAlert = (props: Props) => {
  const { data: automation } = useAutomationQuery(props.id);

  return (
    !automation?.data?.active && (
      <Alert className="mt-4 lg:mt-0 flex justify-start items-center">
        <TriangleAlert />
        <AlertDescription className="ml-2 mt-2">
          This automation will have no effect until it is activated.
        </AlertDescription>
      </Alert>
    )
  );
};

export default AutomationAlert;
