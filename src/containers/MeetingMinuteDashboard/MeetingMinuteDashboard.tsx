import './MeetingMinuteDashboard.scss';
import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doGetMeetingByMeetingID, doGetMeetingMinutes, doGetUserByFirebaseID, RootState, useAppDispatch } from '../../redux';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentDateShortString } from '../../helpers/date';
import { MinuteCard } from '../../components/MinuteCard/MinuteCard';

export const MeetingMinuteDashboard: React.FC<IMeetingDashboard> = ({ }) => {
  document.title = "How2Meet? | Meeting Minutes";

  const MySwal = withReactContent(Swal);
  const dispatch = useAppDispatch();
  const history = useHistory();

  let { id: paramMeetingID } = useParams() as any;
  const { user } = useSelector(
    (state: RootState) => state.loginSlice,
  );
  const { getMeetingMinutesSuccess, meetingMinutes } = useSelector(
    (state: RootState) => state.meetingSlice,
  );
  const { meetingByID: meetingInfo } = useSelector(
    (state: RootState) => state.meetingSlice,
  );

  //Meeting Info
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [isBonding, setIsBonding] = useState<boolean>(true);

  const [minutesList, setMinutesList] = useState<Array<any>>([]);

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
  }, []);

  useEffect(() => {
    if (((localStorage.getItem('firebase_id') && user) || !localStorage.getItem('firebase_id'))
      && meetingInfo && Object.keys(meetingInfo).length !== 0) {
      checkForAccessRights();
    }
  }, [meetingInfo, user])

  useEffect(() => {
    if (getMeetingMinutesSuccess) {
      setMinutesList(meetingMinutes);

    }
  }, [getMeetingMinutesSuccess]);

  //Helper Functions
  const checkForAccessRights = () => {
    MySwal.close();

    let isPublic = meetingInfo?.isPublic;

    if (!isPublic) {
      //PRIVATE MEETING
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
    } else {
      //PUBLIC MEETING
      if (!localStorage.getItem("firebaseLoggedIn") || localStorage.getItem("firebaseLoggedIn") === "0") {
        //Not signed in
        localStorage.setItem("pendingMeetingID", meetingInfo?.meetingID || "");
        history.push("/auth", { isPendingMeeting: true });
        return;
      } else {
        //Check if is set for the current meeting
        let isInMeeting = meetingInfo?.invitators?.some((invitator: any) => invitator.firebase_id === user?.firebase_id);

        if (!isInMeeting) {
          history.push("/meetings", { isNotValidMeeting: true });
        } else {
          updateMeetingInformation();
        }
      }
    }
  }

  const updateMeetingInformation = () => {
    setMeetingTitle(meetingInfo?.title);
    setCreator(meetingInfo?.creator.name || meetingInfo?.creator.email);
    setTime(`${getCurrentDateShortString(new Date(Date.parse(meetingInfo.date[0])))} - 
    ${getCurrentDateShortString(new Date(Date.parse(meetingInfo.date[1])))}`);

    dispatch(doGetMeetingMinutes({
      meetingID: paramMeetingID
    }))
  }

  return (
    <div className="meeting-minute-dashboard">
      <div className="meeting-minute-dashboard">
        <h1 className="meeting-minute-dashboard__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
        </h1>

        <span>
          {isBonding ? <span
            style={{ color: "var(--theme-green)", marginRight: "4px" }}
          >bonding</span> : "meeting "}

          <span style={{ color: "#999999" }}>host by {creator}{' '}</span>

          <span>at {time}</span>
        </span>

        <div className="meeting-minute-dashboard__action-polling__options">
          {minutesList.map((minute: any, index: any) => {
            return <div className="meeting-minute-dashboard__action-polling__options--single">
              <MinuteCard
                minuteID={minute._id}
                meetingID={minute.meetingID}
                title={minute.title}
                description={minute.description}
                creator={minute.creator}
                created={minute.createdAt}
                lastUpdated={minute.updatedAt}
                isAddCard={false}
                addAction={() => {
                  history.push(`/meeting-minute/${minute.meetingID}/${minute._id}`)
                }}
              ></MinuteCard>
            </div>
          })}
          <MinuteCard
            isAddCard={true}
            addAction={() => {
              history.push(`/meeting-minute/${paramMeetingID}/-1`)
            }}
          ></MinuteCard>
        </div >
      </div>
    </div>
  )
};