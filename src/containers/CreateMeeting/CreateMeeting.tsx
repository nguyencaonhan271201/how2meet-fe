import './CreateMeeting.scss';
import React, { useEffect, useState } from 'react';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonday, getMonthNameFromIndex, getNumberOfDaysInMonthAndYear, getSunday, isBetween } from '../../helpers/date';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const CreateMeeting: React.FC<ICreateMeeting> = ({ }) => {
  document.title = "How2Meet? | New Meeting";

  const [currentPage, setCurrentPage] = useState<number>(0);
  const MySwal = withReactContent(Swal);

  //Page 0
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  //Page 1
  const [inputBlocks, setInputBlocks] = useState<Array<any>>([]);
  const [isBonding, setIsBonding] = useState<boolean>(false);
  const [renderCalendar, setRenderCalendar] = useState<number>(0);

  //Page 2
  const [showingWeek, setShowingWeek] = useState<number>(0);

  const getWeekNumber = (date: Date) => {
    var oneJan = new Date(date.getFullYear(), 0, 1) as Date;
    var numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
    return result;
  }

  const generateCalendar = () => {
    let startWeek = getWeekNumber(fromDate);
    let endWeek = getWeekNumber(toDate);

    let inputBlocks = [];
    let modifiedEndWeek = endWeek >= startWeek ? endWeek : getWeekNumber(new Date(fromDate.getFullYear(), 11, 31)) - startWeek + 1 + endWeek;

    let currentCheckingDate = new Date(fromDate.getTime());
    for (let i = startWeek; i <= modifiedEndWeek; i++) {
      let thisWeek = [];

      if (i !== startWeek) {
        currentCheckingDate.setTime(currentCheckingDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      }

      let monday = getMonday(new Date(currentCheckingDate.getTime()));
      let sunday = getSunday(new Date(currentCheckingDate.getTime()));

      let start = new Date(monday);

      while (start <= sunday) {
        thisWeek.push({
          date: new Date(start.getTime()),
          isSelectable: isBetween(new Date(fromDate.getTime()), new Date(toDate.getTime()), start),
          status: 1
        })

        start.setTime(start.getTime() + (24 * 60 * 60 * 1000));
      }

      let isNewMonth = thisWeek[0].date.getMonth() !== thisWeek[6].date.getMonth() || thisWeek[0].date.getDate() === 1;

      inputBlocks.push({
        isNewMonth: isNewMonth,
        blocks: thisWeek
      });

      setInputBlocks(inputBlocks);
    }
  }

  const updateStatus = (week: number, weekDay: number) => {
    let inputBlocksClone = inputBlocks;
    inputBlocksClone[week]["blocks"][weekDay].status = inputBlocksClone[week]["blocks"][weekDay].status === 0 ? 1 : 0;

    setInputBlocks(inputBlocksClone);
    setRenderCalendar(renderCalendar + 1);
  }

  useEffect(() => {
    console.log(inputBlocks);
  }, [inputBlocks]);

  const nextPage = () => {
    if (currentPage === 0) {
      if (meetingTitle === "") {
        MySwal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'Please input title for meeting!',
        })
        return;
      }
    }

    setCurrentPage(currentPage + 1);
  }

  useEffect(() => {
    generateCalendar();
  }, [fromDate, toDate]);

  return (
    <div className="create-meeting">
      {currentPage === 0 && <div className="create-meeting__general-info">
        <span>
          <h1 className="create-meeting__title">EVENT

          </h1>
          <span
            className="create-meeting__name"
            style={{
              position: "relative",
            }}>
            {meetingTitle !== "" ? meetingTitle : "...."}

            <input
              value={meetingTitle}
              style={{
                opacity: 0,
                position: "absolute",
                left: "0",
                right: "0"
              }}
              onChange={(e) => {
                setMeetingTitle(e.target.value)
              }}>
            </input>
          </span>
        </span>

        <p className="create-meeting__hosted-title">
          host by ncnhan
        </p>

        <textarea
          className="create-meeting__description"
          placeholder="desc..."
          rows={2}
          onChange={(e: any) => setDescription(e.target.value)}>
          {description}
        </textarea>

        <div className="create-meeting__dates">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={fromDate}
            onChange={(date: any) => setFromDate(date)}
          />

          <span className="create-meeting__to">to</span>

          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={toDate}
            onChange={(date: any) => setToDate(date)}
            minDate={fromDate}
          />
        </div>

      </div>}

      {currentPage === 1 && <div className="create-meeting__date-pick">
        <h1 className="create-meeting__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
        </h1>

        <p className="create-meeting__hosted-title">
          <label className="switch" style={{ marginRight: "5px" }}>
            <input type="checkbox"></input>
            <span className="slider round" onClick={() => setIsBonding(!isBonding)}></span>
          </label>
          {` `}
          {isBonding ? <span
            style={{ color: "var(--theme-green)", marginRight: "4px" }}
          >bonding</span> : "meeting "}

          host by ncnhan
        </p>

        <div className="create-meeting__calendar">
          {inputBlocks.map((week: any, index: number) => {
            return (
              <>
                {(index === 0 || week.isNewMonth) &&
                  <p className="create-meeting__calendar__month-name">
                    {getMonthNameFromIndex(week.blocks[6].date.getMonth())}
                  </p>}

                <div className="create-meeting__calendar__week">
                  {week.blocks.map((block: any, indexInWeek: number) => {
                    return (
                      <div
                        className={`create-meeting__calendar__week-day
                        ${!block.isSelectable ? "create-meeting__calendar__week-day--disabled" : ""}
                        ${block.isSelectable && block.status === 0 ? "create-meeting__calendar__week-day--busy" : ""}`}
                        onClick={() => {
                          if (block.isSelectable) {
                            updateStatus(index, indexInWeek)
                          }
                        }}
                      >
                        <h4>{block.date.getDate()}</h4>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })}
        </div>
      </div>}

      {
        currentPage === 2 && <div className="create-meeting__time-pick">
          <h1 className="create-meeting__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
          </h1>

          <div className="create-meeting__time__week-time">
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => {
                if (showingWeek > 0)
                  setShowingWeek(showingWeek - 1);
              }}
              style={{
                opacity: showingWeek === 0 ? "0" : "1",
                cursor: "pointer"
              }}
            ></FontAwesomeIcon>

            <div className="create-meeting__time__week-main">
              <>
                {
                  <p className="create-meeting__time__month-name">
                    {getMonthNameFromIndex(inputBlocks[showingWeek].blocks[6].date.getMonth())}
                  </p>
                }

                <div className="create-meeting__time__week">
                  <div className="create-meeting__left-ruler">
                    {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(number => {
                      return <p style={{ marginBottom: "0" }}>{number}:00</p>
                    })}
                  </div>

                  {inputBlocks[showingWeek].blocks.map((block: any, indexInWeek: number) => {
                    return (
                      <div className="create-meeting__week-day-time">
                        <div
                          className={`create-meeting__time__week-day
                        ${!block.isSelectable ? "create-meeting__time__week-day--disabled" : ""}
                        ${block.isSelectable && block.status === 0 ? "create-meeting__time__week-day--busy" : ""}`}
                        >
                          <h4>{block.date.getDate()}</h4>
                        </div>
                        <div className={`create-meeting__time__time-range
                        ${!block.isSelectable ? "create-meeting__time__time-range--disabled" : ""}
                        ${block.isSelectable && block.status === 0 ? "create-meeting__time__time-range--disabled" : ""}
                        `}>

                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            </div>

            <FontAwesomeIcon
              icon={faArrowRight}
              onClick={() => {
                if (showingWeek < inputBlocks.length - 1)
                  setShowingWeek(showingWeek + 1);
              }}
              style={{
                opacity: showingWeek === inputBlocks.length - 1 ? "0" : "1",
                cursor: "pointer"
              }}
            ></FontAwesomeIcon>
          </div>
        </div>
      }

      <div className="create-meeting__controls">
        {/* {currentPage > 0 && <button className="create-meeting__prev" onClick={() => {
          setCurrentPage(currentPage - 1);
        }}>
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>} */}

        <button className="create-meeting__next" onClick={() => {
          nextPage();
        }}>
          <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
        </button>
      </div>
    </div >
  );
};