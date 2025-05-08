import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialSidebarProps {
  open: boolean;
}

const initialState: InitialSidebarProps = {
  open: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<InitialSidebarProps>) => {
      state.open = action.payload.open;
      return state;
    },
  },
});

export const { setOpen } = sidebarSlice.actions;

export default sidebarSlice.reducer;
