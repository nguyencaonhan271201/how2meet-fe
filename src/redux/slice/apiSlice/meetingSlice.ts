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

export const doGetMeetingByMeetingID = createAsyncThunk('apiMeeting@get/meetingByID', async (param: IAPIGetMeetingByID) => {
  const result: AxiosResponse = await apiMeeting.getMeetingByID(param);
  return result.data;
});

export const doUpdateMeetingParticipantsProfile 
= createAsyncThunk('apiMeeting@post/updateMeetingParticipantsProfile', async (param: IAPIPostNewUser) => {
  const result: AxiosResponse = await apiMeeting.updateMeetingParticipantsProfile(param);
  return result.data;
});

export const doAddInvitatorToMeeting 
= createAsyncThunk('apiMeeting@post/addInvitatorToMeeting', async (param: IAPIAddInvitatorToMeeting) => {
  const result: AxiosResponse = await apiMeeting.addInvitatorToMeeting(param);
  return result.data;
});

export const doUpdateMeeting 
= createAsyncThunk('apiMeeting@post/updateMeeting', async (param: IAPIUpdateMeeting) => {
  const result: AxiosResponse = await apiMeeting.updateMeeting(param);
  return result.data;
});

const initialState = {
  isCreatingNewMeeting: false,
  createNewMeetingSuccess: false,
  createNewMeetingError: {},

  meetings: [],
  isGettingMeetings: false,
  gettingMeetingsError: {},

  meetingByID: {},
  isGettingMeetingByID: false,
  gettingMeetingByIDError: {},

  isUpdateMeetingParticipantsProfile: false,
  updateMeetingParticipantsProfileError: {},

  isAddInvitatorToMeeting: false,
  addInvitatorToMeetingError: {},
  temporarilySavedUserToAdd: {},

  isUpdateMeeting: false,
  updateMeetingSuccess: false,
  updateMeetingError: {},
} as IMeetingSlice;

const slice = createSlice({
  name: 'meeting@',
  initialState: initialState,
  reducers: {
    resetMeetingCreationStatus(state) {
      state.isCreatingNewMeeting = false;
      state.createNewMeetingSuccess = false;
      state.createNewMeetingError = {};
    },

    resetMeetingUpdateStatus(state) {
      state.isUpdateMeeting = false;
      state.updateMeetingSuccess = false;
      state.updateMeetingError = {};
    },

    temporarilySavedUserToAdd(state, action) {
      state.temporarilySavedUserToAdd = action.payload.user;
    }
  },
  extraReducers: (builder) => {
    //doCreateMeeting
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

    //doGetMeetingByMeetingID
    builder.addCase(doGetMeetingByMeetingID.pending, (state) => {
      state.isGettingMeetingByID = true;
    });
    builder.addCase(doGetMeetingByMeetingID.fulfilled, (state, action) => {
      state.meetingByID = action.payload;
      state.isGettingMeetingByID = false;
    });
    builder.addCase(doGetMeetingByMeetingID.rejected, (state, action) => {
      state.isGettingMeetingByID = false;
      state.gettingMeetingByIDError = {
        error: "Error occured"
      }
    });

    //doUpdateMeetingParticipantsProfile
    builder.addCase(doUpdateMeetingParticipantsProfile.pending, (state) => {
      state.isUpdateMeetingParticipantsProfile = true;
    });
    builder.addCase(doUpdateMeetingParticipantsProfile.fulfilled, (state, action) => {
      state.isUpdateMeetingParticipantsProfile = false;
    });
    builder.addCase(doUpdateMeetingParticipantsProfile.rejected, (state, action) => {
      state.isUpdateMeetingParticipantsProfile = false;
      state.updateMeetingParticipantsProfileError = {
        error: "Error occured"
      }
    });

    //doUpdateMeetingParticipantsProfile
    builder.addCase(doAddInvitatorToMeeting.pending, (state) => {
      state.isAddInvitatorToMeeting = true;
    });
    builder.addCase(doAddInvitatorToMeeting.fulfilled, (state, action) => {
      state.isAddInvitatorToMeeting = false;
      state.meetingByID.invitators.push(state.temporarilySavedUserToAdd);
      state.temporarilySavedUserToAdd = {};
    });
    builder.addCase(doAddInvitatorToMeeting.rejected, (state, action) => {
      state.isAddInvitatorToMeeting = false;
      state.addInvitatorToMeetingError = {
        error: "Error occured"
      }
    });

    //doUpdateMeeting
    builder.addCase(doUpdateMeeting.pending, (state) => {
      state.isUpdateMeeting = true;
      state.updateMeetingSuccess = false;
    });
    builder.addCase(doUpdateMeeting.fulfilled, (state, action) => {
      state.updateMeetingSuccess = true;
      state.isUpdateMeeting = false;
    });
    builder.addCase(doUpdateMeeting.rejected, (state, action) => {
      state.updateMeetingSuccess = false;
      state.isUpdateMeeting = true;
      state.updateMeetingError = {
        error: "Error occured"
      }
    });
  },
});

const { reducer, actions } = slice;
export const { resetMeetingCreationStatus, temporarilySavedUserToAdd } = actions;
export default reducer;
