import { onBoardUser } from "@/actions/user";
import Navbar from "@/components/global/navbar";
import Sidebar from "@/components/global/sidebar";
import React, { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import AppFooter from "@/components/global/app-footer";
import {
  prefetchUserProfile,
  prefetchAutomations,
} from "@/react-query/prefetch";

interface Props extends PropsWithChildren {}

const Layout = async (props: Props) => {
  const user = (await onBoardUser()) as {
    status: number;
    data: {
      firstname?: string;
      lastname?: string;
    };
  };

  // TODO: handle this in other ways because when the onBoarduser fails it goes to an infinite loop
  if (user.status === 500) return redirect("/sign-in");
  let userName = `${user.data?.firstname || ""}  ${user.data?.lastname || ""}`;
  if (userName.trim() === "") userName = "Anonymous Ally";

  // prefetch data
  const client = new QueryClient();
  await prefetchUserProfile(client);
  await prefetchAutomations(client);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="p-3">
        <Sidebar />
        <div className="lg:ml-[250px] lg:pl-10 lg:py-5 flex flex-col overflow-auto">
          <Navbar userName={userName} />
          {props.children}
          <div className="mb-5 mt-5"></div>
          <AppFooter />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
