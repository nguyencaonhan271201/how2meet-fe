import './PollingChoiceSelectableCard.scss';
import React, { useEffect, useState } from 'react';
import { faMapMarkerAlt, faLink, faUtensils, faGamepad, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';

export const PollingChoiceSelectableCard: React.FC<IPollingChoiceSelectableCard> = ({
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
  isSelected,
  setSelected,
  isSelectable,
  isEditable,
  editAction,
}) => {
  const history = useHistory();

  return (
    <>
      {isAddCard && <div className={`polling-choice-selectable-card--add`} onClick={() => { if (addAction) addAction(); }}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>}

      {!isAddCard && <div className={`polling-choice-selectable-card 
      ${isSelected ? "polling-choice-selectable-card--selected" : ""}
      ${(!isSelected && !isSelectable) ? "polling-choice-selectable-card--not-selectable" : ""}`}
        onClick={() => {
          if (!isSelected) {
            if (isSelectable) {
              setSelected();
            }
          } else {
            setSelected();
          }
        }}
        onContextMenu={(e: any) => {
          e.preventDefault();
          if (isEditable && editAction) {
            editAction(choiceID);
          }
        }}
      >
        <h3 className="polling-choice-selectable-card__title">{title}</h3>

        <div className="polling-choice-selectable-card__info">
          <div className="polling-choice-selectable-card__info--detail">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <p className={`polling-choice-selectable-card__info--detail__text`}>
              {location}
            </p>
          </div>
          {link !== "" && <div className="polling-choice-selectable-card__info--detail">
            <FontAwesomeIcon icon={faLink} />
            <a href={link} target="_blank" className={`polling-choice-selectable-card__info--detail__text`}>
              {link}
            </a>
          </div>}
        </div>

        <div className="polling-choice-selectable-card__description">
          {description}
        </div>

        <div className="polling-choice-selectable-card__icon">
          <FontAwesomeIcon icon={type === 0 ? faUtensils : faGamepad}></FontAwesomeIcon>
        </div>

        {selectors?.length > 0 && <div className="polling-choice-selectable-card__participants">
          {selectors?.map((participant, index) => (
            <img
              className="polling-choice-selectable-card__participant"
              src={participant.image}
              style={{
                zIndex: index + 1
              }}></img>
          ))}
          <p style={{ margin: 0, marginLeft: 5 }}>{selectors?.length}</p>
        </div>}
      </div>}
    </>
  );
};
