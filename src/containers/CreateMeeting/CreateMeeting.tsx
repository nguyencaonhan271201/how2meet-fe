import './CreateMeeting.scss';
import React, { useEffect, useState, useRef } from 'react';
import { faArrowLeft, faArrowRight, faLink, faCheck, faKey } from '@fortawesome/free-solid-svg-icons'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonday, getMonthNameFromIndex, getNumberOfDaysInMonthAndYear, getSunday, getTimeText, getWeekNumber, isBetween } from '../../helpers/date';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactTooltip from 'react-tooltip';
import { PollingChoiceCard } from '../../components/PollingChoiceCard/PollingChoiceCard';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doCreateMeeting, doGetUserByFirebaseID, resetMeetingCreationStatus, RootState, useAppDispatch } from '../../redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { encrypt } from '../../helpers/password';
import { validateURL } from '../../helpers/validate';

export const CreateMeeting: React.FC<ICreateMeeting> = ({ }) => {
  document.title = "How2Meet? | New Meeting";
  const { user } = useSelector(
    (state: RootState) => state.loginSlice,
  );
  const { isCreatingNewMeeting, createNewMeetingSuccess, createNewMeetingError } = useSelector(
    (state: RootState) => state.meetingSlice,
  );

  const [currentPage, setCurrentPage] = useState<number>(0);
  const MySwal = withReactContent(Swal);
  const numberOfPages = 4;
  const dispatch = useAppDispatch();
  const history = useHistory();

  //Page 0
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  //Page 1
  const [inputBlocks, setInputBlocks] = useState<Array<any>>([]);
  const [isBonding, setIsBonding] = useState<boolean>(false);
  const [renderCalendar, setRenderCalendar] = useState<number>(0);

  //Page 2
  const [pollOptions, setPollOptions] = useState<Array<any>>([]);
  const [letUserAdd, setLetUserAdd] = useState<boolean>(false);
  const [choiceLimit, setChoiceLimit] = useState<number>(1);
  const [isLimitChoices, setIsLimitChoices] = useState<boolean>(false);

  //Page 3
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [selectedInvitators, setSelectedInvitators] = useState<Array<any>>([]);
  const [meetingID, setMeetingID] = useState<string>("");
  const [meetingPassword, setMeetingPassword] = useState<string>("");

  //Hooks
  useEffect(() => {
    console.log(inputBlocks);
  }, [inputBlocks]);

  useEffect(() => {
    generateCalendar();
  }, [fromDate, toDate]);

  useEffect(() => {
    //Generate random ID token for the meeting
    setMeetingID((Math.random() + 1).toString(36).substring(6));
    setMeetingPassword((Math.random() + 1).toString(36).substring(3));

    if (localStorage.getItem('firebase_id'))
      dispatch(doGetUserByFirebaseID({
        firebase_id: localStorage.getItem('firebase_id') || ''
      }))
  }, []);

  useEffect(() => {
    if (!isCreatingNewMeeting && createNewMeetingSuccess) {
      MySwal.close();

      MySwal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Your meeting is created successfully!',
      })
        .then(() => {
          dispatch(resetMeetingCreationStatus());
          history.push("/meetings")
          return;
        })
    } else if (!isCreatingNewMeeting && !createNewMeetingSuccess && createNewMeetingError?.error) {
      MySwal.close();

      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Error occured! Your meeting cannot be created!',
      })
    }
  }, [isCreatingNewMeeting, createNewMeetingSuccess]);

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

  const addAction = () => {
    MySwal.fire({
      title: 'Add an option',
      html: `
          <div>
            <label for="title" class="mr-2 mt-2 swal-label">title</label>
            <input class="swal2-input" placeholder="title" type="text" id="title"><br>
          </div>

          <div>
            <label for="location" class="mr-2 mt-2 swal-label">location</label>
            <input class="swal2-input" placeholder="location" type="text" id="location"><br>
          </div>

          <div>
            <label for="link" class="mr-2 mt-2 swal-label">link</label>
            <input class="swal2-input" placeholder="link" type="text" id="link"><br>
          </div>

          <div>
            <label for="description" class="mr-2 mt-2 swal-label">description</label>
            <textarea class="swal2-input" placeholder="description" id="description"></textarea>
          </div>

          <div>
            <label for="type" class="mr-2 mt-2 swal-label">type</label>
            <select class="swal2-input" id="type">
              <option value="0" selected>Dining</option>
              <option value="1">Activities</option>
            </select>
          </div>
        `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      showLoaderOnConfirm: true,
      didOpen: () => {

      },
      preConfirm: () => {
        let title = (document?.getElementById('title') as HTMLInputElement).value || "";
        let location = (document?.getElementById('location') as HTMLInputElement).value || "";
        let link = (document?.getElementById('link') as HTMLInputElement).value || "";
        let description = (document?.getElementById('description') as HTMLTextAreaElement).value || "";
        let type = (document?.getElementById('type') as HTMLSelectElement).value || "0";

        let errorText = "";
        if (title === "") {
          if (errorText !== "")
            errorText += '<br>'
          errorText += `please input the title.`
        }

        if (location === "") {
          if (errorText !== "")
            errorText += '<br>'
          errorText += `please input the location.`
        }

        if (description === "") {
          if (errorText !== "")
            errorText += '<br>'
          errorText += `please input the description.`
        }

        if (link !== "" && !validateURL(link)) {
          if (errorText !== "")
            errorText += '<br>'
          errorText += `the link is not valid.`
        }

        if (errorText === "") {
          let thisOption = {
            title: title,
            location: location,
            link: link,
            description: description,
            type: parseInt(type),
            selectors: [],
            creator: user?.firebase_id
          }

          let clonePollOptions = [...pollOptions, thisOption];
          setPollOptions(clonePollOptions);
        } else {
          MySwal.showValidationMessage(
            errorText
          )
        }
      },
      allowOutsideClick: () => !MySwal.isLoading()
    })
  }

  const deleteAction = (index: number) => {
    MySwal.fire({
      title: "Are you sure want to remove this option?",
      text: "All votes for this option will be deleted",
      icon: "warning",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      showCancelButton: true,
      showConfirmButton: true
    })
      .then((willDelete) => {
        if (willDelete.isConfirmed) {
          let clonePollOptions = [...pollOptions];
          clonePollOptions.splice(index, 1);
          setPollOptions(clonePollOptions);
        }
      });
  }

  const editAction = (index: number) => {
    MySwal.fire({
      title: 'Edit an option',
      html: `
          <div>
            <label for="title" class="mr-2 mt-2 swal-label">title</label>
            <input class="swal2-input" placeholder="title" type="text" id="title"><br>
          </div>

          <div>
            <label for="location" class="mr-2 mt-2 swal-label">location</label>
            <input class="swal2-input" placeholder="location" type="text" id="location"><br>
          </div>

          <div>
            <label for="link" class="mr-2 mt-2 swal-label">link</label>
            <input class="swal2-input" placeholder="link" type="text" id="link"><br>
          </div>

          <div>
            <label for="description" class="mr-2 mt-2 swal-label">description</label>
            <textarea class="swal2-input" placeholder="description" id="description"></textarea>
          </div>

          <div>
            <label for="type" class="mr-2 mt-2 swal-label">type</label>
            <select class="swal2-input" id="type">
              <option value="0" selected>Dining</option>
              <option value="1">Activities</option>
            </select>
          </div>

          <div>
            <button 
            id="deleteAction"
            type="button" class="swal2-cancel swal2-styled swal2-default-outline" style="display: inline-block; background-color: red;" aria-label="">
            Delete</button>
          </div>
        `,
      showCancelButton: true,
      confirmButtonText: 'Edit',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      showLoaderOnConfirm: true,
      didOpen: () => {
        let getAction = pollOptions[index];

        (document?.getElementById('title') as HTMLInputElement).value = getAction.title;
        (document?.getElementById('location') as HTMLInputElement).value = getAction.location;
        (document?.getElementById('link') as HTMLInputElement).value = getAction.link;
        (document?.getElementById('description') as HTMLInputElement).value = getAction.description;
        (document?.getElementById('type') as HTMLInputElement).value = getAction.type;

        (document?.getElementById('deleteAction') as HTMLButtonElement).addEventListener('click', () => {
          deleteAction(index);
        })
      },
      preConfirm: () => {
        let title = (document?.getElementById('title') as HTMLInputElement).value || "";
        let location = (document?.getElementById('location') as HTMLInputElement).value || "";
        let link = (document?.getElementById('link') as HTMLInputElement).value || "";
        let description = (document?.getElementById('description') as HTMLTextAreaElement).value || "";
        let type = (document?.getElementById('type') as HTMLSelectElement).value || "0";

        let errorText = "";
        if (title === "") {
          if (errorText !== "")
            errorText += '<br>'
          errorText += `please input the title.`
        }

        if (location === "") {
          if (errorText !== "")
            errorText += '<br>'
          errorText += `please input the location.`
        }

        if (description === "") {
          if (errorText !== "")
            errorText += '<br>'
          errorText += `please input the description.`
        }

        if (errorText === "") {
          let thisOption = {
            title: title,
            location: location,
            link: link,
            description: description,
            type: parseInt(type),
            selectors: []
          }

          let clonePollOptions = [...pollOptions];
          clonePollOptions[index] = thisOption;
          setPollOptions(clonePollOptions);
        } else {
          MySwal.showValidationMessage(
            errorText
          )
        }
      },
      allowOutsideClick: () => !MySwal.isLoading()
    })
  }

  const createMeeting = () => {
    MySwal.fire({
      didOpen: () => {
        MySwal.showLoading();
      },
      didClose: () => {
        MySwal.hideLoading();
      },
      allowOutsideClick: false,
    })


    let dateBlocks = [] as any;
    (inputBlocks as any).forEach((block: any) => {
      block.blocks?.map((block: any) => {
        dateBlocks = [...dateBlocks, block];
      })
    })

    let invitators = [];
    if (!isPublic) {
      invitators = [...selectedInvitators];
      invitators.unshift(user);
    } else {
      invitators = [user];
    }

    //TODO: Wrap up information
    let meetingObject = {
      title: meetingTitle.toUpperCase(),
      description: description,
      password: encrypt(meetingPassword),
      location: location,
      creator: user,
      date: [fromDate, toDate],
      isBonding: isBonding,
      dateBlocks: dateBlocks,

      //Poll options
      poll: pollOptions,
      pollLetUserAdd: letUserAdd,
      pollIsLimitChoice: isLimitChoices,
      pollChoicesLimit: choiceLimit,

      //Choice options
      isPublic: isPublic,
      meetingID: meetingID,
      invitators: invitators,
    } as IAPIPostNewMeeting;

    //TODO2: Call API to create meeting
    dispatch(doCreateMeeting(meetingObject));
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
          host by {user?.name || user?.email}
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

        <div className="create-meeting__location-input">
          <input
            type="text"
            value={location}
            onChange={(e: any) => setLocation(e.target.value)}
            placeholder="location"></input>
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

          host by {user?.name || user?.email}
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
                        className={`no-select create-meeting__calendar__week-day
                        ${!block.isSelectable ? "create-meeting__calendar__week-day--disabled" : ""}
                        ${block.isSelectable && block.status === 0 ? "create-meeting__calendar__week-day--busy" : ""}`}
                        onClick={() => {
                          if (block.isSelectable) {
                            updateStatus(index, indexInWeek)
                          }
                        }}
                      >
                        <h4 className="no-select">{block.date.getDate()}</h4>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })}
        </div>
      </div>}

      {currentPage === 2 && <div className="create-meeting__action-polling">
        <h1 className="create-meeting__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
        </h1>

        <div className="create-meeting__action-polling__options">
          {pollOptions.map((poll: any, index: number) => {
            return <div className="create-meeting__action-polling__options--single">
              <PollingChoiceCard
                choiceID={index}
                title={poll.title}
                location={poll.location}
                link={poll.link}
                description={poll.description}
                type={poll.type}
                editAction={editAction}
              ></PollingChoiceCard>
            </div>
          })}
          <div className="create-meeting__action-polling__options--single">
            <PollingChoiceCard
              isAddCard={true}
              addAction={addAction}
            ></PollingChoiceCard>
          </div>
        </div>

        <div className="create-meeting__action-polling__settings">
          <div className="create-meeting__action-polling__settings--option">
            <input type="checkbox"
              checked={letUserAdd}
              onChange={(e: any) => { setLetUserAdd(e.target.checked) }} />
            <p>let they add</p>
          </div>
          <div className="create-meeting__action-polling__settings--option">
            <input type="checkbox"
              checked={isLimitChoices}
              onChange={(e: any) => { setIsLimitChoices(e.target.checked) }} />
            <span>
              <p style={{ display: "inline-flex", marginRight: 5 }}>limit to</p>
              <input
                type="number"
                style={{ display: "inline", width: "50px" }}
                value={choiceLimit}
                min={1}
                onChange={(e) => {
                  if (!isNaN(parseInt(e.target.value))) {
                    if (parseInt(e.target.value) < 1) {
                      setChoiceLimit(1)
                    } else setChoiceLimit(parseInt(e.target.value))
                  }
                  else setChoiceLimit(1);
                }}>
              </input>
              <p style={{ display: "inline-flex", marginLeft: 5 }}>choices</p>
            </span>
          </div>
        </div>
      </div>}

      {currentPage === 3 && <div className="create-meeting__confirmation">
        <h1 className="create-meeting__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
        </h1>

        <span>
          <label className="switch" style={{ marginRight: "5px" }}>
            <input type="checkbox"></input>
            <span className="slider round" onClick={() => setIsPublic(!isPublic)}></span>
          </label>
          {` `}
          {isPublic ? <span
            style={{ color: "var(--theme-green)", marginRight: "4px" }}
          >public</span> : "private"}
        </span>

        {/* Private mode */}
        {!isPublic && <SearchBar
          setSelected={setSelectedInvitators}
          editable={true}
          selected={selectedInvitators}
        ></SearchBar>}

        {/* Public mode */}
        {isPublic && <div className="create-meeting__confirmation--public">
          <div className="create-meeting__public-link">
            <FontAwesomeIcon icon={faLink}></FontAwesomeIcon>
            <p className="create-meeting__public-link--link" style={{ margin: 0 }}
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/meeting/${meetingID}`);
                toast("Copied to clipboard", {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
              }}>
              {window.location.origin}/meeting/{meetingID}
            </p>
            <FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>
          </div>

          <div className="create-meeting__public-link"
            style={{
              display: "flex",
              marginTop: 5
            }}>
            <FontAwesomeIcon icon={faKey}></FontAwesomeIcon>
            <p className="create-meeting__public-link--link"
              style={{
                margin: 0,
                textDecorationColor: "underline"
              }}
              onClick={() => {
                navigator.clipboard.writeText(`${meetingPassword}`);
                toast("Copied to clipboard", {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
              }}>
              {meetingPassword}
            </p>
            <FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>
          </div>
        </div>}
      </div>}

      <div className="create-meeting__controls">
        {currentPage > 2 && <button className="create-meeting__prev" onClick={() => {
          setCurrentPage(currentPage - 1);
        }}>
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>}

        {(currentPage !== numberOfPages - 1) && <button className="create-meeting__next" onClick={() => {
          nextPage();
        }}>
          <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
        </button>}

        {(currentPage === numberOfPages - 1) && <button className="create-meeting__next" onClick={() => {
          createMeeting();
        }}>
          <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
        </button>}
      </div>

      <ToastContainer />
    </div >
  );
};