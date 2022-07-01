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

  isUpdateMeetingParticipantsProfile?: boolean;
  updateMeetingParticipantsProfileError?: any;
}