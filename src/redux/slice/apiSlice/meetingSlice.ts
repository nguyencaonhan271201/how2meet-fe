import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiMeeting } from '../../../services/axios/apiMeeting/apiMeeting';

export const doCreateMeeting = createAsyncThunk('apiMeeting@post/newUser', async (param: IAPIPostNewUser) => {
  // const result: AxiosResponse = await apiLogin.postNewUser(param);
  // return result.data;
});


const initialState = {
  
} as IMeetingSlice;

const slice = createSlice({
  name: 'meeting@',
  initialState: initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    //doPostNewUser
    builder.addCase(doCreateMeeting.pending, (state) => {
    });
    builder.addCase(doCreateMeeting.fulfilled, (state, action) => {

    });
    builder.addCase(doCreateMeeting.rejected, (state, action) => {

    });


  },
});

const { reducer, actions } = slice;
export const {  } = actions;
export default reducer;
