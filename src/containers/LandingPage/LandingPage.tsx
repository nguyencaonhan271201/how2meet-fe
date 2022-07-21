import './LandingPage.scss';
import React, { useEffect, useState } from 'react';
import Logo from './../../assets/images/logo.png';
import { useHistory } from 'react-router-dom';

export const LandingPage: React.FC<ILandingPage> = ({ }) => {
  document.title = "How2Meet?";

  const [currentOption, setCurrentOption] = useState<number>(0);
  const [currentDisplaySubtitle, setCurrentDisplaySubtitle] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const history = useHistory();

  const listOfSubtitles = [
    "plan date and time",
    "create options poll",
    "pick free time slots",
    "store images",
    "write minutes"
  ]

  useEffect(() => {
    const TIMEOUT = currentDisplaySubtitle.length === listOfSubtitles[currentOption].length ? 1000 : 100;
    setTimeout(() => {
      type();
    }, TIMEOUT);
  }, [currentDisplaySubtitle])

  useEffect(() => {
    setTimeout(() => {
      type();
    }, 200);
  }, [currentOption])

  const type = () => {
    if (isTyping) {
      if (currentDisplaySubtitle.trim().length < listOfSubtitles[currentOption].length) {
        let updateDisplaySubtitle = currentDisplaySubtitle + listOfSubtitles[currentOption][currentDisplaySubtitle.length];
        setCurrentDisplaySubtitle(updateDisplaySubtitle);
      } else {
        setIsTyping(false);
        let updateDisplaySubtitle = currentDisplaySubtitle.substring(0, currentDisplaySubtitle.length - 1);
        setCurrentDisplaySubtitle(updateDisplaySubtitle);
      }
    } else {
      if (currentDisplaySubtitle.length > 0) {
        let updateDisplaySubtitle = currentDisplaySubtitle.substring(0, currentDisplaySubtitle.length - 1);
        setCurrentDisplaySubtitle(updateDisplaySubtitle);
      } else {
        setCurrentOption(currentOption === 4 ? 0 : currentOption + 1);
        setIsTyping(true);
      }
    }
  }

  return (
    <div className="landing-page">
      <img
        alt="logo"
        src={Logo}
        className="landing-page__logo"
        onClick={() => {
          history.push("/auth")
        }}></img>

      <div className="landing-page__overlay"></div>

      <div className="landing-page__container">
        <p className="landing-page__title">The solution you need to have a perfect meeting.</p>
        <span className="landing-page__subtitle-block">
          <span style={{ opacity: 0 }}>a</span>
          <span className="landing-page__subtitle">{currentDisplaySubtitle}</span>
          <span className="landing-page__cursor"></span>
        </span>
      </div>

      <div className="landing-page__container">
        <button
          className="landing-page__join-us"
          onClick={() => {
            history.push("/auth")
          }}
        >
          Join us
        </button>
      </div>
    </div>
  );
};
