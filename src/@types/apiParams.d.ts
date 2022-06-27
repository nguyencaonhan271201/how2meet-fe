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