interface IAPILogin {
  username?: string;
  password?: string;
}

interface IAPIGet {
  param1?: string;
  param2?: string;
  file?: any;
}

interface IAPIPostNewUser {
  firebase_id?: string;
  email?: string;
  password?: string;
  image?: string;
  name?: string;
}

interface IAPIUserByFirebaseID {
  firebase_id?: string;
}

interface IAPISearchUserByQuery {
  query?: string;
}

interface IAPIPostNewMeeting {
  title?: string;
  description?: string;
  creator?: string;
  date?: Array<Date>;
  isBonding?: boolean;
  dateBlocks?: any;
  poll?: Array<any>;
  pollLetUserAdd?: boolean;
  pollIsLimitChoice?: boolean;
  pollChoicesLimit?: number;
  isPublic?: boolean;
  meetingID?: string;
  invitators?: Array<ICreateUserResponse>;
}

interface IAPIGetMeetings {
  firebase_id?: string;
}