import { combineReducers } from '@reduxjs/toolkit';

import testAPISlice from '../slice/appSlice/test';
import testAppSlice from '../slice/apiSlice/test';
import loginSlice from '../slice/apiSlice/loginSlice';
import meetingSlice from '../slice/apiSlice/meetingSlice';
import userSearchSlice from '../slice/apiSlice/userSearchSlice';

export const rootReducer = combineReducers({
  testAPISlice,
  testAppSlice,
  loginSlice,
  meetingSlice,
  userSearchSlice
});
