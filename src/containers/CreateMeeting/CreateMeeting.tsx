import './CreateMeeting.scss';
import React, { useEffect, useState, useRef } from 'react';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonday, getMonthNameFromIndex, getNumberOfDaysInMonthAndYear, getSunday, getTimeText, getWeekNumber, isBetween } from '../../helpers/date';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactTooltip from 'react-tooltip';

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
  const isDragging = useRef<boolean>(false);
  const isSelecting = useRef<boolean>(false);
  const startPosition = useRef<number>(-1);
  const [showingSelectors, setShowingSelectors] = useState<Array<any>>([]);
  const mouseEnterNew = useRef<boolean>(false);

  //Hooks
  useEffect(() => {
    console.log(inputBlocks);
  }, [inputBlocks]);

  useEffect(() => {
    generateCalendar();
  }, [fromDate, toDate]);

  //Functions
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
          status: 1,
          timeSlots: new Array(32).fill({
            status: 0,
            selectors: []
          }),
        })

        //FOR TESTING ONLY
        if (start.getDate() === 25 && start.getMonth() === 5) {
          for (let i = 20; i < 28; i++) {
            thisWeek[thisWeek.length - 1].timeSlots[i] = {
              status: 0,
              selectors: [
                {
                  name: "Nhan Nguyen Cao",
                  profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
                },
                {
                  name: "Nhan Nguyen Cao",
                  profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
                },
              ]
            }
          }
        }

        start.setTime(start.getTime() + (24 * 60 * 60 * 1000));
      }

      let isNewMonth = thisWeek[0].date.getMonth() !== thisWeek[6].date.getMonth() || thisWeek[0].date.getDate() === 1;

      inputBlocks.push({
        isNewMonth: isNewMonth,
        blocks: thisWeek,
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

  const onMouseDown = (e: any, indexInWeek: number) => {
    isDragging.current = true;
    startPosition.current = parseInt(e.target.getAttribute("data-time-slot"));
    let currentIndex = parseInt(e.target.getAttribute("data-time-slot"));

    //If the first selected box is empty slot => The current action is selecting the slots
    isSelecting.current = inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].status === 0;

    let inputBlocksClone = inputBlocks;
    if (isSelecting.current && inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].status !== 2) {
      inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[currentIndex] = {
        status: 2,
        selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].selectors
      }
    } else if (!isSelecting.current && inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].status !== 0) {
      inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[currentIndex] = {
        status: 0,
        selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].selectors
      }
    }

    setInputBlocks(inputBlocksClone);
    setRenderCalendar(renderCalendar + 1);
  }

  const onMouseUp = (e: any, indexInWeek: number) => {
    isDragging.current = false;
    isSelecting.current = false;
    startPosition.current = -1;

    let inputBlocksClone = inputBlocks;
    let changed = false;
    inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots.forEach((slot: any, index: number) => {
      if (slot.status === 2) {
        inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[index] = {
          status: 1,
          selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[index].selectors
        }
        changed = true;
      }
    })

    if (changed) {
      setInputBlocks(inputBlocksClone);
      setRenderCalendar(renderCalendar + 1);
    }
  }

  const onMouseEnter = (e: any, indexInWeek: number) => {
    mouseEnterNew.current = true;
    let index = parseInt(e.target.getAttribute("data-time-slot"));

    //Check if selected by me
    if (inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[index].status === 1) {
      setShowingSelectors([...inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[index].selectors,
      {
        name: "Nguyen Cao Nhan",
        profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F3.jpg?alt=media&token=550fd4ec-7aa7-4481-9b1d-f83c1cf1c053"
      }])
    } else {
      setShowingSelectors(inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[index].selectors);
    }
  }

  const onMouseOut = (e: any, indexInWeek: number) => {
    mouseEnterNew.current = false;
    setTimeout(() => {
      if (!mouseEnterNew.current) {
        setShowingSelectors([]);
        mouseEnterNew.current = false;
      }
    }, 500);
  }

  const onMouseMove = (e: any, indexInWeek: number) => {
    if (isDragging.current) {
      let currentPosition = parseInt(e.target.getAttribute("data-time-slot"));
      if (currentPosition) {
        let inputBlocksClone = inputBlocks;
        let changed = false;

        if (currentPosition >= startPosition.current) {
          for (let i = startPosition.current; i <= currentPosition; i++) {
            if (isSelecting.current && inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i].status !== 2) {
              inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i] = {
                status: 2,
                selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[i].selectors
              }
              changed = true;
            } else if (!isSelecting.current && inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i].status !== 0) {
              inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i] = {
                status: 0,
                selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[i].selectors
              }
              changed = true;
            }
          }
        } else {
          for (let i = currentPosition; i <= startPosition.current; i++) {
            if (isSelecting.current && inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i].status !== 2) {
              inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i] = {
                status: 2,
                selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[i].selectors
              }
              changed = true;
            } else if (!isSelecting.current && inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i].status !== 0) {
              inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[i] = {
                status: 0,
                selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[i].selectors
              }
              changed = true;
            }
          }
        }

        if (changed) {
          setInputBlocks(inputBlocksClone);
          setRenderCalendar(renderCalendar + 1);
        }
      }
    }
  }

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
            minDate={new Date()}
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

      {currentPage === 2 && <div className="create-meeting__time-pick">
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
            <React.Fragment>
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
                        ${block.isSelectable && block.status === 0 ? "create-meeting__time__time-range--disabled" : ""}`}>
                        {block.isSelectable && block.status !== 0 &&
                          Array.from(Array(32).keys()).map((key: number) => {
                            return (
                              <div
                                className={`create-meeting__time__time-range--time-slot 
                                  ${key % 2 === 1 && key !== 31 ? "create-meeting__time__time-range--time-slot--divider" : ""}`}
                                onMouseDown={(e: any) => { onMouseDown(e, indexInWeek) }}
                                onMouseUp={(e: any) => { onMouseUp(e, indexInWeek) }}
                                onMouseMove={(e: any) => { onMouseMove(e, indexInWeek) }}
                                onMouseEnter={(e: any) => { onMouseEnter(e, indexInWeek) }}
                                onMouseOut={(e: any) => { onMouseOut(e, indexInWeek) }}
                                style={{
                                  background: block.timeSlots?.[key].status === 2 ? "#446784" :
                                    block.timeSlots?.[key].status === 1 ? "#BCCC9A" :
                                      block.timeSlots?.[key].selectors?.length === 0 ? "none" : "rgba(188, 204, 154, 0.41)"
                                }}
                                draggable="false"
                              >
                                <span
                                  className="create-meeting__tooltip-span"
                                  data-tip
                                  data-for={`tooltip-${indexInWeek}-${key}`}
                                  style={{ cursor: 'pointer' }}
                                  data-time-slot={key}
                                  draggable="false"
                                ></span>
                                <ReactTooltip id={`tooltip-${indexInWeek}-${key}`} place="right" effect="solid">
                                  <p
                                    className="no-select"
                                  >{getTimeText(key)}</p>
                                </ReactTooltip>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </React.Fragment>
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

        {showingSelectors.length > 0 && <div className="create-meeting__selectors">
          <h5 className="create-meeting__selectors--count">{showingSelectors.length}/{showingSelectors.length}</h5>
          <div className="create-meeting__selectors--container">
            {showingSelectors.map((selector: any) => {
              return (
                <div className="create-meeting__selectors--single">
                  <img src={selector.profileImage}></img>
                </div>
              )
            })}
          </div>
        </div>}
      </div>}

      {currentPage === 3 && <div className="create-meeting__action-polling"></div>}

      {/* TODO: Add options for polling (move from page 1 of prototype to page 3 of this) */}

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