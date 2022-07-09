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

export const doGetMeetingImages 
= createAsyncThunk('apiMeeting@get/meetingImages', async (param: IAPIGetMeetingImages) => {
  const result: AxiosResponse = await apiMeeting.getMeetingImages(param);
  return result.data;
});

export const doCreateMeetingImage
= createAsyncThunk('apiMeeting@post/createMeetingImage', async (param: IAPICreateMeetingImage) => {
  const result: AxiosResponse = await apiMeeting.createMeetingImage(param);
  return result.data;
});

export const doDeleteMeetingImage
= createAsyncThunk('apiMeeting@delete/meetingImage', async (param: IAPIDeleteMeetingImage) => {
  const result: AxiosResponse = await apiMeeting.deleteMeetingImage(param);
  return result.data;
});

export const doGetMeetingMinutes 
= createAsyncThunk('apiMeeting@get/meetingMinutes', async (param: IAPIGetMeetingImages) => {
  const result: AxiosResponse = await apiMeeting.getMeetingMinutes(param);
  return result.data;
});

export const doGetMeetingMinute 
= createAsyncThunk('apiMeeting@get/meetingMinute', async (param: IAPIGetMeetingMinute) => {
  const result: AxiosResponse = await apiMeeting.getMeetingMinute(param);
  return result.data;
});

export const doCreateNewMinute 
= createAsyncThunk('apiMeeting@post/createMinute', async (param: IAPICreateMeetingMinute) => {
  const result: AxiosResponse = await apiMeeting.createMeetingMinute(param);
  return result.data;
});

export const doUpdateMinute 
= createAsyncThunk('apiMeeting@post/updateMinute', async (param: IAPIUpdateMeetingMinute) => {
  const result: AxiosResponse = await apiMeeting.updateMeetingMinute(param);
  return result.data;
});

