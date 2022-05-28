import { combineReducers } from '@reduxjs/toolkit';

import testAPISlice from '../slice/appSlice/test';
import testAppSlice from '../slice/apiSlice/test';

export const rootReducer = combineReducers({
  testAPISlice,
  testAppSlice,
});
