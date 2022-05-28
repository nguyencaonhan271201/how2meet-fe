import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  param2: false
} as IAppTestSlice;

export const appTestSlice = createSlice({
  name: 'appTest@',
  initialState: initialState,
  reducers: {
    doUpdate(state, action) {
      state.param2 = action.payload.param2;
    },
  },
});

const { actions, reducer } = appTestSlice;
export const { doUpdate } = actions;
export default reducer;
