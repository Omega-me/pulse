import { onBoardUser } from "@/actions/user";
import Navbar from "@/components/global/navbar";
import Sidebar from "@/components/global/sidebar";
import React, { PropsWithChildren } from "react";
import { redirect, useRouter } from "next/navigation";
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
import LogoutUser from "@/components/global/logout-user";

interface Props extends PropsWithChildren {}

export const client = new QueryClient();

const Layout = async (props: Props) => {
  const user = (await onBoardUser()) as {
    status: number;
    data: {
      firstname?: string;
      lastname?: string;
    };
  };

  if (user.status === 500) {
    return <LogoutUser />;
  }

  let userName = `${user.data?.firstname.trim() || ""}  ${
    user.data?.lastname.trim() || ""
  }`;
  if (userName.trim() === "") userName = "Anonymous Ally";

  // prefetch data
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
