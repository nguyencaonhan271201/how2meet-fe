interface IUser {
  firebase_id?: string;
  email?: string;
  password?: string;
  image?: string;
  name?: string;
}

interface ICreateUserResponse {
  firebase_id?: string;
  email?: string;
  password?: string;
  image?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number
  _id?: string;
}