import './Footer.scss';
import Logo from '../../assets/images/logo.png';

import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useResposive } from '../../helpers/useResponsive';

export const Footer: React.FC<IFooter> = ({ }) => {
  const [isShowingMenu, setIsShowingMenu] = useState<boolean>(false);
  const corrupted = useRef<boolean>(false);
  const history = useHistory();
  const { isFromMobile } = useResposive();

  return (
    <div className="footer">
      <img className="footer__profile-img" src={Logo}
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

      <div className={`footer__menu ${isShowingMenu ? "footer__menu--show" : ""}`}
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
          <li onClick={() => { history.push("/meetings") }}>Dashboard</li>
          <li onClick={() => { history.push("/new-meeting") }}>New meeting</li>
          <li onClick={() => { history.push("/logout") }}>Log out</li>
        </ul>
      </div>
    </div >
  );
};
