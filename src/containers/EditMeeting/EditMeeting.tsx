import './EditMeeting.scss';
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
import {
  doCreateMeeting, doGetMeetingByMeetingID, doGetUserByFirebaseID, doUpdateMeeting,
  resetMeetingCreationStatus, resetMeetingUpdateStatus, RootState, updateMeetingPublic, useAppDispatch
} from '../../redux';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { decrypt } from '../../helpers/password';
import { PollingChoiceSelectableCard } from '../../components/PollingChoiceSelectableCard/PollingChoiceSelectableCard';
import { validateURL } from '../../helpers/validate';

export const EditMeeting: React.FC<ICreateMeeting> = ({ }) => {
  document.title = "How2Meet? | Edit Meeting";
  let { id: paramMeetingID } = useParams() as any;

  const { user } = useSelector(
    (state: RootState) => state.loginSlice,
  );
  const { isUpdateMeeting, updateMeetingSuccess, updateMeetingError } = useSelector(
    (state: RootState) => state.meetingSlice,
  );
  const { meetingByID: meetingInfo } = useSelector(
    (state: RootState) => state.meetingSlice,
  );

  const [currentPage, setCurrentPage] = useState<number>(0);
  const MySwal = withReactContent(Swal);
  const numberOfPages = 5;
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [changedDate, setChangedDate] = useState<boolean>(false);

  //Page 0
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [backupFromDate, setBackupFromDate] = useState<Date>(new Date());
  const [backupToDate, setBackupToDate] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [creator, setCreator] = useState<any>();

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

  //Page 3
  const [pollOptions, setPollOptions] = useState<Array<any>>([]);
  const [letUserAdd, setLetUserAdd] = useState<boolean>(false);
  const [choiceLimit, setChoiceLimit] = useState<number>(1);
  const [isLimitChoices, setIsLimitChoices] = useState<boolean>(false);
  const [countSelected, setCountSelected] = useState<number>(0);

  //Page 4
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [selectedInvitators, setSelectedInvitators] = useState<Array<any>>([]);
  const [meetingID, setMeetingID] = useState<string>("");
  const [update, setUpdate] = useState<number>(0);
  const [meetingPassword, setMeetingPassword] = useState<string>("");

  //Hooks
  useEffect(() => {
    console.log(inputBlocks);
  }, [inputBlocks]);

  useEffect(() => {
    //generateCalendar();
  }, [fromDate, toDate]);

  useEffect(() => {
    if (localStorage.getItem('firebase_id'))
      dispatch(doGetUserByFirebaseID({
        firebase_id: localStorage.getItem('firebase_id') || ''
      }))

    MySwal.fire({
      didOpen: () => {
        MySwal.showLoading();
      },
      didClose: () => {
        MySwal.hideLoading();
      },
      allowOutsideClick: false,
    })

    //This function checks whether the current user has the right to access the meeting
    //Or navigate in case the meeting is public
    dispatch(doGetMeetingByMeetingID({
      meetingID: paramMeetingID
    }))
  }, []);

  useEffect(() => {
    if (currentPage === 0 && ((localStorage.getItem('firebase_id') && user) || !localStorage.getItem('firebase_id'))
      && meetingInfo && Object.keys(meetingInfo).length !== 0) {
      checkForAccessRights();
    }
  }, [meetingInfo, user])

  useEffect(() => {
    if (currentPage === 0 && ((localStorage.getItem('firebase_id') && user) || !localStorage.getItem('firebase_id'))
      && meetingInfo && Object.keys(meetingInfo).length !== 0) {
      checkForAccessRights();
    }
  }, [user])

  useEffect(() => {
    if (!isUpdateMeeting && updateMeetingSuccess) {
      MySwal.close();

      MySwal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Your choice is saved successfully!',
      })
        .then(() => {
          dispatch(resetMeetingUpdateStatus());
          history.push("/meetings")
          return;
        })
    } else if (!isUpdateMeeting && !updateMeetingSuccess && updateMeetingError?.error) {
      MySwal.close();

      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Error occured! Your meeting cannot be edited!',
      })
    }
  }, [isUpdateMeeting, updateMeetingSuccess]);

  useEffect(() => {
    //dispatch(updateMeetingPublic({ isPublic: isPublic }))
  }, [isPublic]);

  //Functions
  const checkForAccessRights = () => {
    MySwal.close();

    //Not logged in
    if (!localStorage.getItem("firebaseLoggedIn") || localStorage.getItem("firebaseLoggedIn") === "0") {
      history.push("/auth", { isRedirect: true });
      return;
    }

    //Check if is the creator of the meeting
    if (user.firebase_id !== meetingInfo?.creator.firebase_id) {
      history.push("/meetings", { isNotValidMeeting: true });
      return;
    } else {
      updateMeetingInformation();
    }
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

      if (changedDate) {
        MySwal.fire({
          title: "All of the participants' votes for free time slots will be lost permanently. Do you wish to continue?",
          text: "You are changing the dates of the meeting!!!",
          icon: "warning",
          cancelButtonText: "No",
          confirmButtonText: "Yes",
          showCancelButton: true,
          showConfirmButton: true
        })
          .then((willProceed) => {
            if (willProceed.isConfirmed) {
              generateCalendar();
              setCurrentPage(currentPage + 1);
            } else {
              setFromDate(backupFromDate);
              setToDate(backupToDate);
              setCurrentPage(currentPage + 1);
            }
            return;
          });
      } else {
        setCurrentPage(currentPage + 1);
      }
    } else {
      setCurrentPage(currentPage + 1);
    }
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

  const saveMeeting = () => {
    MySwal.showLoading();

    let dateBlocks = [] as any;
    (inputBlocks as any).forEach((block: any) => {
      block.blocks?.map((block: any) => {
        dateBlocks = [...dateBlocks, block];
      })
    })

    //TODO: Wrap up information
    let meetingObject = {
      title: meetingTitle.toUpperCase(),
      description: description,
      password: meetingPassword,
      location: location,
      creator: creator,
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
      invitators: [...selectedInvitators]
    } as IAPIPostNewMeeting;

    //TODO2: Call API to create meeting
    dispatch(doUpdateMeeting({
      meetingID: meetingID,
      meetingInfo: meetingObject
    }));
  }

  const eliminateMe = (arr: any) => {
    let findMeIndex = -1;
    let cloneArr = [...arr];

    cloneArr.forEach((item: any, index: number) => {
      if (item.firebase_id === user.firebase_id) {
        findMeIndex = index;
      }
    })

    if (findMeIndex > -1) {
      cloneArr.splice(findMeIndex, 1);
    }

    return cloneArr;
  }

  const cloneInputBlocks = () => {
    let inputBlocksClone = [...inputBlocks];
    let returnBlocks = [];

    inputBlocksClone.forEach((weekBlock: any) => {
      let blocks = [];

      weekBlock.blocks.forEach((dayBlock: any) => {
        let timeSlots = [];

        dayBlock.timeSlots.forEach((slot: any) => {
          timeSlots.push({
            status: slot.status,
            selectors: [...slot.selectors]
          })
        })

        blocks.push({
          date: dayBlock.date,
          isSelectable: dayBlock.isSelectable,
          status: dayBlock.status,
          timeSlots: timeSlots
        })
      })

      returnBlocks.push({
        isNewMonth: weekBlock.isNewMonth,
        blocks: blocks
      })
    })

    return returnBlocks;
  }

  const onMouseDown = (e: any, indexInWeek: number) => {
    isDragging.current = true;
    startPosition.current = parseInt(e.target.getAttribute("data-time-slot"));
    let currentIndex = parseInt(e.target.getAttribute("data-time-slot"));

    //If the first selected box is empty slot => The current action is selecting the slots
    isSelecting.current = inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].status === 0;

    let inputBlocksClone = cloneInputBlocks();

    if (isSelecting.current && inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].status !== 2) {
      inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots = [...inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots];
      inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[currentIndex] = {
        status: 2,
        selectors: inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].selectors
      }
    } else if (!isSelecting.current && inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].status !== 0) {
      inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[currentIndex] = {
        status: 0,
        selectors: eliminateMe(inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[currentIndex].selectors)
      }
    }

    setInputBlocks(inputBlocksClone);
    setRenderCalendar(renderCalendar + 1);
  }

  const onMouseUp = (e: any, indexInWeek: number) => {
    isDragging.current = false;
    isSelecting.current = false;
    startPosition.current = -1;

    let inputBlocksClone = cloneInputBlocks();

    let changed = false;
    inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots.forEach((slot: any, index: number) => {
      if (slot.status === 2) {
        inputBlocksClone[showingWeek].blocks[indexInWeek].timeSlots[index] = {
          status: 1,
          selectors: [...inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[index].selectors, user]
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
    setShowingSelectors(inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[index].selectors);
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
        let inputBlocksClone = cloneInputBlocks();

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
                selectors: eliminateMe(inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[i].selectors)
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
                selectors: eliminateMe(inputBlocks[showingWeek].blocks[indexInWeek].timeSlots[i].selectors)
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

  const updateMeetingInformation = () => {
    setMeetingID(paramMeetingID);
    setMeetingPassword(meetingInfo?.password || "");

    setMeetingTitle(meetingInfo?.title || "");
    setLocation(meetingInfo?.location || "");
    setDescription(meetingInfo?.description || "");
    setFromDate(new Date(meetingInfo?.date?.[0] || 0));
    setToDate(new Date(meetingInfo?.date?.[1] || 0));
    setBackupFromDate(new Date(meetingInfo?.date?.[0] || 0));
    setBackupToDate(new Date(meetingInfo?.date?.[1] || 0));
    setCreator(meetingInfo?.creator || {});

    setIsBonding(meetingInfo?.isBonding || false);

    //Create inputBlocks
    let blocksStored = meetingInfo?.dateBlocks;
    let cloneBlocks = [] as any;
    let modifiedInputBlocks = [] as any;
    blocksStored.forEach((block: any) => {
      let getDate = new Date(block.date);
      getDate.setHours(0);
      getDate.setMinutes(0);
      getDate.setSeconds(0);

      let cloneTimeSlots = [];
      block.timeSlots.forEach((timeSlot: any) => {
        cloneTimeSlots.push({
          status: timeSlot.selectors.some((selector: any) => selector.firebase_id === user.firebase_id) ? 1 : 0,
          selectors: timeSlot.selectors
        })
      })

      cloneBlocks.push({
        date: getDate,
        isSelectable: block.isSelectable,
        status: block.status,
        timeSlots: cloneTimeSlots
      });
    })
    for (let i = 0; i < cloneBlocks.length; i += 7) {
      let getBlocks = cloneBlocks.slice(i, i + 7);
      modifiedInputBlocks.push({
        isNewMonth: getBlocks[0].date.getMonth() !== getBlocks[6].date.getMonth() || getBlocks[0].date.getDate() === 1,
        blocks: getBlocks,
      })
    }

    setInputBlocks(modifiedInputBlocks);

    setPollOptions(meetingInfo?.poll);
    setLetUserAdd(meetingInfo?.pollLetUserAdd);
    setChoiceLimit(meetingInfo?.pollChoicesLimit);
    setIsLimitChoices(meetingInfo?.pollIsLimitChoice);
    let selected = 0;
    meetingInfo?.poll.forEach((option: any) => {
      option.selectors.forEach((selector: any) => {
        if (selector.firebase_id === user?.firebase_id)
          selected++;
      })
    })
    setCountSelected(selected);
    setSelectedInvitators(meetingInfo?.invitators);
    setIsPublic(meetingInfo?.isPublic)

    setUpdate(update + 1);
  }

  const handleSelect = (index: number) => {
    let pollOptionsClone = [...pollOptions] as any;
    let participantIndex = -1;

    pollOptionsClone?.[index]?.selectors?.forEach((selector: any, selectorIndex: number) => {
      if (selector.firebase_id === user?.firebase_id) {
        participantIndex = selectorIndex;
      }
    })

    if (participantIndex > -1) {
      //Case unselect a choice
      let updatedSelectors = [];

      for (let i = 0; i < pollOptionsClone?.[index]?.selectors.length; i++) {
        if (i !== participantIndex) {
          updatedSelectors.push(pollOptionsClone?.[index]?.selectors[i]);
        }
      }

      pollOptionsClone[index] = {
        description: pollOptionsClone[index].description,
        link: pollOptionsClone[index].link,
        location: pollOptionsClone[index].location,
        type: pollOptionsClone[index].type,
        title: pollOptionsClone[index].title,
        selectors: updatedSelectors
      }
      pollOptionsClone[index].selectors = updatedSelectors;
      setCountSelected(countSelected - 1);
    } else {
      let updatedSelectors = [];

      for (let i = 0; i < pollOptionsClone?.[index]?.selectors.length; i++) {
        updatedSelectors.push(pollOptionsClone?.[index]?.selectors[i]);
      }

      updatedSelectors.push(user);

      pollOptionsClone[index] = {
        description: pollOptionsClone[index].description,
        link: pollOptionsClone[index].link,
        location: pollOptionsClone[index].location,
        type: pollOptionsClone[index].type,
        title: pollOptionsClone[index].title,
        selectors: updatedSelectors
      }

      setCountSelected(countSelected + 1);
    }

    pollOptionsClone.sort((optionA: any, optionB: any) => (
      optionA.selectors.length <= optionB.selectors.length ? 1 : -1
    ))
    setPollOptions(pollOptionsClone);
  }

  return (
    <div className="edit-meeting">
      {currentPage === 0 && <div className="edit-meeting__general-info">
        <span>
          <h1 className="edit-meeting__title">EVENT

          </h1>
          <span
            className="edit-meeting__name"
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

        <p className="edit-meeting__hosted-title">
          host by {creator?.name || creator?.email}
        </p>

        <textarea
          className="edit-meeting__description"
          placeholder="desc..."
          rows={2}
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}>
          {description}
        </textarea>

        <div className="edit-meeting__dates">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={fromDate}
            onChange={(date: any) => {
              setFromDate(date);
              setChangedDate(true);
            }}
            minDate={new Date()}
          />

          <span className="edit-meeting__to">to</span>

          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={toDate}
            onChange={(date: any) => {
              setToDate(date);
              setChangedDate(true);
            }}
            minDate={fromDate}
          />
        </div>

        <div className="edit-meeting__location-input">
          <input
            type="text"
            value={location}
            onChange={(e: any) => setLocation(e.target.value)}
            placeholder="location"
            readOnly={true}></input>
        </div>

      </div>}

      {currentPage === 1 && <div className="edit-meeting__date-pick">
        <h1 className="edit-meeting__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
        </h1>

        <p className="edit-meeting__hosted-title">
          <label className="switch" style={{ marginRight: "5px" }}>
            <input type="checkbox" checked={isBonding}></input>
            <span className="slider round" onClick={() => setIsBonding(!isBonding)}></span>
          </label>
          {` `}
          {isBonding ? <span
            style={{ color: "var(--theme-green)", marginRight: "4px" }}
          >bonding</span> : "meeting "}

          host by {creator?.name || creator?.email}
        </p>

        <div className="edit-meeting__calendar">
          {inputBlocks.map((week: any, index: number) => {
            return (
              <>
                {(index === 0 || week.isNewMonth) &&
                  <p className="edit-meeting__calendar__month-name">
                    {getMonthNameFromIndex(week.blocks[6].date.getMonth())}
                  </p>}

                <div className="edit-meeting__calendar__week">
                  {week.blocks.map((block: any, indexInWeek: number) => {
                    return (
                      <div
                        className={`no-select edit-meeting__calendar__week-day
                        ${!block.isSelectable ? "edit-meeting__calendar__week-day--disabled" : ""}
                        ${block.isSelectable && block.status === 0 ? "edit-meeting__calendar__week-day--busy" : ""}`}
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
          <h5 className="create-meeting__selectors--count">{showingSelectors.length}/{meetingInfo?.invitators.length}</h5>
          <div className="create-meeting__selectors--container">
            {showingSelectors.map((selector: any) => {
              return (
                <div className="create-meeting__selectors--single">
                  <img src={selector.image}></img>
                  <p style={{ margin: 0 }}>{selector.name}</p>
                </div>
              )
            })}
          </div>
        </div>}
      </div>}

      {currentPage === 3 && <div className="edit-meeting__action-polling">
        <h1 className="edit-meeting__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
        </h1>

        {isLimitChoices && <p className="edit-meeting__choice-limit">
          {`${choiceLimit - countSelected} / ${choiceLimit} ${choiceLimit - countSelected === 1 ? "choice" : "choices"} left`}</p>}

        <div className="edit-meeting__action-polling__options">
          {pollOptions.map((poll: any, index: any) => {
            return <div className="edit-meeting__action-polling__options--single">
              <PollingChoiceSelectableCard
                choiceID={index}
                title={poll.title}
                location={poll.location}
                link={poll.link}
                description={poll.description}
                type={poll.type}
                selectors={poll.selectors}
                isSelected={poll.selectors?.some((selector: any) => selector.firebase_id === user?.firebase_id)}
                setSelected={() => handleSelect(index)}
                isSelectable={!isLimitChoices || (isLimitChoices && (countSelected !== choiceLimit))}
                isEditable={true}
                editAction={editAction}
                editableMeeting={true}
              ></PollingChoiceSelectableCard>
            </div>
          })}
          {<div className="edit-meeting__action-polling__options--single">
            <PollingChoiceSelectableCard
              isAddCard={true}
              addAction={addAction}
            ></PollingChoiceSelectableCard>
          </div>}
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

      {currentPage === 4 && <div className="create-meeting__confirmation">
        <h1 className="create-meeting__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
        </h1>

        <span>
          <label className="switch" style={{ marginRight: "5px" }}>
            <input type="checkbox" checked={isPublic}></input>
            <span className="slider round" onClick={() => {
              dispatch(updateMeetingPublic({ isPublic: !isPublic }))
              setIsPublic(!isPublic);
            }}></span>
          </label>
          {` `}
          {isPublic ? <span
            style={{ color: "var(--theme-green)", marginRight: "4px" }}
          >public</span> : "private"}
        </span>

        {/* Private mode */}
        {!isPublic && <SearchBar
          selected={selectedInvitators}
          setSelected={setSelectedInvitators}
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
                navigator.clipboard.writeText(`${decrypt(meetingPassword)}`);
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
              {decrypt(meetingPassword)}
            </p>
            <FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>
          </div>
        </div>}
      </div>}

      <div className="edit-meeting__controls">
        {currentPage > 2 && <button className="edit-meeting__prev" onClick={() => {
          setCurrentPage(currentPage - 1);
        }}>
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>}

        {(currentPage !== numberOfPages - 1) && <button className="edit-meeting__next" onClick={() => {
          nextPage();
        }}>
          <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
        </button>}

        {(currentPage === numberOfPages - 1) && <button className="edit-meeting__next" onClick={() => {
          saveMeeting();
        }}>
          <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
        </button>}
      </div>

      <ToastContainer />
    </div >
  );
};
