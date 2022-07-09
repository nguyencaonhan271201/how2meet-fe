import './MeetingMinute.scss';
import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadAdapter } from "./UploadAdapter";
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { doCreateNewMinute, doDeleteMinute, doGetMeetingByMeetingID, doGetMeetingMinute, doGetUserByFirebaseID, doUpdateMinute, resetMeetingMinuteStatus, RootState, useAppDispatch } from '../../redux';
import { useSelector } from 'react-redux';
import { getCurrentDateTimeFullString } from '../../helpers/date';

export const MeetingMinute: React.FC<IMeetingMinute> = ({ }) => {
  document.title = "How2Meet? | Meeting Minute";

  let { id: paramMeetingID, minute_id: paramMinuteID } = useParams() as any;

  const MySwal = withReactContent(Swal);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { user } = useSelector(
    (state: RootState) => state.loginSlice,
  );
  const { isCreatingNewMeetingMinute, createNewMeetingMinuteSuccess, createNewMeetingMinuteError,
    isUpdatingMeetingMinute, updateMeetingMinuteSuccess, updateMeetingMinuteError,
    isDeletingMeetingMinute, deleteMeetingMinuteSuccess, deleteMeetingMinuteError } = useSelector(
      (state: RootState) => state.meetingSlice,
    );
  const { meetingByID: meetingInfo, minuteById: minuteInfo } = useSelector(
    (state: RootState) => state.meetingSlice,
  );

  //States
  const [minuteData, setMinuteData] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [creator, setCreator] = useState<any>();
  const [created, setCreated] = useState<string>("");
  const [updated, setUpdated] = useState<string>("");
  const [isDeletable, setIsDeletable] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);

  //Hooks
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

    if (paramMinuteID.toString() !== "-1") {
      dispatch(doGetMeetingMinute({
        minuteID: paramMinuteID
      }))
      setIsNew(false);
    } else {
      setIsNew(true);
    }
  }, []);

  useEffect(() => {
    if (((localStorage.getItem('firebase_id') && user) || !localStorage.getItem('firebase_id'))
      && meetingInfo && Object.keys(meetingInfo).length !== 0) {
      if (paramMinuteID.toString() !== "-1") {
        if (Object.keys(minuteInfo).length !== 0) {
          checkForAccessRights();
        }
      } else {
        checkForAccessRights();
      }
    }
  }, [meetingInfo, minuteInfo, user])

  useEffect(() => {
    if (!isCreatingNewMeetingMinute && createNewMeetingMinuteSuccess) {
      MySwal.close();

      MySwal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Your meeting is created successfully!',
      })
        .then(() => {
          dispatch(resetMeetingMinuteStatus());
          history.push(`/meeting-minute/${paramMeetingID}`)
          return;
        })
    } else if (!isCreatingNewMeetingMinute && !createNewMeetingMinuteSuccess
      && createNewMeetingMinuteError?.error) {
      MySwal.close();

      MySwal.fire({
        icon: 'error',
        title: 'Error occured...',
        text: 'Your minute cannot be saved. Consider backing up the content and try again later!',
      })
    }
  }, [isCreatingNewMeetingMinute, createNewMeetingMinuteSuccess]);

  useEffect(() => {
    if (!isUpdatingMeetingMinute && updateMeetingMinuteSuccess) {
      MySwal.close();

      MySwal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Your meeting is updated successfully!',
      })
        .then(() => {
          dispatch(resetMeetingMinuteStatus());
          history.push(`/meeting-minute/${paramMeetingID}`)
          return;
        })
    } else if (!isUpdatingMeetingMinute && !updateMeetingMinuteSuccess
      && updateMeetingMinuteError?.error) {
      MySwal.close();

      MySwal.fire({
        icon: 'error',
        title: 'Error occured...',
        text: 'Your minute cannot be updated. Consider backing up the content and try again later!',
      })
    }
  }, [isUpdatingMeetingMinute, updateMeetingMinuteSuccess]);

  useEffect(() => {
    if (!isDeletingMeetingMinute && deleteMeetingMinuteSuccess) {
      MySwal.close();

      MySwal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Your meeting is deleted successfully!',
      })
        .then(() => {
          dispatch(resetMeetingMinuteStatus());
          history.push(`/meeting-minute/${paramMeetingID}`)
          return;
        })
    } else if (!isDeletingMeetingMinute && !deleteMeetingMinuteSuccess
      && deleteMeetingMinuteError?.error) {
      MySwal.close();

      MySwal.fire({
        icon: 'error',
        title: 'Error occured...',
        text: 'Your minute cannot be deleted. Try again later!',
      })
    }
  }, [isDeletingMeetingMinute, deleteMeetingMinuteSuccess]);


  //Functions
  const checkForAccessRights = () => {
    MySwal.close();

    //Check meeting first
    if (!localStorage.getItem("firebaseLoggedIn") || localStorage.getItem("firebaseLoggedIn") === "0") {
      //Not signed in
      history.push("/auth", { isRedirect: true });
      return;
    } else {
      //Check if is set for the current meeting
      let isInMeeting = meetingInfo?.invitators?.some((invitator: any) => invitator.firebase_id === user?.firebase_id);
      if (!isInMeeting) {
        history.push("/meetings", { isNotValidMeeting: true });
        return;
      } else {
        updateMeetingInformation();
      }
    }
  }

  const updateMeetingInformation = () => {
    //Check minute right
    if (!isNew) {
      setIsDeletable(meetingInfo?.creator.firebase_id === user?.firebase_id ||
        minuteInfo?.creator.firebase_id === user?.firebase_id)
      setTitle(minuteInfo?.title);
      setDescription(minuteInfo?.description);
      setCreated(getCurrentDateTimeFullString(new Date(minuteInfo?.createdAt)));
      setUpdated(getCurrentDateTimeFullString(new Date(minuteInfo?.updatedAt)));
      setCreator(minuteInfo?.creator);
      setMinuteData(minuteInfo?.content);
    } else {
      setIsDeletable(false);
      setCreator(user);
      setCreated(getCurrentDateTimeFullString(new Date(Date.now())));
      setMinuteData("");
      setTitle("");
      setDescription("");
    }
  }

  const performSave = () => {
    if (title === "") {
      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Please input title for minute!',
      })
      return;
    }

    let objectToSave = {
      title: title,
      description: description,
      content: minuteData,
      creator: creator,
      meetingID: paramMeetingID
    }

    if (isNew) {
      //Create minute
      dispatch(doCreateNewMinute(objectToSave))
    } else {
      //Update minute
      dispatch(doUpdateMinute({
        updateContent: objectToSave,
        minuteID: paramMinuteID
      }))
    }
  }

  const performDelete = () => {
    MySwal.fire({
      title: "Are you sure want to delete this minute?",
      text: "",
      icon: "warning",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      showCancelButton: true,
      showConfirmButton: true
    })
      .then((willDelete) => {
        if (willDelete.isConfirmed) {
          dispatch(doDeleteMinute({
            minute_id: paramMinuteID
          }))
        }
      });
  }

  return (
    <div className="meeting-minutes">
      <div className="meeting-minutes__info">
        <span>
          <span
            className="meeting-minutes__name"
            style={{
              position: "relative",
            }}>
            {title !== "" ? title : "...."}

            <input
              value={title}
              style={{
                opacity: 0,
                position: "absolute",
                left: "0",
                right: "0"
              }}
              onChange={(e) => {
                setTitle(e.target.value)
              }}>
            </input>
          </span>
        </span>

        <textarea
          className="meeting-minutes__description"
          placeholder="desc..."
          rows={3}
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}>
          {description}
        </textarea>

        <div className="meeting-minutes__creator">
          <div className="meeting-minutes__creator--person">
            <img
              className="meeting-minutes__participant"
              src={creator?.image}
            ></img>
            <p>{creator?.name || creator?.image}</p>
          </div>

          <div className="meeting-minutes__creator--info">
            <p>Created: {created}</p>
            {!isNew && <p>Last updated: {updated}</p>}
          </div>
        </div>
      </div>



      <CKEditor
        editor={ClassicEditor}
        data={minuteData || ""}
        onReady={(editor: any) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
            return new UploadAdapter(loader);
          };
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          setMinuteData(data);
        }}
        onBlur={(event: any, editor: any) => {
        }}
        onFocus={(event: any, editor: any) => {
        }}
      />

      <div className="meeting-minutes__button-container">
        <button
          className="meeting-minutes__save"
          onClick={() => performSave()}
        >
          Save
        </button>

        {!isNew && isDeletable && <button
          className="meeting-minutes__delete"
          onClick={() => performDelete()}
        >
          Delete
        </button>}
      </div>
    </div>
  );
};