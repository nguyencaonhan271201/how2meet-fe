import moment from 'moment';

export const getCurrentDateFullString = () => {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
};
