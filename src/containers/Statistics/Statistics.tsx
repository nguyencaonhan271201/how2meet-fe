import './Statistics.scss';
import { Box, Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { doGetMeetings, doGetUserByFirebaseID, RootState, useAppDispatch } from '../../redux';
import { useHistory, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
  dateDifference,
  getCurrentDateFullString,
  getCurrentDateShortString,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getMonday,
  getShortMonthNameFromIndex,
  getSunday,
  getWeekNumber,
  inTheSameWeek,
  isLastMonth,
  isLastYear,
  isThisMonth,
  isThisYear
} from '../../helpers/date';
import { CardWithoutChange } from './CardWithoutChange';
import { CardWithChange } from './CardWithChange';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';

interface IBarListElement {
  meeting: number;
  bonding: number;
  label: string;
}

interface IPieListByType {
  ratio: number;
  count: number;
  label: string;
}

export const Statistics: React.FC = () => {
  document.title = "How2Meet? | Statistics";

  //States
  const [currentOption, setCurrentOption] = useState<number>(0);
  const [totalMeetings, setTotalMeetings] = useState<number>(0);

  const [totalThisPeriod, setTotalThisPeriod] = useState<number>(0);
  const [increasedThisPeriod, setIncreasedThisPeriod] = useState<number>(0);

  const [averageMeetingLength, setAverageMeetingLength] = useState<number>(0);
  const [increasedAverageMeetingLength, setIncreasedAverageMeetingLength] = useState<number>(0);

  const [averageNumberOfParticipants, setAverageNumberOfParticipants] = useState<number>(0);
  const [increasedAverageNumberOfParticipants, setIncreasedAverageNumberOfParticipants] = useState<number>(0);

  const [listByElement, setListByElement] = useState<Array<IBarListElement>>([]);
  const [listByType, setListByType] = useState<Array<IPieListByType>>([]);

  const [renderChart, setRenderChart] = useState<number>(0);

  //Retrieve the list of meetings
  const history = useHistory();
  const dispatch = useAppDispatch();
  const location = useLocation() as any;
  const MySwal = withReactContent(Swal);

  const { user } = useSelector(
    (state: RootState) => state.loginSlice,
  );

  const { meetings } = useSelector(
    (state: RootState) => state.meetingSlice,
  );

  //Hooks
  useEffect(() => {
    if (localStorage.getItem('firebase_id'))
      dispatch(doGetUserByFirebaseID({
        firebase_id: localStorage.getItem('firebase_id') || ''
      }))
  }, []);

  useEffect(() => {
    if (user?.firebase_id) {
      dispatch(doGetMeetings({
        firebase_id: user.firebase_id
      }))
    }
  }, [user]);

  useEffect(() => {
    if (meetings.length > 0) {
      let cloneMeetings = [...meetings];
      setCurrentOption(0);
      calculateStatisticsValue(cloneMeetings, 0);
    }
  }, [meetings]);

  useEffect(() => {
    if (meetings.length > 0) {
      let cloneMeetings = [...meetings];
      calculateStatisticsValue(cloneMeetings, currentOption);
      setRenderChart(renderChart + 1);
    }
  }, [currentOption]);

  //Functions
  const calculateStatisticsValue = (cloneMeetings: Array<ICreateMeetingResponse>, option: number) => {
    setTotalMeetings(cloneMeetings.length);
    calculateTotalThisPeriod(cloneMeetings, option);
    calculateAverageMeetingLength(cloneMeetings, option);
    calculateTotalNumberOfParticipants(cloneMeetings, option);
    calculateListByElement(cloneMeetings, option);
    calculateListByType(cloneMeetings, option);
  }

  const calculateTotalThisPeriod = (meetings: Array<ICreateMeetingResponse>, option: number) => {
    let getDates = [];
    meetings.forEach((meeting: any) => {
      let startDate = new Date(meeting.date[0]);
      let endDate = new Date(meeting.date[1]);

      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);

      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      getDates.push({
        start: startDate,
        end: endDate
      });
    })

    let thisPeriodTotal = 0;
    let lastPeriodTotal = 0;
    let today = new Date();

    if (option === 0) {
      let lastTimestamp = new Date(today.getTime() - 24 * 60 * 60 * 1000)

      getDates.forEach((meetingDates: any) => {
        if (lastTimestamp >= meetingDates["start"] && lastTimestamp <= meetingDates["end"]) {
          lastPeriodTotal += 1;
        }
        if (today >= meetingDates["start"] && today <= meetingDates["end"]) {
          thisPeriodTotal += 1;
        }
      })

      setTotalThisPeriod(thisPeriodTotal);
      setIncreasedThisPeriod(Math.round(100 * (thisPeriodTotal - lastPeriodTotal) / lastPeriodTotal));
    } else if (option === 1) {
      let thisWeekNumber = getWeekNumber(today);

      getDates.forEach((meetingDates: any) => {
        if (getWeekNumber(meetingDates["start"]) === thisWeekNumber - 1
          || getWeekNumber(meetingDates["end"]) === thisWeekNumber - 1) {
          lastPeriodTotal += 1;
        }
        if (getWeekNumber(meetingDates["start"]) === thisWeekNumber
          || getWeekNumber(meetingDates["end"]) === thisWeekNumber) {
          thisPeriodTotal += 1;
        }
      })

      setTotalThisPeriod(thisPeriodTotal);
      setIncreasedThisPeriod(Math.round(100 * (thisPeriodTotal - lastPeriodTotal) / lastPeriodTotal));
    } else if (option === 2) {
      getDates.forEach((meetingDates: any) => {
        if (isLastMonth(today, meetingDates["start"]) || isLastMonth(today, meetingDates["end"])) {
          lastPeriodTotal += 1;
        }
        if (isThisMonth(today, meetingDates["start"]) || isThisMonth(today, meetingDates["end"])) {
          thisPeriodTotal += 1;
        }
      })

      setTotalThisPeriod(thisPeriodTotal);
      setIncreasedThisPeriod(Math.round(100 * (thisPeriodTotal - lastPeriodTotal) / lastPeriodTotal));
    } else if (option === 3) {
      getDates.forEach((meetingDates: any) => {
        if (isLastYear(today, meetingDates["start"]) || isLastYear(today, meetingDates["end"])) {
          lastPeriodTotal += 1;
        }
        if (isThisYear(today, meetingDates["start"]) || isThisYear(today, meetingDates["end"])) {
          thisPeriodTotal += 1;
        }
      })

      setTotalThisPeriod(thisPeriodTotal);
      setIncreasedThisPeriod(Math.round(100 * (thisPeriodTotal - lastPeriodTotal) / lastPeriodTotal));
    }
  }

  const calculateAverageMeetingLength = (meetings: Array<ICreateMeetingResponse>, option: number) => {
    let getDates = [];
    meetings.forEach((meeting: any) => {
      let startDate = new Date(meeting.date[0]);
      let endDate = new Date(meeting.date[1]);

      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);

      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      getDates.push({
        start: startDate,
        end: endDate,
      });
    })

    let thisPeriodTotal = 0;
    let thisPeriodSum = 0;
    let lastPeriodTotal = 0;
    let lastPeriodSum = 0;
    let today = new Date();

    if (option === 0) {
      let lastTimestamp = new Date(today.getTime() - 24 * 60 * 60 * 1000)

      getDates.forEach((meetingDates: any) => {
        if (lastTimestamp >= meetingDates["start"] && lastTimestamp <= meetingDates["end"]) {
          lastPeriodTotal += 1;
          lastPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
        if (today >= meetingDates["start"] && today <= meetingDates["end"]) {
          thisPeriodTotal += 1;
          thisPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;
      setAverageMeetingLength(thisAverage);
      setIncreasedAverageMeetingLength(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    } else if (option === 1) {
      let thisWeekNumber = getWeekNumber(today);

      getDates.forEach((meetingDates: any) => {
        if (getWeekNumber(meetingDates["start"]) === thisWeekNumber - 1
          || getWeekNumber(meetingDates["end"]) === thisWeekNumber - 1) {
          lastPeriodTotal += 1;
          lastPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
        if (getWeekNumber(meetingDates["start"]) === thisWeekNumber
          || getWeekNumber(meetingDates["end"]) === thisWeekNumber) {
          thisPeriodTotal += 1;
          thisPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;
      setAverageMeetingLength(thisAverage);
      setIncreasedAverageMeetingLength(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    } else if (option === 2) {
      getDates.forEach((meetingDates: any) => {
        if (isLastMonth(today, meetingDates["start"]) || isLastMonth(today, meetingDates["end"])) {
          lastPeriodTotal += 1;
          lastPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
        if (isThisMonth(today, meetingDates["start"]) || isThisMonth(today, meetingDates["end"])) {
          thisPeriodTotal += 1;
          thisPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;
      setAverageMeetingLength(thisAverage);
      setIncreasedAverageMeetingLength(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    } else if (option === 3) {
      getDates.forEach((meetingDates: any) => {
        if (isLastYear(today, meetingDates["start"]) || isLastYear(today, meetingDates["end"])) {
          lastPeriodTotal += 1;
          lastPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
        if (isThisYear(today, meetingDates["start"]) || isThisYear(today, meetingDates["end"])) {
          thisPeriodTotal += 1;
          thisPeriodSum += dateDifference(meetingDates["end"], meetingDates["start"]);
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;
      setAverageMeetingLength(thisAverage);
      setIncreasedAverageMeetingLength(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    }
  }

  const calculateTotalNumberOfParticipants = (meetings: Array<ICreateMeetingResponse>, option: number) => {
    let getDates = [];

    meetings.forEach((meeting: any) => {
      let startDate = new Date(meeting.date[0]);
      let endDate = new Date(meeting.date[1]);

      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);

      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      getDates.push({
        start: startDate,
        end: endDate,
        numberOfParticipants: meeting.invitators.length
      });
    })


    let thisPeriodTotal = 0;
    let thisPeriodSum = 0;
    let lastPeriodTotal = 0;
    let lastPeriodSum = 0;
    let today = new Date();

    if (option === 0) {
      let lastTimestamp = new Date(today.getTime() - 24 * 60 * 60 * 1000)

      getDates.forEach((meetingDates: any, index: any) => {
        if (lastTimestamp >= meetingDates["start"] && lastTimestamp <= meetingDates["end"]) {
          lastPeriodTotal += 1;
          lastPeriodSum += meetingDates["numberOfParticipants"];
        }
        if (today >= meetingDates["start"] && today <= meetingDates["end"]) {
          thisPeriodTotal += 1;
          thisPeriodSum += meetingDates["numberOfParticipants"];
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;

      setAverageNumberOfParticipants(thisAverage);
      setIncreasedAverageNumberOfParticipants(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    } else if (option === 1) {
      let thisWeekNumber = getWeekNumber(today);

      getDates.forEach((meetingDates: any) => {
        if (getWeekNumber(meetingDates["start"]) === thisWeekNumber - 1
          || getWeekNumber(meetingDates["end"]) === thisWeekNumber - 1) {
          lastPeriodTotal += 1;
          lastPeriodSum += meetingDates["numberOfParticipants"];
        }
        if (getWeekNumber(meetingDates["start"]) === thisWeekNumber
          || getWeekNumber(meetingDates["end"]) === thisWeekNumber) {
          thisPeriodTotal += 1;
          thisPeriodSum += meetingDates["numberOfParticipants"];
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;
      setAverageNumberOfParticipants(thisAverage);
      setIncreasedAverageNumberOfParticipants(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    } else if (option === 2) {
      getDates.forEach((meetingDates: any) => {
        if (isLastMonth(today, meetingDates["start"]) || isLastMonth(today, meetingDates["end"])) {
          lastPeriodTotal += 1;
          lastPeriodSum += meetingDates["numberOfParticipants"];
        }
        if (isThisMonth(today, meetingDates["start"]) || isThisMonth(today, meetingDates["end"])) {
          thisPeriodTotal += 1;
          thisPeriodSum += meetingDates["numberOfParticipants"];
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;
      setAverageNumberOfParticipants(thisAverage);
      setIncreasedAverageNumberOfParticipants(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    } else if (option === 3) {
      getDates.forEach((meetingDates: any) => {
        if (isLastYear(today, meetingDates["start"]) || isLastYear(today, meetingDates["end"])) {
          lastPeriodTotal += 1;
          lastPeriodSum += meetingDates["numberOfParticipants"];
        }
        if (isThisYear(today, meetingDates["start"]) || isThisYear(today, meetingDates["end"])) {
          thisPeriodTotal += 1;
          thisPeriodSum += meetingDates["numberOfParticipants"];
        }
      })

      let thisAverage = thisPeriodTotal > 0 ? Math.round(100 * thisPeriodSum / thisPeriodTotal) / 100 : 0;
      let lastAverage = lastPeriodTotal > 0 ? Math.round(100 * lastPeriodSum / lastPeriodTotal) / 100 : 0;
      setAverageNumberOfParticipants(thisAverage);
      setIncreasedAverageNumberOfParticipants(Math.round(100 * (thisAverage - lastAverage) / lastAverage));
    }
  }

  const calculateListByElement = (meetings: Array<ICreateMeetingResponse>, option: number) => {
    let listByElement = [];
    let today = new Date();
    let getDates = [];


    meetings.forEach((meeting: any) => {
      let startDate = new Date(meeting.date[0]);
      let endDate = new Date(meeting.date[1]);

      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);

      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      getDates.push({
        start: startDate,
        end: endDate
      });
    })


    if (option === 0) {
      let countBonding = 0;
      let countMeeting = 0;

      getDates.forEach((meetingDates: any, index: number) => {
        if (today >= meetingDates["start"] && today <= meetingDates["end"]) {
          if (meetings[index].isBonding)
            countBonding++;
          else
            countMeeting++;
        }
      })

      listByElement.push({
        meeting: countMeeting,
        bonding: countBonding,
        label: getCurrentDateFullString(today)
      })
    } else if (option === 1) {
      let monday = getMonday(today);
      let sunday = getSunday(today);

      if (monday) {
        monday.setHours(0);
        monday.setMinutes(0);
        monday.setSeconds(0);
      }

      if (sunday) {
        sunday.setHours(23);
        sunday.setMinutes(59);
        sunday.setSeconds(59);
      }

      while (monday <= sunday) {
        let countBonding = 0;
        let countMeeting = 0;

        getDates.forEach((meetingDates: any, index: number) => {
          if (monday >= meetingDates["start"] && monday <= meetingDates["end"]) {
            if (meetings[index].isBonding)
              countBonding++;
            else
              countMeeting++;
          }
        })

        listByElement.push({
          meeting: countMeeting,
          bonding: countBonding,
          label: getCurrentDateShortString(monday)
        })

        monday.setTime(monday.getTime() + (24 * 60 * 60 * 1000));
      }
    } else if (option === 2) {
      let firstDay = getFirstDateOfMonth(today);
      let lastDay = getLastDateOfMonth(today);

      let startWeek = getWeekNumber(firstDay);
      let endWeek = getWeekNumber(lastDay);
      let modifiedEndWeek = endWeek >= startWeek ? endWeek : getWeekNumber(new Date(firstDay.getFullYear(), 11, 31)) - startWeek + 1 + endWeek;

      let currentCheckingDate = new Date(firstDay.getTime());

      for (let i = startWeek; i <= modifiedEndWeek; i++) {
        let countMeeting = 0;
        let countBonding = 0;

        if (i !== startWeek) {
          currentCheckingDate.setTime(currentCheckingDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        }

        getDates.forEach((meetingDates: any, index: number) => {
          if (inTheSameWeek(currentCheckingDate, meetingDates["start"])
            || inTheSameWeek(currentCheckingDate, meetingDates["end"])) {
            if (meetings[index].isBonding)
              countBonding++;
            else
              countMeeting++;
          }
        })

        listByElement.push({
          meeting: countMeeting,
          bonding: countBonding,
          label: `${getCurrentDateShortString(getMonday(currentCheckingDate))} - ${getCurrentDateShortString(getSunday(currentCheckingDate))}`
        })
      }
    } else if (option === 3) {
      for (let i = 0; i < 12; i++) {
        let countMeeting = 0;
        let countBonding = 0;

        getDates.forEach((meetingDates: any, index: number) => {
          if (meetingDates["start"].getFullYear() === today.getFullYear()) {
            if (meetingDates["start"].getMonth() === i) {
              if (meetings[index].isBonding)
                countBonding++;
              else
                countMeeting++;
            }
          } else if (meetingDates["end"].getFullYear() === today.getFullYear()) {
            if (meetingDates["end"].getMonth() === i) {
              if (meetings[index].isBonding)
                countBonding++;
              else
                countMeeting++;
            }
          }
        })

        listByElement.push({
          meeting: countMeeting,
          bonding: countBonding,
          label: `${getShortMonthNameFromIndex(i)} ${today.getFullYear()}`
        })
      }
    }

    setListByElement(listByElement)
  }

  const calculateListByType = (meetings: Array<ICreateMeetingResponse>, option: number) => {
    let getDates = [];
    let listByType = [] as Array<IPieListByType>;
    let countMeeting = 0;
    let countBonding = 0;
    let today = new Date();

    meetings.forEach((meeting: any) => {
      let startDate = new Date(meeting.date[0]);
      let endDate = new Date(meeting.date[1]);

      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);

      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      getDates.push({
        start: startDate,
        end: endDate
      });
    })

    if (option === 0) {
      getDates.forEach((meetingDates: any, index: number) => {
        if (today >= meetingDates["start"] && today <= meetingDates["end"]) {
          if (meetings[index].isBonding)
            countBonding++;
          else
            countMeeting++;
        }
      })
    } else if (option === 1) {
      let thisWeekNumber = getWeekNumber(today);

      getDates.forEach((meetingDates: any, index: number) => {
        if (getWeekNumber(meetingDates["start"]) === thisWeekNumber
          || getWeekNumber(meetingDates["end"]) === thisWeekNumber) {
          if (meetings[index].isBonding)
            countBonding++;
          else
            countMeeting++;
        }
      })
    } else if (option === 2) {
      getDates.forEach((meetingDates: any, index: number) => {
        if (isThisMonth(today, meetingDates["start"]) || isThisMonth(today, meetingDates["end"])) {
          if (meetings[index].isBonding)
            countBonding++;
          else
            countMeeting++;
        }
      })
    } else if (option === 3) {
      getDates.forEach((meetingDates: any, index: number) => {
        if (isThisYear(today, meetingDates["start"]) || isThisYear(today, meetingDates["end"])) {
          if (meetings[index].isBonding)
            countBonding++;
          else
            countMeeting++;
        }
      })
    }

    if (countBonding + countMeeting === 0) {
      listByType.push({
        ratio: 0,
        count: 0,
        label: "Bonding"
      })
      listByType.push({
        ratio: 0,
        count: 0,
        label: "Meeting"
      })
    } else {
      listByType.push({
        ratio: Math.round(100 * (countBonding / (countBonding + countMeeting))),
        count: countBonding,
        label: "Bonding"
      })
      listByType.push({
        ratio: Math.round(100 * (countMeeting / (countBonding + countMeeting))),
        count: countMeeting,
        label: "Meeting"
      })
    }

    setListByType(listByType);
  }

  return (
    <div className="statistics">
      <div className="statistics__container">
        <div className="statistics__options">
          {["Day", "Week", "Month", "Year"].map((choice: string, index: number) =>
            <div
              className={`statistics__option ${index === currentOption ? "statistics__option--selected" : ""} `}
              onClick={() => setCurrentOption(index)}>{choice}</div>)}
        </div>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth={false}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
                <CardWithoutChange sx={{ height: '100%' }} totalMeeting={totalMeetings} />
              </Grid>
              <Grid
                item
                xl={3}
                lg={3}
                sm={6}
                xs={12}
              >
                <CardWithChange
                  label={`Total Meetings (this ${["Day", "Week", "Month", "Year"][currentOption]})`}
                  displayNumber={`${totalThisPeriod} ${totalThisPeriod === 1 ? "meeting" : "meetings"}`}
                  change={isFinite(increasedThisPeriod) ? increasedThisPeriod : 100}
                  unit={`${["Day", "Week", "Month", "Year"][currentOption]}`}
                  iconColor={"teal"}
                />
              </Grid>
              <Grid
                item
                xl={3}
                lg={3}
                sm={6}
                xs={12}
              >
                <CardWithChange
                  label={`Avg ${currentOption !== 2 ? "meeting" : ""} length (this ${["Day", "Week", "Month", "Year"][currentOption]})`}
                  displayNumber={`${averageMeetingLength} ${averageMeetingLength === 1 ? "day" : "days"}`}
                  change={isFinite(increasedAverageMeetingLength) ? increasedAverageMeetingLength : 100}
                  unit={`${["Day", "Week", "Month", "Year"][currentOption]}`}
                  iconColor={"#ff8f00"}
                />
              </Grid>
              <Grid
                item
                xl={3}
                lg={3}
                sm={6}
                xs={12}
              >
                <CardWithChange
                  label={`Avg # of people (this ${["Day", "Week", "Month", "Year"][currentOption]})`}
                  displayNumber={`${averageNumberOfParticipants} ${averageNumberOfParticipants === 1 ? "person" : "people"}`}
                  change={isFinite(increasedAverageNumberOfParticipants) ? increasedAverageNumberOfParticipants : 100}
                  unit={`${["Day", "Week", "Month", "Year"][currentOption]}`}
                  iconColor={"#b71c1c"}
                />
              </Grid>
              <Grid
                item
                lg={8}
                md={12}
                xl={9}
                xs={12}
              >
                {listByElement.length > 0 && <LineChart
                  data={listByElement}
                  displayTimeRange={currentOption === 0 ? listByElement[0]?.label :
                    currentOption !== 2 ? `${listByElement[0]?.label} - ${listByElement[listByElement?.length - 1].label}`
                      : `${listByElement[0]?.label.substring(0, 5)} - ${listByElement[listByElement?.length - 1].label.substring(8, 13)}`}
                  render={renderChart} />}
              </Grid>
              <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
              >
                {listByType.length > 0 && <PieChart
                  data={listByType}
                  render={renderChart} />}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    </div>
  );
}