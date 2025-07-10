"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AppError = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <h4 className="text-5xl font-bold">400</h4>
      <p className="text-xl font-bold">Oopps! Something went wrong</p>
    </div>
  );
};

export default AppError;
