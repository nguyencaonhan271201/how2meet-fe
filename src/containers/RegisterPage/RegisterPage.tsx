import './RegisterPage.scss';
import { Input } from '../../components/Input/Input'
import LogoGoogle from '../../assets/images/google_logo.svg';
import LogoHow2Meet from '../../assets/images/logo.svg';

import React, { useEffect, useState } from 'react';
import { signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, logout, onAuthStateChanged, auth, googleProvider } from '../../configs/firebase';
import { useHistory } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateEmail } from '../../helpers/validate';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { useAppDispatch } from '../../redux';
import { doPostNewUser } from '../../redux/slice/apiSlice/loginSlice';

export const RegisterPage: React.FC<ILoginPage> = ({ }) => {
  document.title = "How2Meet? | Register"

  const history = useHistory();
  const MySwal = withReactContent(Swal);
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  useEffect(() => {
    logout();
  }, []);

  const validateAndRegister = async () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    MySwal.fire({
      didOpen: () => {
        MySwal.showLoading();
      },
      didClose: () => {
        MySwal.hideLoading();
      },
      allowOutsideClick: false,
    })


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

    await createUserWithEmailAndPassword(auth, email, password)
      .then((user: any) => {
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser)
            .then((result: any) => {
              MySwal.close();

              dispatch(doPostNewUser({
                firebase_id: user.user.uid,
                email: email,
                password: '',
                image: 'https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&token=e9312c19-c34e-4a87-9a72-552532766cde',
                name: ''
              }))

              localStorage.setItem('firebase_id', user.user.uid);

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
            .catch((err: any) => {
              MySwal.fire({
                icon: 'error',
                title: 'Error...',
                text: err.message,
              })
            });
        }
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

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user as any;

      dispatch(doPostNewUser({
        firebase_id: user.uid,
        email: user?.reloadUserInfo?.providerUserInfo?.[0].email,
        password: '',
        image: user?.reloadUserInfo?.providerUserInfo?.[0].photoUrl,
        name: user?.reloadUserInfo?.providerUserInfo?.[0].displayName
      }))

      localStorage.setItem('firebase_id', user.uid);
      localStorage.setItem("firebaseLoggedIn", "1");

      if (!localStorage.getItem("pendingMeetingID")) {
        history.push('/meetings');
      } else {
        let meetingID = localStorage.getItem("pendingMeetingID");
        localStorage.removeItem("pendingMeetingID");
        history.push(`/meeting/${meetingID}`, { isFromMissingLogin: true });
      }

    } catch (err: any) {
      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: err.message,
      })
    }
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
