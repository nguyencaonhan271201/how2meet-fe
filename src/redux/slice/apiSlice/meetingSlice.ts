import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiMeeting } from '../../../services/axios/apiMeeting/apiMeeting';

export const doCreateMeeting = createAsyncThunk('apiMeeting@post/newMeeting', async (param: IAPIPostNewMeeting) => {
  const result: AxiosResponse = await apiMeeting.postNewMeeting(param);
  return result.data;
});

export const doGetMeetings = createAsyncThunk('apiMeeting@get/meetings', async (param: IAPIGetMeetings) => {
  const result: AxiosResponse = await apiMeeting.getMeetings(param);
  return result.data;
});

const initialState = {
  isCreatingNewMeeting: false,
  createNewMeetingSuccess: false,
  createNewMeetingError: {},

  meetings: [],
  isGettingMeetings: false,
  gettingMeetingsError: {}
} as IMeetingSlice;

const slice = createSlice({
  name: 'meeting@',
  initialState: initialState,
  reducers: {
    resetMeetingCreationStatus(state) {
      state.isCreatingNewMeeting = false;
      state.createNewMeetingSuccess = false;
      state.createNewMeetingError = {};
    }
  },
  extraReducers: (builder) => {
    //doPostNewUser
    builder.addCase(doCreateMeeting.pending, (state) => {
      state.isCreatingNewMeeting = true;
      state.createNewMeetingSuccess = false;
    });
    builder.addCase(doCreateMeeting.fulfilled, (state, action) => {
      state.createNewMeetingSuccess = true;
      state.isCreatingNewMeeting = false;
    });
    builder.addCase(doCreateMeeting.rejected, (state, action) => {
      state.createNewMeetingSuccess = false;
      state.isCreatingNewMeeting = true;
      state.createNewMeetingError = {
        error: "Error occured"
      }
    });

    //doGetMeetings
    builder.addCase(doGetMeetings.pending, (state) => {
      state.isGettingMeetings = true;
    });
    builder.addCase(doGetMeetings.fulfilled, (state, action) => {
      state.meetings = action.payload;
      state.isGettingMeetings = false;
    });
    builder.addCase(doGetMeetings.rejected, (state, action) => {
      state.isGettingMeetings = false;
      state.gettingMeetingsError = {
        error: "Error occured"
      }
    });
  },
});

const { reducer, actions } = slice;
export const { resetMeetingCreationStatus } = actions;
export default reducer;
