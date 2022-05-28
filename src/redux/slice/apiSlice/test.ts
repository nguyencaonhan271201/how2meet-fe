import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiTest } from '../../../services/axios/apiTest/apiTest';

export const doDemoGetQuery = createAsyncThunk('apiTest@get/demoGetQuery', async (param: IAPIGet) => {
  const result: AxiosResponse = await apiTest.demoGetQuery(param);
  return result.data;
});

export const doDemoGetFormData = createAsyncThunk('apiTest@get/demoGetFormData', async (param: IAPIGet) => {
  const result: AxiosResponse = await apiTest.demoGetFormData(param);
  return result.data;
});

export const doDemoPost = createAsyncThunk('apiTest@post/demoPost', async (param: IAPILogin) => {
  const result: AxiosResponse = await apiTest.demoPost(param);
  return result.data;
});

const initialState = {
  param1: false
} as IAPITestSlice;

const slice = createSlice({
  name: 'searchSchool@',
  initialState: initialState,
  reducers: {
    doDemoReducer(state, action) {
      state.param1 = action.payload.param1;
    },
  },
  extraReducers: (builder) => {
    //doDemoGetQuery
    builder.addCase(doDemoGetQuery.pending, (state) => {
      
    });
    builder.addCase(doDemoGetQuery.fulfilled, (state, action) => {
      
    });
    builder.addCase(doDemoGetQuery.rejected, (state, action) => {
     
    });

    //doDemoGetFormData
    builder.addCase(doDemoGetFormData.pending, (state) => {
      
    });
    builder.addCase(doDemoGetFormData.fulfilled, (state, action) => {
      
    });
    builder.addCase(doDemoGetFormData.rejected, (state, action) => {
     
    });

    //doDemoPost
    builder.addCase(doDemoPost.pending, (state) => {
      
    });
    builder.addCase(doDemoPost.fulfilled, (state, action) => {
      
    });
    builder.addCase(doDemoPost.rejected, (state, action) => {
     
    });
  },
});

const { reducer, actions } = slice;
export const { doDemoReducer } = actions;
export default reducer;
