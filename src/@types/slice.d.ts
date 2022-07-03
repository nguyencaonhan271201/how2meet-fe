interface IAPITestSlice {
  param1?: boolean;
}

interface IAppTestSlice {
  param2?: boolean;
}

interface ILoginSlice {
  isCreatingNewUser?: boolean;
  createNewUserError?: any;
  createNewUserSuccess?: boolean;

  isGettingUserInfo?: boolean,
  gettingUserInfoSuccess?: boolean,
  user?: ICreateUserResponse;

  isUpdateProfile?: boolean;
  updateProfileSuccess?: boolean;
}

interface ISearchUserSlice {
  searchResults?: Array<ICreateUserResponse>;
  isSearchingUser?: boolean;
  searchUserError?: any;
}

interface IMeetingSlice {
  isCreatingNewMeeting?: boolean;
  createNewMeetingSuccess?: boolean;
  createNewMeetingError?: any;
  
  meetings?: Array<ICreateMeetingResponse>;
  gettingMeetingsError?: any;
  isGettingMeetings?: boolean;

  meetingByID?: ICreateMeetingResponse;
  isGettingMeetingByID?: boolean;
  gettingMeetingByIDError?: any;

  isUpdateMeetingParticipantsProfile?: boolean;
  updateMeetingParticipantsProfileError?: any;

  isAddInvitatorToMeeting?: boolean;
  addInvitatorToMeetingError?: any;
  temporarilySavedUserToAdd?: ICreateUserResponse;

  isUpdateMeeting?: boolean;
  updateMeetingSuccess?: boolean;
  updateMeetingError?: any;
}