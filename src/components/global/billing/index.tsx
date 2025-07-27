"use client";
import React from "react";
import PaymentCard from "./payment-card";
import { useUserQuery } from "@/hooks/use-queries";

const Billing = () => {
  const { data: user } = useUserQuery();
  return (
    <>
      <div className="flex lg:flex-row flex-col gap-5 w-full lg:w-10/12 xl:w-8/12 container">
        <PaymentCard label={"PRO"} current={user?.data?.subscription?.plan} />
        <PaymentCard label={"FREE"} current={user?.data?.subscription?.plan} />
      </div>
      <br />
      {/* <p>Pricing plan meant to be used on landing page </p>
      <br />
      <div className="flex lg:flex-row flex-col gap-5 w-full lg:w-10/12 xl:w-8/12 container">
        <PaymentCard landing label={'FREE'} current={'PRO'} />
        <PaymentCard landing label={'PRO'} current={'PRO'} />
      </div> */}
    </>
  );
};

export default Billing;
