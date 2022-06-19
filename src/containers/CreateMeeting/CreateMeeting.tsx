import './CreateMeeting.scss';
import React, { useEffect, useState } from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CreateMeeting: React.FC<ICreateMeeting> = ({ }) => {
  document.title = "How2Meet? | New Meeting";

  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);

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
          rows={1}>
        </textarea>

      </div>}

      <button className="create-meeting__next" onClick={() => {
        setCurrentPage(currentPage + 1);
      }}>
        <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
      </button>
    </div >
  );
};