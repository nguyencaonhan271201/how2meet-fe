import './LoginPage.scss';
import { Input } from '../../components/Input/Input'
import LogoGoogle from '../../assets/images/google_logo.svg';
import LogoHow2Meet from '../../assets/images/logo.svg';

import React, { useEffect, useState } from 'react';
import { signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, logout, onAuthStateChanged, auth } from '../../configs/firebase';
import { useHistory, useLocation } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateEmail } from '../../helpers/validate';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const LoginPage: React.FC<ILoginPage> = ({ }) => {
  document.title = "How2Meet? | Login"

  const history = useHistory();
  const location = useLocation() as any;
  const MySwal = withReactContent(Swal);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  useEffect(() => {
    logout();

    if (location?.state?.isRedirect) {
      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Please log in to continue!',
      })
    }
  }, []);

  const validateLogin = async () => {
    setEmailError("");
    setPasswordError("");

    MySwal.showLoading();

    if (!validateEmail(email)) {
      setEmailError("invalid");

      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Email is not valid!',
      })

      return;
    }

    if (password.length < 6) {
      setPasswordError("invalid");

      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Password is not valid!',
      })

      return;
    }

    await logInWithEmailAndPassword(email, password)
      .then(async (result: any) => {
        MySwal.close();

        if (!result.user?.emailVerified) {
          MySwal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Please verify your account through email!',
          })
            .then(() => {
              logout();
              return;
            })
        }

        //Valid login
        localStorage.setItem("firebaseLoggedIn", "1");
        history.push("/meetings");
      })
      .catch((error: any) => {
        MySwal.close();

        if (error.code === "auth/user-not-found") {
          MySwal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Your login information is not correct!',
          })
          return;
        }

        if (error.code === "auth/invalid-email") {
          setEmailError("invalid");
          MySwal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Your email is invalid!',
          })
          return;
        }
        if (error.code === "auth/wrong-password") {
          setPasswordError("invalid");
          MySwal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Your password is not correct!',
          })
          return;
        }

        MySwal.fire({
          icon: 'error',
          title: 'Error...',
          text: error.message,
        })
        return;
      });
  }

  return (
    <div className="container-fluid p-0 m-0">
      <div className="login-page row">
        <div className="login-page__image col-md-6 col-sm-0 d-md-flex">
          <img src={LogoHow2Meet} className="login-page__image__logo"></img>
        </div>

        <div className="login-page__form col-md-6 col-sm-0">
          <div className="login-page__top-form">
            <h2 className="login-page__form__title">sign in</h2>
            <p className="login-page__form__light">don't have an account?
              {" "}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                history.push("/auth/register")
              }}>sign up</a>
            </p>

            <button className="login-page__btn--google d-flex align-items-center justify-content-center"
              onClick={signInWithGoogle} >
              <img src={LogoGoogle} alt=""
                className="login-page__img-google-logo"
              />
              continue with Google
            </button>
          </div>

          <hr className="login-page__divider"></hr>

          <div className="p-3">
            <Input
              type="email"
              required={true}
              value={email}
              onChange={(e: any) => {
                setEmail(e.target.value);
              }}
              label="email"
              error={emailError}
            ></Input>

            <Input
              type="password"
              required={true}
              value={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
              }}
              label="password"
              error={passwordError}
            ></Input>
          </div>

          <button className="login-page__btn--submit" onClick={() => {
            validateLogin();
          }}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

        </div>
      </div>
    </div >
  );
};
