import axios, { AxiosError, AxiosResponse } from 'axios';

const baseURL = process.env.REACT_APP_API_ENDPOINT;

const axiosTest = axios.create({
  baseURL: baseURL + 'api/',
  headers: {
    'content-type': 'application/json',
  },
});

axiosTest.interceptors.response.use(
  (res: AxiosResponse<{ content: any; message: string; result: number }>) => {
    return res;
  },
  (err: AxiosError) => {
    if (err.response?.status === 401) {
    }
    throw err;
  }
);
export default axiosTest;
