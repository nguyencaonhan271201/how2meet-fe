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

interface IMeetingSlice {
  
}