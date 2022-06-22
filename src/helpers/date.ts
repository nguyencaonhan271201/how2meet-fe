import moment from 'moment';

export const getCurrentDateFullString = () => {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
};

export const getMonthNameFromIndex = (i: number) => {
  let array = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];
  return array[i];
}

export const getNumberOfDaysInMonthAndYear = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
}

export const getMonday = (d: Date) => {
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export const getSunday = (d: Date) => {
  var day = d.getDay(),
    diff = d.getDate() - day + 7;
  return new Date(d.setDate(diff));
}

export const isBetween = (fromDate: Date, toDate: Date, d: Date) => {
  let fromClone = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  let toClone = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  let cloneDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return fromClone <= cloneDay && cloneDay <= toClone;
}
