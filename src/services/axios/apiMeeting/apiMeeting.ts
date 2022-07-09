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
  },

  getMeetingByID: (param: IAPIGetMeetingByID) => {
    const url = '/meeting/findByMeetingID';
    return axiosTest.get(url + "/" + param.meetingID);
  },

  updateMeetingParticipantsProfile: (param: IAPIPostNewUser) => {
    const url = '/meeting/updateMeetingParticipantsProfile';
    return axiosTest.post(url, param);
  },

  addInvitatorToMeeting: (param: IAPIAddInvitatorToMeeting) => {
    const url = `/meeting/addInvitatorToMeeting/${param.meetingID}`;
    return axiosTest.post(url, param.invitator);
  },

  updateMeeting: (param: IAPIUpdateMeeting) => {
    const url = `/meeting/updateMeeting/${param.meetingID}`;
    return axiosTest.post(url, param.meetingInfo);
  },

  getMeetingImages: (param: IAPIGetMeetingImages) => {
    const url = `/meetingimages/${param.meetingID}`;
    return axiosTest.get(url);
  },

  createMeetingImage: (param: IAPICreateMeetingImage) => {
    const url = `/meetingimages`;
    return axiosTest.post(url, param);
  },

  deleteMeetingImage: (param: IAPIDeleteMeetingImage) => {
    const url = `/meetingimages/${param.image_id}`;
    return axiosTest.delete(url);
  },

  getMeetingMinutes: (param: IAPIGetMeetingImages) => {
    const url = `/meetingminutes/${param.meetingID}`;
    return axiosTest.get(url);
  },

  getMeetingMinute: (param: IAPIGetMeetingMinute) => {
    const url = `/meetingminutes/getSingle/${param.minuteID}`;
    return axiosTest.get(url);
  },

  createMeetingMinute: (param: IAPICreateMeetingMinute) => {
    const url = `/meetingminutes`;
    return axiosTest.post(url, param);
  },

  updateMeetingMinute: (param: IAPIUpdateMeetingMinute) => {
    const url = `/meetingminutes/${param.minuteID}`;
    return axiosTest.post(url, param.updateContent);
  },

  deleteMeetingMinute: (param: IAPIDeleteMeetingMinute) => {
    const url = `/meetingminutes/${param.minute_id}`;
    return axiosTest.delete(url);
  },
};
