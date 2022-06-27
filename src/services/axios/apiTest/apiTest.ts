import { objectToQuery, objectToFormData } from '../../../helpers/formatAPIParam';
import axiosTest from '../../axiosTest';

export const apiTest = {
  demoPost: (dataUser: IAPILogin) => {
    const url = 'Test/Test';
    return axiosTest.post(url, dataUser);
  },

  demoGetQuery: (param: IAPIGet) => {
    const url = 'Test/Test';
    return axiosTest.get(url + objectToQuery(param));
  },

  demoGetFormData: (param: IAPIGet) => {
    const url = 'Test/Test';
    return axiosTest.get(url + objectToFormData(param));
  },
};
