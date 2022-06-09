import './RegisterPage.scss';
import { Input } from '../../components/Input/Input'
import LogoGoogle from '../../assets/images/google_logo.svg';
import LogoHow2Meet from '../../assets/images/logo.svg';

import React, { useEffect, useState } from 'react';
import { signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, logout, onAuthStateChanged, auth } from '../../configs/firebase';
import { useHistory } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateEmail } from '../../helpers/validate';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const RegisterPage: React.FC<ILoginPage> = ({ }) => {
  document.title = "How2Meet? | Register"

  const history = useHistory();
  const MySwal = withReactContent(Swal);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      //SIGN OUT IF LOGGED IN
      if (user) {
        logout();
      }
    });
  }, []);

  const validateAndRegister = async () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

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

    if (confirmPassword.length < 6) {
      setConfirmPasswordError("invalid");

      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Confirmation of password is not valid!',
      })

      return;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("invalid");

      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Confirmation of password is not valid!',
      })

      return;
    }

    await registerWithEmailAndPassword(email, password)
      .then(async (result: any) => {
        MySwal.close();

        MySwal.fire({
          icon: 'success',
          title: 'Success...',
          text: 'Your account is created! Please check your email to verify your account!',
        })
          .then(() => {
            logout();
            return;
          })
      })
      .catch((error: any) => {
        MySwal.close();

        if (error.code == "auth/missing-email") {
          setEmailError("invalid");

          MySwal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Please type in your email!',
          })

          return;
        }
        if (error.code == "auth/invalid-email") {
          setEmailError("invalid");

          MySwal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Your email is invalid!',
          })

          return;
        }
        if (error.code == "auth/email-already-in-use") {
          setEmailError("invalid");

          MySwal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Email is already in use!',
          })

        }

        MySwal.fire({
          icon: 'error',
          title: 'Error...',
          text: error.message,
        })
      });
  }

  return (
    <div className="container-fluid p-0 m-0">
      <div className="register-page row">
        <div className="register-page__image col-md-6 col-sm-0 d-md-flex">
          <img src={LogoHow2Meet} className="register-page__image__logo"></img>
        </div>

        <div className="register-page__form col-md-6 col-sm-0">
          <div className="register-page__top-form">
            <h2 className="register-page__form__title">sign in</h2>
            <p className="register-page__form__light">already have an account?
              {" "}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                history.push("/auth")
              }}>sign in</a>
            </p>

            <button className="register-page__btn--google d-flex align-items-center justify-content-center"
              onClick={signInWithGoogle} >
              <img src={LogoGoogle} alt=""
                className="register-page__img-google-logo"
              />
              continue with Google
            </button>
          </div>

          <hr className="register-page__divider"></hr>

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

            <Input
              type="password"
              required={true}
              value={confirmPassword}
              onChange={(e: any) => {
                setConfirmPassword(e.target.value);
              }}
              label="confirm password"
              error={confirmPasswordError}
            ></Input>
          </div>

          <button className="register-page__btn--submit" onClick={() => {
            validateAndRegister();
          }}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

        </div>
      </div>
    </div >
  );
};
