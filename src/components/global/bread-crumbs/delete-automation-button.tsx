import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { Trash2 } from "lucide-react";
import { useDeleteAutomationMutation } from "@/hooks/use-mutations";
import AppDialog from "../app-dialog";

interface Props {
  id: string;
}

const DeleteAutomationButton = (props: Props) => {
  const { mutate: remove, isPending } = useDeleteAutomationMutation();

  return (
    <AppDialog
      className="!w-[400px]"
      trigger={
        <Button className="bg-gradient-to-br hover:opacity-80 text-white rounded-md  font-medium hover:bg-[#4F46E5] bg-[#4F46E5]">
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
      title={"Remove"}
      description={"Do you want to remove this automation?"}
    />
  );
};

export default DeleteAutomationButton;
