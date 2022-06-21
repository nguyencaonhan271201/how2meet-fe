import './MeetingDashboard.scss';
import React, { useEffect, useState } from 'react';
import { Footer } from '../../components/Footer/Footer';
import { MeetingCard } from '../../components/MeetingCard/MeetingCard';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';

export const MeetingDashboard: React.FC<IMeetingDashboard> = ({ }) => {
  document.title = "How2Meet? | Meetings";
  //const [currentList, setCurrentList] = useState<Array<any>>([]);
  //const [archivedList, setArchivedList] = useState<Array<any>>([]);
  const history = useHistory();

  let currentList = [
    {
      meetingID: 0,
      type: 0,
      title: "Test",
      time: "",
      location: "",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    },
    {
      meetingID: 0,
      type: 1,
      title: "Test",
      time: "",
      location: "",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    },
    {
      meetingID: 0,
      type: 0,
      title: "Test",
      time: "",
      location: "",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    },
    {
      meetingID: 0,
      type: 1,
      title: "Test",
      time: "",
      location: "",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    }
  ]

  let archivedList = [
    {
      meetingID: 0,
      type: 0,
      title: "Test",
      time: "17/01/22",
      location: "Baozi",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    },
    {
      meetingID: 0,
      type: 1,
      title: "Test",
      time: "17/01/22",
      location: "Baozi",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    },
    {
      meetingID: 0,
      type: 0,
      title: "Test",
      time: "17/01/22",
      location: "Baozi",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    },
    {
      meetingID: 0,
      type: 1,
      title: "Test",
      time: "17/01/22",
      location: "Baozi",
      status: 0,
      participants: [
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
        },
        {
          name: "Nhan Nguyen Cao",
          profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
        }
      ],
    }
  ]

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
            {currentList.map(meeting => (
              <MeetingCard
                meetingID={meeting.meetingID}
                isCurrent={true}
                type={meeting.type}
                title={meeting.title}
                time={meeting.time}
                location={meeting.location}
                participants={meeting.participants}
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
                meetingID={meeting.meetingID}
                isCurrent={false}
                type={meeting.type}
                title={meeting.title}
                time={meeting.time}
                location={meeting.location}
                participants={meeting.participants}
              ></MeetingCard>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};