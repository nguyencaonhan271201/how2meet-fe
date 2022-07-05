import './MeetingDashboard.scss';
import React, { useEffect, useState } from 'react';
import { Footer } from '../../components/Footer/Footer';
import { MeetingCard } from '../../components/MeetingCard/MeetingCard';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useLocation } from 'react-router-dom';
import { doGetMeetings, doGetUserByFirebaseID, RootState, useAppDispatch } from '../../redux';
import { useSelector } from 'react-redux';
import { getCurrentDateFullString } from '../../helpers/date';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const MeetingDashboard: React.FC<IMeetingDashboard> = ({ }) => {
  document.title = "How2Meet? | Meetings";

  const [futureList, setFutureList] = useState<Array<any>>([]);
  const [currentList, setCurrentList] = useState<Array<any>>([]);
  const [archivedList, setArchivedList] = useState<Array<any>>([]);

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

    if (location?.state?.isNotValidMeeting) {
      MySwal.fire({
        icon: 'error',
        title: 'Permission denied...',
        text: 'You are not allowed to access this meeting!!!',
      })
    }
  }, []);

  useEffect(() => {
    if (user?.firebase_id) {
      dispatch(doGetMeetings({
        firebase_id: user.firebase_id
      }))
    }
  }, [user]);

  useEffect(() => {
    let getCurrentList = [] as any;
    let getArchivedList = [] as any;
    let getFutureList = [] as any;

    meetings?.forEach((meeting: any) => {
      let startDate = new Date(meeting.date[0]);
      if (startDate) {
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
      }

      let endDate = new Date(meeting.date[1]);
      if (endDate) {
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
      }

      if (endDate > new Date(Date.now())) {
        getCurrentList.push(meeting);
      } else {
        getArchivedList.push(meeting);
      }
    })

    setCurrentList(getCurrentList);
    setArchivedList(getArchivedList);
    setFutureList(getFutureList);
  }, [meetings]);

  return (
    <div className="meetings">
      <div className="meetings__add-btn"
        onClick={() => {
          history.push("/new-meeting");
        }}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>

      <div className="meetings__current">
        <h1 className="meetings__title">CURRENT</h1>

        <div className="meetings__list--container">
          <div className="meetings__list">
            {currentList.map((meeting: any) => (
              <MeetingCard
                isHost={meeting.creator.firebase_id === user?.firebase_id}
                meetingID={meeting.meetingID}
                isCurrent={false}
                type={meeting.isBonding ? 1 : 0}
                title={meeting.title}
                time={`${getCurrentDateFullString(new Date(Date.parse(meeting.date[0])))} - 
                ${getCurrentDateFullString(new Date(Date.parse(meeting.date[1])))}`}
                location={meeting.location}
                participants={meeting.invitators}
                getDates={meeting.date}
              ></MeetingCard>
            ))}
          </div>
        </div>
      </div>

      <div className="meetings__archived">
        <h1 className="meetings__title">ARCHIVED</h1>

        <div className="meetings__list--container">
          <div className="meetings__list">
            {archivedList.map(meeting => (
              <MeetingCard
                isHost={meeting.creator.firebase_id === user?.firebase_id}
                meetingID={meeting.meetingID}
                isCurrent={false}
                type={meeting.isBonding ? 1 : 0}
                title={meeting.title}
                time={`${getCurrentDateFullString(new Date(Date.parse(meeting.date[0])))} - 
              ${getCurrentDateFullString(new Date(Date.parse(meeting.date[1])))}`}
                location={meeting.location}
                participants={meeting.invitators}
                getDates={meeting.date}
              ></MeetingCard>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};