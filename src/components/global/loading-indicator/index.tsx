'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function LoadingIndicator() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const previousPath = useRef(pathname);
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    if (previousPath.current !== pathname) {
      setIsLoading(true);
      NProgress.start();
      const timer = setTimeout(() => {
        setIsLoading(false);
        NProgress.done();
      }, 400); // adjust for your transition speed
      previousPath.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
