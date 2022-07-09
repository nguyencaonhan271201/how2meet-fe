import './MinuteCard.scss';
import React, { useEffect, useState } from 'react';
import { faMapMarkerAlt, faLink, faUtensils, faGamepad, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { getCurrentDateFullString } from '../../helpers/date';

export const MinuteCard: React.FC<IMeetingMinuteCard> = ({
  meetingID,
  minuteID,
  creator,
  created,
  lastUpdated,
  title,
  description,
  isAddCard,
  addAction,
}) => {
  const history = useHistory();

  return (
    <>
      {isAddCard && <div className={`polling-choice-card--add`} onClick={() => { if (addAction) addAction(); }}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>}
      {!isAddCard && <div className={`minute-card`}
        // onContextMenu={(e: any) => {
        //   e.preventDefault();
        // }}
        onClick={() => {
          history.push(`/meeting-minute/${meetingID}/${minuteID}`)
        }}>
        <h3 className="minute-card__title">{title}</h3>

        <div className="minute-card__info">
          <div className="minute-card__info--detail">
            <p className={`minute-card__info--detail__text`}>
              {getCurrentDateFullString(new Date(created))}
            </p>
          </div>

        </div>

        <div className="minute-card__description">
          {description}
        </div>

        <div className="minute-card__creator">
          <img
            className="minute-card__participant"
            src={creator.image}
          ></img>
          <p>{creator.name || creator.image}</p>
        </div>
      </div>}
    </>
  );
};
