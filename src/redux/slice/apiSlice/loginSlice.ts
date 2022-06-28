import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiLogin } from '../../../services/axios/apiLogin/apiLogin';

export const doPostNewUser = createAsyncThunk('apiLogin@post/newUser', async (param: IAPIPostNewUser) => {
  const result: AxiosResponse = await apiLogin.postNewUser(param);
  return result.data;
});

export const doGetUserByFirebaseID = createAsyncThunk('apiLogin@get/getUserByFirebaseID', async (param: IAPIUserByFirebaseID) => {
  const result: AxiosResponse = await apiLogin.getUserByFirebaseID(param);
  return result.data;
});

export const doUpdateProfile = createAsyncThunk('apiLogin@post/updateProfile', async (param: IAPIPostNewUser) => {
  const result: AxiosResponse = await apiLogin.updateProfile(param);
  return result.data;
});

const initialState = {
  isCreatingNewUser: false,
  createNewUserError: {},
  createNewUserSuccess: false,

  isGettingUserInfo: false,
  gettingUserInfoSuccess: false,
  user: {},

  isUpdateProfile: false,
  updateProfileSuccess: false,
} as ILoginSlice;

const slice = createSlice({
  name: 'login@',
  initialState: initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    //doPostNewUser
    builder.addCase(doPostNewUser.pending, (state) => {
      state.isCreatingNewUser = true;
    });
    builder.addCase(doPostNewUser.fulfilled, (state, action) => {
      state.createNewUserSuccess = true;
      state.isCreatingNewUser = false;
    });
    builder.addCase(doPostNewUser.rejected, (state, action) => {
      state.createNewUserSuccess = false;
      state.isCreatingNewUser = true;
      state.createNewUserError = {
        error: "Error occured"
      }
    });

    //doGetUserByFirebaseID
    builder.addCase(doGetUserByFirebaseID.pending, (state) => {
      state.isGettingUserInfo = true;
    });
    builder.addCase(doGetUserByFirebaseID.fulfilled, (state, action) => {
      state.gettingUserInfoSuccess = true;
      state.isGettingUserInfo = false;
      state.user = action.payload;
    });
    builder.addCase(doGetUserByFirebaseID.rejected, (state, action) => {
      state.gettingUserInfoSuccess = false;
      state.isGettingUserInfo = false;
    });

    //doUpdateProfile
    builder.addCase(doUpdateProfile.pending, (state) => {
      state.isUpdateProfile = true;
    });
    builder.addCase(doUpdateProfile.fulfilled, (state, action) => {
      state.updateProfileSuccess = true;
      state.isUpdateProfile = false;
      state.user = action.payload;
    });
    builder.addCase(doUpdateProfile.rejected, (state, action) => {
      state.updateProfileSuccess = false;
      state.isUpdateProfile = false;
    });
  },
});

const { reducer, actions } = slice;
export const {  } = actions;
export default reducer;
