import moment from 'moment';

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
    diff = d.getDate() - day + (day == 0? 0 : 7);
  return new Date(d.setDate(diff));
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
  return moment(date).week();
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