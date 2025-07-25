import React, { PropsWithChildren } from "react";
import PopOver from "../../popover";
import { CirclePlus } from "lucide-react";

interface Props extends PropsWithChildren {
  label: string;
  onClick?: () => void;
}

const TriggerButton = (props: Props) => {
  return (
    <PopOver
      className="w-[400px]"
      trigger={
        <div
          onClick={props.onClick}
          className="border-2 border-dashed w-full border-purple-500 
        hover:opacity-80 cursor-pointer 
        transition duration-100 rounded-xl 
        flex gap-x-2 justify-center items-center p-5"
        >
          <CirclePlus className="text-purple-500" />
          <p className="text-purple-500 font-bold">{props.label}</p>
        </div>
      }
    >
      {props.children}
    </PopOver>
  );
};

export default TriggerButton;
