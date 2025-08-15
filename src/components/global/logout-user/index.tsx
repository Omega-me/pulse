"use client";
import React, { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const LogoutUser = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const signoutUser = async () => await signOut({ redirectUrl: "/sign-in" });
    signoutUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};

export default LogoutUser;
