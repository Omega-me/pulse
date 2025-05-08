'use client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useQueryAutomation } from '@/hooks/use-queries';
import { TriangleAlert } from 'lucide-react';
import React from 'react';

interface Props {
  id: string;
}

const AutomationAlert = (props: Props) => {
  const { data: automation } = useQueryAutomation(props.id);

  return (
    !automation?.data?.active && (
      <Alert className="mt-4 lg:mt-0 flex items-center">
        <TriangleAlert className="h-7 w-5" />
        <div className="ml-2 mt-1">
          <AlertTitle>Alert</AlertTitle>
          <AlertDescription>This automation will have no effect until it is activated.</AlertDescription>
        </div>
      </Alert>
    )
  );
};

export default AutomationAlert;
