import './PollingChoiceCard.scss';
import React, { useEffect, useState } from 'react';
import { faMapMarkerAlt, faLink, faUtensils, faGamepad, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';

export const PollingChoiceCard: React.FC<IPollingChoiceCard> = ({
  meetingID,
  choiceID,
  type,
  title,
  link,
  location,
  selectors,
  description,
  isAddCard,
  addAction,
  editAction
}) => {
  const history = useHistory();

  return (
    <>
      {isAddCard && <div className={`polling-choice-card--add`} onClick={() => { if (addAction) addAction(); }}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>}
      {!isAddCard && <div className={`polling-choice-card`}
        onContextMenu={(e: any) => {
          e.preventDefault();
          if (editAction) editAction(choiceID);
        }}>
        <h3 className="polling-choice-card__title">{title}</h3>

        <div className="polling-choice-card__info">
          <div className="polling-choice-card__info--detail">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <p className={`polling-choice-card__info--detail__text`}>
              {location}
            </p>
          </div>
          {link !== "" && <div className="polling-choice-card__info--detail">
            <FontAwesomeIcon icon={faLink} />
            <a href={link} target="_blank" className={`polling-choice-selectable-card__info--detail__text`}>
              {link}
            </a>
          </div>}
        </div>

        <div className="polling-choice-card__description">
          {description}
        </div>

        <div className="polling-choice-card__icon">
          <FontAwesomeIcon icon={type === 0 ? faUtensils : faGamepad}></FontAwesomeIcon>
        </div>
      </div>}
    </>
  );
};
