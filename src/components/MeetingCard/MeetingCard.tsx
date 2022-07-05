import './MeetingCard.scss';
import React, { useEffect, useState } from 'react';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { isMeetingAvailableForEdit } from '../../helpers/date';

export const MeetingCard: React.FC<IMeetingCard> = ({
  meetingID,
  isCurrent,
  type,
  title,
  time,
  location,
  participants,
  isHost,
  getDates
}) => {
  const history = useHistory();

  return (
    <div className={`meeting-card ${type === 0 ? "meeting-card--blue" : "meeting-card--green"}`}
      onClick={() => {
        if (isHost) {
          if (isMeetingAvailableForEdit((getDates as any)[0])) {
            history.push(`edit-meeting/${meetingID}`)
          } else {
            history.push(`meeting/${meetingID}`)
          }
        } else {
          history.push(`meeting/${meetingID}`)
        }
      }}>
      <p className="meeting-card__type">{type === 0 ? "Meeting" : "Bonding"}</p>
      <p className="meeting-card__title">{title}</p>

      <div className={`meeting-card__info ${location !== "" ? "meeting-card__info--2-rows" : ""}`}>
        <div className="meeting-card__info--detail">
          <FontAwesomeIcon icon={faClock} />
          <p className={`meeting-card__info--detail__text ${isCurrent ? "meeting-card__info--detail__text--current" : ""}`}>
            {isCurrent ? "awaiting responses..." : time}
          </p>
        </div>
        {location !== "" && <div className="meeting-card__info--detail">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <p className={`meeting-card__info--detail__text ${isCurrent ? "meeting-card__info--detail__text--current" : ""}`}>
            {isCurrent ? "awaiting responses..." : location}
          </p>
        </div>}
      </div>

      <div className="meeting-card__participants">
        {participants?.map((participant, index) => (
          <img
            className="meeting-card__participant"
            src={participant.image}
            style={{
              zIndex: index + 1
            }}></img>
        ))}
      </div>
    </div >
  );
};