export const doDeleteMinute 
= createAsyncThunk('apiMeeting@post/deleteMinute', async (param: IAPIDeleteMeetingMinute) => {
  const result: AxiosResponse = await apiMeeting.deleteMeetingMinute(param);
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

  meetingImages: [],
  isGettingMeetingImages: false,
  getMeetingImagesSuccess: false,
  gettingMeetingImagesError: {},

  isCreateMeetingImage: false,
  createMeetingImageSuccess: false,
  createMeetingImageError: {},

  isDeleteMeetingImage: false,
  deleteMeetingImageSuccess: false,
  deleteMeetingImageError: {},

  meetingMinutes: [],
  isGettingMeetingMinutes: false,
  getMeetingMinutesSuccess: false,
  gettingMeetingMinutesError: {},

  minuteById: {},
  isGettingMinuteById: false,
  getMinuteByIdError: {},

  isCreatingNewMeetingMinute: false,
  createNewMeetingMinuteSuccess: false,
  createNewMeetingMinuteError: {},

  isUpdatingMeetingMinute: false,
  updateMeetingMinuteSuccess: false,
  updateMeetingMinuteError: {},

  isDeletingMeetingMinute: false,
  deleteMeetingMinuteSuccess: false,
  deleteMeetingMinuteError: {},
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
    },

    updateMeetingPublic(state, action) {
      state.meetingByID.isPublic = action.payload.isPublic;
    },

    resetMeetingImageStatus(state) {
      state.isCreateMeetingImage = false;
      state.createMeetingImageSuccess = false;
      state.createMeetingImageError = {};
      state.isDeleteMeetingImage = false;
      state.deleteMeetingImageSuccess = false;
      state.deleteMeetingImageError = {};
    },

    resetMeetingMinuteStatus(state) {
      state.isDeletingMeetingMinute = false;
      state.deleteMeetingMinuteSuccess = false;
      state.deleteMeetingMinuteError = {};

      state.isCreatingNewMeetingMinute = false;
      state.createNewMeetingMinuteSuccess = false;
      state.createNewMeetingMinuteError = {};

      state.isUpdatingMeetingMinute = false;
      state.updateMeetingMinuteSuccess = false;
      state.updateMeetingMinuteError = {};
    }
  },
  extraReducers: (builder) => {
    //doCreateMeeting
    builder.addCase(doCreateMeeting.pending, (state) => {
      state.isCreatingNewMeeting = true;
      state.createNewMeetingSuccess = false;
      state.createNewMeetingError = {
      }
    });
    builder.addCase(doCreateMeeting.fulfilled, (state, action) => {
      state.createNewMeetingSuccess = true;
      state.isCreatingNewMeeting = false;
    });
    builder.addCase(doCreateMeeting.rejected, (state, action) => {
      state.createNewMeetingSuccess = false;
      state.isCreatingNewMeeting = false;
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
      state.updateMeetingError = {
      }
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

    //doGetMeetingImages
    builder.addCase(doGetMeetingImages.pending, (state) => {
      state.isGettingMeetingImages = true;
      state.getMeetingImagesSuccess = false;
      state.gettingMeetingImagesError = {};
      state.meetingImages = [];
    });
    builder.addCase(doGetMeetingImages.fulfilled, (state, action) => {
      state.getMeetingImagesSuccess = true;
      state.isGettingMeetingImages = false;
      state.meetingImages = action.payload;
    });
    builder.addCase(doGetMeetingImages.rejected, (state, action) => {
      state.getMeetingImagesSuccess = false;
      state.isGettingMeetingImages = true;
      state.gettingMeetingImagesError = {
        error: "Error occured"
      }
    });

    //doCreateMeetingImage
    builder.addCase(doCreateMeetingImage.pending, (state) => {
      state.isCreateMeetingImage = true;
      state.createMeetingImageSuccess = false;
      state.createMeetingImageError = {};
    });
    builder.addCase(doCreateMeetingImage.fulfilled, (state, action) => {
      state.createMeetingImageSuccess = true;
      state.isCreateMeetingImage = false;
    });
    builder.addCase(doCreateMeetingImage.rejected, (state, action) => {
      state.createMeetingImageSuccess = false;
      state.isCreateMeetingImage = true;
      state.createMeetingImageError = {
        error: "Error occured"
      }
    });

    //doDeleteMeetingImage
    builder.addCase(doDeleteMeetingImage.pending, (state) => {
      state.isDeleteMeetingImage = true;
      state.deleteMeetingImageSuccess = false;
      state.deleteMeetingImageError = {};
    });
    builder.addCase(doDeleteMeetingImage.fulfilled, (state, action) => {
      state.deleteMeetingImageSuccess = true;
      state.isDeleteMeetingImage = false;
    });
    builder.addCase(doDeleteMeetingImage.rejected, (state, action) => {
      state.deleteMeetingImageSuccess = false;
      state.isDeleteMeetingImage = true;
      state.deleteMeetingImageError = {
        error: "Error occured"
      }
    });

    //doGetMeetingMinutes
    builder.addCase(doGetMeetingMinutes.pending, (state) => {
      state.isGettingMeetingMinutes = true;
      state.getMeetingMinutesSuccess = false;
      state.gettingMeetingMinutesError = {};
      state.meetingMinutes = [];
    });
    builder.addCase(doGetMeetingMinutes.fulfilled, (state, action) => {
      state.getMeetingMinutesSuccess = true;
      state.isGettingMeetingMinutes = false;
      state.meetingMinutes = action.payload;
    });
    builder.addCase(doGetMeetingMinutes.rejected, (state, action) => {
      state.getMeetingMinutesSuccess = false;
      state.isGettingMeetingMinutes = true;
      state.gettingMeetingMinutesError = {
        error: "Error occured"
      }
    });
    
    //doGetMeetingMinute
    builder.addCase(doGetMeetingMinute.pending, (state) => {
      state.isGettingMinuteById = true;
      state.getMinuteByIdError = {};
      state.minuteById = {};
    });
    builder.addCase(doGetMeetingMinute.fulfilled, (state, action) => {
      state.isGettingMinuteById = false;
      state.minuteById = action.payload;
    });
    builder.addCase(doGetMeetingMinute.rejected, (state, action) => {
      state.isGettingMinuteById = true;
      state.getMinuteByIdError = {
        error: "Error occured"
      }
    });

    //doCreateNewMinute
    builder.addCase(doCreateNewMinute.pending, (state) => {
      state.isCreatingNewMeetingMinute = true;
      state.createNewMeetingMinuteError = {};
      state.createNewMeetingMinuteSuccess = false;
    });
    builder.addCase(doCreateNewMinute.fulfilled, (state, action) => {
      state.isCreatingNewMeetingMinute = false;
      state.createNewMeetingMinuteSuccess = true;
    });
    builder.addCase(doCreateNewMinute.rejected, (state, action) => {
      state.isCreatingNewMeetingMinute = true;
      state.createNewMeetingMinuteSuccess = false;
      state.createNewMeetingMinuteError = {
        error: "Error occured"
      }
    });
    
    //doUpdateMinute
    builder.addCase(doUpdateMinute.pending, (state) => {
      state.isUpdatingMeetingMinute = true;
      state.updateMeetingMinuteError = {};
      state.updateMeetingMinuteSuccess = false;
    });
    builder.addCase(doUpdateMinute.fulfilled, (state, action) => {
      state.isUpdatingMeetingMinute = false;
      state.updateMeetingMinuteSuccess = true;
    });
    builder.addCase(doUpdateMinute.rejected, (state, action) => {
      state.isUpdatingMeetingMinute = true;
      state.updateMeetingMinuteSuccess = false;
      state.updateMeetingMinuteError = {
        error: "Error occured"
      }
    });

    //doDeleteMinute
    builder.addCase(doDeleteMinute.pending, (state) => {
      state.isDeletingMeetingMinute = true;
      state.deleteMeetingMinuteError = {};
      state.deleteMeetingMinuteSuccess = false;
    });
    builder.addCase(doDeleteMinute.fulfilled, (state, action) => {
      state.isDeletingMeetingMinute = false;
      state.deleteMeetingMinuteSuccess = true;
    });
    builder.addCase(doDeleteMinute.rejected, (state, action) => {
      state.isDeletingMeetingMinute = true;
      state.deleteMeetingMinuteSuccess = false;
      state.deleteMeetingMinuteError = {
        error: "Error occured"
      }
    });
  },
});

const { reducer, actions } = slice;
export const { resetMeetingCreationStatus, temporarilySavedUserToAdd, updateMeetingPublic,
  resetMeetingImageStatus, resetMeetingMinuteStatus } = actions;
export default reducer;
