import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiLogin } from '../../../services/axios/apiLogin/apiLogin';

export const doSearchUserByQuery = createAsyncThunk('apiLogin@post/findUsersByQuery', async (param: IAPISearchUserByQuery) => {
  const result: AxiosResponse = await apiLogin.searchUserByQuery(param);
  return result.data;
});

const initialState = {
 searchResults: [],
 isSearchingUser: false,
 searchUserError: {},
} as ISearchUserSlice;

const slice = createSlice({
  name: 'userSearch@',
  initialState: initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    //doSearchUserByQuery
    builder.addCase(doSearchUserByQuery.pending, (state) => {
      state.isSearchingUser = true;
      state.searchResults = [];
    });
    builder.addCase(doSearchUserByQuery.fulfilled, (state, action) => {
      state.isSearchingUser = false;
      state.searchResults = action.payload;
    });
    builder.addCase(doSearchUserByQuery.rejected, (state, action) => {
      state.isSearchingUser = true;
      state.searchUserError = {
        error: "Error occured"
      }
    });
  },
});

const { reducer, actions } = slice;
export const {  } = actions;
export default reducer;
