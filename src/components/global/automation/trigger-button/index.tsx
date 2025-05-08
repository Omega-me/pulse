import React, { PropsWithChildren } from 'react';
import PopOver from '../../popover';
import { CirclePlus } from 'lucide-react';

interface Props extends PropsWithChildren {
  label: string;
}

const TriggerButton = (props: Props) => {
  return (
    <PopOver
      className="w-[400px]"
      trigger={
        <div
          className="border-2 border-dashed w-full border-[#3352cc] 
        hover:opacity-80 cursor-pointer 
        transition duration-100 rounded-xl 
        flex gap-x-2 justify-center items-center p-5"
        >
          <CirclePlus color="#7688dd" />
          <p className="text-[#7688dd] font-bold">{props.label}</p>
        </div>
      }
    >
      {props.children}
    </PopOver>
  );
};

export default TriggerButton;
