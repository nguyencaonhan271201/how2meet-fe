import './FooterNoFixed.scss';
import Logo from '../../assets/images/logo.png';

import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useResposive } from '../../helpers/useResponsive';
import { logout } from '../../configs/firebase';
import { RootState, useAppDispatch } from '../../redux';
import { doGetUserByFirebaseID } from '../../redux/slice/apiSlice/loginSlice';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faChartLine, faPlus, faPenToSquare, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const FooterNoFixed: React.FC<IFooter> = ({ }) => {
  const [isShowingMenu, setIsShowingMenu] = useState<boolean>(false);
  const corrupted = useRef<boolean>(false);
  const history = useHistory();
  const { isFromMobile } = useResposive();
  const dispatch = useAppDispatch();
  const user = useSelector(
    (state: RootState) => state.loginSlice.user,
  );

  useEffect(() => {
    if (localStorage.getItem('firebase_id'))
      dispatch(doGetUserByFirebaseID({
        firebase_id: localStorage.getItem('firebase_id') || ''
      }))
  }, []);

  return (
    <div className="footer-no-fixed">
      <img className="footer-no-fixed__profile-img" src={user?.image || Logo}
        onMouseOver={() => {
          if (isFromMobile) {
            corrupted.current = true;
            setIsShowingMenu(true);
          }
        }}
        onMouseOut={() => {
          if (isFromMobile) {
            corrupted.current = false;
            setTimeout(() => {
              if (!corrupted.current) {
                setIsShowingMenu(false);
              }
            }, 500);
          }
        }}
        onClick={() => {
          if (!isFromMobile) {
            setIsShowingMenu(!isShowingMenu);
          }
        }}
      ></img>

      <p style={{ marginBottom: 0, marginLeft: 10 }}>{user?.name || user?.email}</p>

      <div className={`footer-no-fixed__menu ${isShowingMenu ? "footer-no-fixed__menu--show" : ""}`}
        onMouseOver={() => {
          if (isFromMobile) {
            corrupted.current = true;
            setIsShowingMenu(true);
          }
        }}
        onMouseOut={() => {
          if (isFromMobile) {
            corrupted.current = false;
            setTimeout(() => {
              if (!corrupted.current) {
                setIsShowingMenu(false);
              }
            }, 500);
          }
        }}
        onClick={() => {
          if (!isFromMobile) {
            setIsShowingMenu(!isShowingMenu);
          }
        }}>
        <ul>
          <li onClick={() => { history.push("/meetings") }}><FontAwesomeIcon icon={faTableList}></FontAwesomeIcon></li>
          <li onClick={() => { history.push("/meetings/statistics") }}><FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon></li>
          <li onClick={() => { history.push("/new-meeting") }}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></li>
          <li onClick={() => { history.push("/edit-account") }}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></li>
          <li onClick={() => { logout(); history.push("/"); }}><FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon></li>
        </ul>
      </div>
    </div >
  );
};
