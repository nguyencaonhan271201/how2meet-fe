import { objectToQuery, objectToFormData } from '../../../helpers/formatAPIParam';
import axiosTest from '../../axiosTest';

export const apiLogin = {
  postNewUser: (user: IAPIPostNewUser) => {
    const url = '/users';
    return axiosTest.post(url, user);
  },

  getUserByFirebaseID: (firebase_id: IAPIUserByFirebaseID) => {
    const url = '/users/findByFirebaseID';
    return axiosTest.get(url + "/" + firebase_id.firebase_id);
  },

  updateProfile: (user: IAPIPostNewUser) => {
    const url = '/users/updateProfile';
    return axiosTest.post(url, user);
  },

  searchUserByQuery: (param: IAPISearchUserByQuery) => {
    const url = 'users/findUsersByQuery';
    return axiosTest.get(url + "/" + param.query);
  }
};
