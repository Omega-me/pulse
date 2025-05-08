import { combineReducers } from '@reduxjs/toolkit';
import automationSclice from './automation-sclice';
import sidebarSlice from './sidebar-slice';

export const rootReducer = combineReducers({
  automation: automationSclice,
  sidebar: sidebarSlice,
});
