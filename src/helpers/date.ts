import moment from 'moment';

export const getCurrentDateTimeFullString = (date: Date) => {
  return moment(date).format('DD/MM/YYYY hh:mm');
};

export const getCurrentDateFullString = (date: Date) => {
  return moment(date).format('DD/MM/YYYY');
};

export const getCurrentDateShortString = (date: Date) => {
  return moment(date).format('DD/MM');
};

export const getMonthNameFromIndex = (i: number) => {
  let array = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];
  return array[i];
}

export const getShortMonthNameFromIndex = (i: number) => {
  let array = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec"];
  return array[i];
}

export const getNumberOfDaysInMonthAndYear = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
}

export const getMonday = (d: Date) => {
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
  
  let dateToReturn = new Date(d.setDate(diff));
  dateToReturn.setHours(0);
  dateToReturn.setMinutes(0);
  dateToReturn.setSeconds(0);

  return dateToReturn;
}

export const getSunday = (d: Date) => {
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0? 0 : 7);

  let dateToReturn = new Date(d.setDate(diff));
  dateToReturn.setHours(23);
  dateToReturn.setMinutes(59);
  dateToReturn.setSeconds(59);
  return dateToReturn;
}

export const isBetween = (fromDate: Date, toDate: Date, d: Date) => {
  let fromClone = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  let toClone = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  let cloneDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return fromClone <= cloneDay && cloneDay <= toClone;
}

export const getTimeText = (index: number) => {
  let minutes = ["00", "30"];
  let hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  return `${hours[Math.floor(index / 2)]}:${minutes[index % 2]} - 
  ${index % 2 === 0 ? hours[Math.floor(index / 2)] : hours[Math.floor(index / 2)] + 1}:${index % 2 === 0? "30" : "00"}`
}

export const getWeekNumber = (date: Date) => {
  return moment(date).isoWeek();
}

export const isMeetingAvailableForEdit = (start: string) => {
  let startDate = new Date(start);
  if (startDate) {
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
  }
  return startDate > new Date(Date.now());
}

export const isLastMonth = (current: Date, last: Date) => {
  if (current.getMonth() === 1) {
    return last.getMonth() === 12 && last.getFullYear() === current.getFullYear() - 1;
  }
  return last.getMonth() === current.getMonth() - 1 && last.getFullYear() === current.getFullYear();
}

export const isThisMonth = (current: Date, last: Date) => {
  return last.getMonth() === current.getMonth() && last.getFullYear() === current.getFullYear();
}

export const isThisYear = (current: Date, last: Date) => {
  return last.getFullYear() === current.getFullYear();
}

export const isLastYear = (current: Date, last: Date) => {
  return last.getFullYear() === current.getFullYear() - 1;
}

export const dateDifference = (date1: Date, date2: Date) => {
  return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24) + 1;
}

export const getFirstDateOfMonth = (date: Date) => {
  let returnDate = new Date();
  returnDate.setFullYear(date.getFullYear());
  returnDate.setMonth(date.getMonth());
  returnDate.setDate(1);
  returnDate.setHours(0);
  returnDate.setMinutes(0);
  returnDate.setSeconds(0);
  return returnDate;
}

export const getLastDateOfMonth = (date: Date) => {
  let returnDate = new Date();
  returnDate.setFullYear(date.getFullYear());
  returnDate.setMonth(date.getMonth());
  returnDate.setDate(
    date.getMonth() === 2? (moment([date.getFullYear()]).isLeapYear()? 29 : 28)
    : (date.getMonth() === 1 || date.getMonth() === 3 || date.getMonth() === 5 || date.getMonth() === 7
    || date.getMonth() === 8 || date.getMonth() === 10 || date.getMonth() === 12? 31 : 30)
  );
  returnDate.setHours(23);
  returnDate.setMinutes(59);
  returnDate.setSeconds(59);
  return returnDate;
}

export const inTheSameWeek = (date: Date, date2: Date) => {
  let monday = getMonday(date);
  let sunday = getSunday(date);

  return date >= monday && date <= sunday && date2 >= monday && date2 <= sunday;
}