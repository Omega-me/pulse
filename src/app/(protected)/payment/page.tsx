import { onSubscribe } from "@/actions/user";
import AppError from "@/components/global/error/app-error";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: Promise<{
    session_id: string;
    cancel: boolean;
  }>;
}

const Page = async (props: Props) => {
  const { cancel, session_id } = await props.searchParams;

  if (session_id) {
    const customer = await onSubscribe(session_id);

    if (customer.status === 200) {
      return redirect("/dashboard");
    }

    return <AppError />;
  }

  if (cancel) {
    return <AppError />;
  }
};

export default Page;
