'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import usePaths from '@/hooks/use-navs';

const LogoSmall = () => {
  const { handleGoToRoute } = usePaths();
  const router = useRouter();
  return (
    <div onClick={() => handleGoToRoute('/dashboard')} className="w-full flex justify-center items-center p-5 mt-5 cursor-pointer">
      <Image className="m-10" src="/assets/Pulse.svg" alt="Pulse Logo" width={150} height={100} priority />
    </div>
  );
};

export default LogoSmall;
