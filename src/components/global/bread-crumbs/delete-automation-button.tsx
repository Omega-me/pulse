import { Button } from '@/components/ui/button';
import React from 'react';
import Loader from '../loader';
import { Trash2, X } from 'lucide-react';
import { useDeleteAutomation } from '@/hooks/use-mutations';
import AppDialog from '../app-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  id: string;
}

const DeleteAutomationButton = (props: Props) => {
  const { mutate: remove, isPending } = useDeleteAutomation();
  const isMobile = useIsMobile();

  return (
    <AppDialog
      trigger={
        <Button className="bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352cc] font-medium to-[#1c2d70]">
          <Loader state={isPending}>
            <Trash2 />
          </Loader>
        </Button>
      }
      onConfirm={() => remove({ id: props.id } as unknown as any)}
      actionText={
        <span className="flex items-center gap-x-2">
          <Loader state={isPending}>
            <Trash2 />
          </Loader>
          Remove
        </span>
      }
      title={'Remove'}
      description={'Do you want to remove this automation?'}
    />
  );
};

export default DeleteAutomationButton;
