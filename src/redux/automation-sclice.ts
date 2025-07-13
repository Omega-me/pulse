import { dublicateValidation } from "@/lib/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateTriggerProps {
  trigger?: {
    type?: "COMMENT" | "DM";
    keyword?: string;
    types?: string[];
    keywords?: string[];
  };
}

const initialState: initialStateTriggerProps = {
  trigger: {
    type: undefined,
    keyword: undefined,
    types: [],
    keywords: [],
  },
};

const automationSclice = createSlice({
  name: "automation",
  initialState,
  reducers: {
    TRIGGER: (state, action: PayloadAction<initialStateTriggerProps>) => {
      state.trigger!.types = dublicateValidation(
        state.trigger?.types!,
        action.payload.trigger?.type!
      );
      return state;
    },
  },
});

export const { TRIGGER } = automationSclice.actions;

export default automationSclice.reducer;
