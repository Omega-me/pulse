import { usePathname, useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import useSidebar from './use-sidebar';

export const usePaths = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { onSetSidebarOpen } = useSidebar();

  const path = pathname.split('/').filter((p) => p !== '' && p !== 'dashboard');
  const page = !path[0] ? 'home' : path[0];
  const dynamicPath = path.length > 1 ? path[path.length - 1] : '';
  const isPrivateRoute = page !== 'privacy-policy' && page !== 'terms-of-service';

  const handleGoToRoute = (route: string) => {
    NProgress.start();
    router.push(route);
    onSetSidebarOpen(false);
  };

  return { page, path, dynamicPath, pathname, handleGoToRoute, isPrivateRoute };
};

export default usePaths;
