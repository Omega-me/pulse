import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  actionBtn?: React.ReactNode;
  title: string;
  description: string;
}

const SideCard = (props: Props) => {
  return (
    <div className="flex flex-col rounded-md bg-[#1f1f1f] gap-y-6 p-5 border-[1px] overflow-hidden border-in-active">
      <div>
        <h2 className="text-xl">{props.title}</h2>
        <p className="text-muted-foreground text-sm">{props.description}</p>
      </div>
      <div className="flex flex-col gap-y-3">{props.children}</div>
      {props.actionBtn}
    </div>
  );
};

export default SideCard;
