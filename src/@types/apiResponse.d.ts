interface IUser {
  firebase_id?: string;
  email?: string;
  password?: string;
  image?: string;
  name?: string;
}

interface ICreateResponse {
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  _id?: string;
}

interface ICreateUserResponse extends ICreateResponse {
  firebase_id?: string;
  email?: string;
  password?: string;
  image?: string;
  name?: string;
}

interface ICreateMeetingResponse extends ICreateResponse {
  title?: string;
  description?: string;
  creator?: ICreateUserResponse;
  location?: string;
  password?: string;
  date?: Array<string>;
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

interface ICreateMeetingImagesResponse extends ICreateResponse {
  imageURL?: string;
  meetingID?: string;
  creator?: ICreateUserResponse
}

interface ICreateMeetingMinutesResponse extends ICreateResponse {
  content?: string;
  title?: string;
  description?: string;
  meetingID?: string;
  creator?: ICreateUserResponse
}
