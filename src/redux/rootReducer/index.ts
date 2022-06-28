import { combineReducers } from '@reduxjs/toolkit';

import testAPISlice from '../slice/appSlice/test';
import testAppSlice from '../slice/apiSlice/test';
import loginSlice from '../slice/apiSlice/loginSlice';
import meetingSlice from '../slice/apiSlice/meetingSlice';

export const rootReducer = combineReducers({
  testAPISlice,
  testAppSlice,
  loginSlice,
  meetingSlice
});
