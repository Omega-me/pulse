import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setOpen } from '@/redux/sidebar-slice';

const useSidebar = () => {
  const open = useAppSelector((state) => state.sidebar.open);
  const dispatch = useAppDispatch();

  const onSetSidebarOpen = (open: boolean) => {
    dispatch(
      setOpen({
        open,
      })
    );
  };

  return { onSetSidebarOpen, open };
};

export default useSidebar;
