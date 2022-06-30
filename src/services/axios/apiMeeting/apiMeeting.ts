import { objectToQuery, objectToFormData } from '../../../helpers/formatAPIParam';
import axiosTest from '../../axiosTest';

export const apiMeeting = {
  postNewMeeting: (user: IAPIPostNewMeeting) => {
    const url = '/meeting';
    return axiosTest.post(url, user);
  },

  getMeetings: (param: IAPIGetMeetings) => {
    const url = '/meeting/findByFirebaseID';
    return axiosTest.get(url + "/" + param.firebase_id);
  }
};
