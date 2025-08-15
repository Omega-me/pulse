import React from "react";
import PaymentButton from "../payment-button";

const UpgardeCard = () => {
  return (
    <div className="bg-[#1f1f1f] p-3 rounded-md flex flex-col gap-y-3">
      <span className="text-sm">
        Upgrade to {""}
        <span className="bg-gradient-to-r  from-[#cc3bd4] to-[#d064ac] font-bold bg-clip-text text-transparent">
          Smart AI
        </span>
      </span>
      <p className="text-[#9b9ca0] font-light text-sm">
        Unlock all features <br /> Including AI and more
      </p>
      <PaymentButton />
    </div>
  );
};

export default UpgardeCard;
