import './EditAccount.scss';
import React, { useEffect, useState } from 'react';
import { Input } from '../../components/Input/Input';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../configs/firebase';
import { doGetUserByFirebaseID, doUpdateMeetingParticipantsProfile, doUpdateProfile, RootState, useAppDispatch } from '../../redux';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const EditAccount: React.FC<IEditAccount> = ({ }) => {
  document.title = "How2Meet? | Edit Account";

  const dispatch = useAppDispatch();
  const { user, isUpdateProfile, updateProfileSuccess } = useSelector(
    (state: RootState) => state.loginSlice,
  );
  const MySwal = withReactContent(Swal);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('firebase_id'))
      dispatch(doGetUserByFirebaseID({
        firebase_id: localStorage.getItem('firebase_id') || ''
      }))
  }, []);

  useEffect(() => {
    if (user?.email) {
      setEmail(user?.email || "");
      setName(user?.name || "");
      setImage(user?.image || "");
    }
  }, [user]);

  useEffect(() => {
    if (!isUpdateProfile && updateProfileSuccess) {
      setCalledUpdated(false);
      MySwal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Your profile is updated!',
      })
        .then(() => {
          history.push("/meetings")
          return;
        })
    } else if (calledUpdated && !isUpdateProfile && !updateProfileSuccess) {
      MySwal.fire({
        icon: 'error',
        title: 'Error...',
        text: "Cannot update profile",
      })
    }
  }, [isUpdateProfile, updateProfileSuccess]);

  //Values
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [calledUpdated, setCalledUpdated] = useState<boolean>(false);

  //Errors
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");

  //Helper functions
  const handleInputChange = async (e: any) => {
    //Upload images to firebase
    Array.from(e.target.files).forEach(async (file: any) => {
      let uploadPromise = upload(file).then((url: any) => {
        setImage(url.default);
        setImageError("");
      })

      toast.promise(
        uploadPromise,
        {
          pending: 'Uploading image',
          success: `Uploaded successfully!`,
          error: 'Error occured',
        },
        {
          success: {
            duration: 5000,
            icon: '🔥',
          },
        } as any
      );
    })
  }

  const upload = async (file: any) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `/accounts/${file.name}-${Date.now()}`)
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        function (snapshot) {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        function (error) {
          setImageError("Error occured");
          switch (error.code) {
            case "storage/unauthorized":
              reject("User doesn't have permission to access the object");
              break;

            case "storage/canceled":
              reject("User canceled the upload");
              break;

            case "storage/unknown":
              reject("Unknown error occurred, inspect error.serverResponse");
              break;
          }
        },
        function () {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve({
              default: downloadURL
            });
          })
        }
      );
    })
  }

  const uploadImage = () => {
    document?.getElementById('uploadImage')?.click();
  }

  const validateAndSave = () => {
    if (name === "") {
      setNameError("Cannot be empty");
      return;
    }

    if (image === "" || imageError !== "") {
      setImageError("Cannot be empty");
      return;
    }

    //Valid
    setCalledUpdated(true);
    dispatch(doUpdateProfile({
      firebase_id: user?.firebase_id,
      email: email,
      password: "",
      image: image,
      name: name
    }));

    dispatch(doUpdateMeetingParticipantsProfile({
      firebase_id: user?.firebase_id,
      email: email,
      password: "",
      image: image,
      name: name
    }));
  }

  return (
    <div className="edit-account">
      <h1 className="edit-account__title">Edit Account</h1>

      <div className="edit-account__form">
        <Input
          type="email"
          required={true}
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value);
          }}
          label="email"
          error={emailError}
          readonly={true}
        ></Input>

        <Input
          type="text"
          required={true}
          value={name}
          onChange={(e: any) => {
            setName(e.target.value);
          }}
          label="name"
          error={nameError}
        ></Input>

        <div className="edit-account__image--block">
          <img className="edit-account__image"
            src={image}
            onClick={() => uploadImage()}
          >

          </img>
          <p className="edit-account__image--error">{imageError}</p>
        </div>

        <input style={{ display: "none" }} type='file' id="uploadImage" name="uploadImage"
          onChange={handleInputChange} />

        <div className="edit-account__save-btn">
          <button
            className="edit-account__save"
            onClick={() => validateAndSave()}
          >
            Save
          </button>
        </div>
      </div>

      <ToastContainer />
    </div >
  );
};