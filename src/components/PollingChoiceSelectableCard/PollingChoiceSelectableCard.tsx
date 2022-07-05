import './PollingChoiceSelectableCard.scss';
import React, { useEffect, useState } from 'react';
import { faMapMarkerAlt, faLink, faUtensils, faGamepad, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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
  editableMeeting
}) => {
  const history = useHistory();
  const MySwal = withReactContent(Swal);

  const reviewSelectors = () => {
    MySwal.fire({
      title: 'List of selectors',
      html: `
          <div class="text-center colab-details">
              
          </div>
      `,
      didOpen: () => {
        let colabList = document.querySelector(".colab-details");
        let listHTML = ``;
        selectors.forEach((selector: any) => {
          listHTML += `
                  <div class="colab-result">
                      <div class="row">
                          <div class="col-md-4 col-sm-6 offset-md-0 offset-sm-3">
                              <img src="${selector.image}" alt="" class="des-result-img">
                          </div>
                          <div class="col-md-8 col-sm-12 d-flex align-items-center justify-content-center justify-content-md-start">
                              <div class="text-md-left text-center">
                                  <h5 class="text-pink">${selector.name}</h5>
                                  <p class="text-gray">${selector.email}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              `
        })
        colabList.innerHTML = listHTML;
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  return (
    <>
      {isAddCard && <div className={`polling-choice-selectable-card--add`} onClick={() => { if (addAction) addAction(); }}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>}

      {!isAddCard && <div className={`polling-choice-selectable-card 
      ${isSelected ? "polling-choice-selectable-card--selected" : ""}
      ${(!isSelected && !isSelectable) ? "polling-choice-selectable-card--not-selectable" : ""}`}
        onClick={(e: any) => {
          if (editableMeeting && editableMeeting === true) {
            if (!e.target.classList.contains("polling-choice-selectable-card__participants")
              && !e.target.classList.contains("polling-choice-selectable-card__participant")) {
              if (!isSelected) {
                if (isSelectable) {
                  setSelected();
                }
              } else {
                setSelected();
              }
            }
          }
        }}
        onContextMenu={(e: any) => {
          e.preventDefault();
          if (editableMeeting && editableMeeting === true) {
            if (isEditable && editAction) {
              editAction(choiceID);
            }
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

        {selectors?.length > 0 && <div className="polling-choice-selectable-card__participants" onClick={() => reviewSelectors()}>
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
