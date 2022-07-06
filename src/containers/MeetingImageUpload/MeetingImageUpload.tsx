import './MeetingImageUpload.scss';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { faPlus, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage"
import { storage } from "../../configs/firebase"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';
import { doGetMeetingByMeetingID, doGetMeetingImages, doGetUserByFirebaseID, RootState, useAppDispatch } from '../../redux';
import { getCurrentDateShortString } from '../../helpers/date';

export const MeetingImageUpload: React.FC<IMeetingImageUpload> = ({ }) => {
  document.title = "How2Meet? | Meeting Image";
  let { id: paramMeetingID } = useParams() as any;

  const { user } = useSelector(
    (state: RootState) => state.loginSlice,
  );
  const { isGettingMeetingImages, getMeetingImagesSuccess, meetingImages } = useSelector(
    (state: RootState) => state.meetingSlice,
  );
  const { meetingByID: meetingInfo } = useSelector(
    (state: RootState) => state.meetingSlice,
  );

  const [imageBoxClass, setImageBoxClass] = useState<string>("");
  const [imageBoxURL, setImageBoxURL] = useState<string>("");
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [isBonding, setIsBonding] = useState<boolean>(true);
  const [creator, setCreator] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [imagesList, setImagesList] = useState<Array<any>>([]);
  const MySwal = withReactContent(Swal);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [update, setUpdate] = useState<number>(0);
  const [removedList, setRemovedList] = useState<Array<string>>();

  //Hooks
  useEffect(() => {
    if (localStorage.getItem('firebase_id'))
      dispatch(doGetUserByFirebaseID({
        firebase_id: localStorage.getItem('firebase_id') || ''
      }))

    MySwal.fire({
      didOpen: () => {
        MySwal.showLoading();
      },
      didClose: () => {
        MySwal.hideLoading();
      },
      allowOutsideClick: false,
    })

    //This function checks whether the current user has the right to access the meeting
    //Or navigate in case the meeting is public
    dispatch(doGetMeetingByMeetingID({
      meetingID: paramMeetingID
    }))
  }, []);

  useEffect(() => {
    if (((localStorage.getItem('firebase_id') && user) || !localStorage.getItem('firebase_id'))
      && meetingInfo && Object.keys(meetingInfo).length !== 0) {
      checkForAccessRights();
    }
  }, [meetingInfo, user])

  useEffect(() => {
    if (((localStorage.getItem('firebase_id') && user) || !localStorage.getItem('firebase_id'))
      && meetingInfo && Object.keys(meetingInfo).length !== 0) {
      checkForAccessRights();
    }
  }, [user])

  useEffect(() => {
    if (getMeetingImagesSuccess) {
      let imagesList = [];

      meetingImages.forEach((image: any) => {
        imagesList.push({
          ...image,
          isNew: false
        })
      });

      setImagesList(imagesList);
    }
  }, [getMeetingImagesSuccess]);

  useEffect(() => {
    console.log(imagesList);
  }, [imagesList]);

  //Helper functions
  const checkForAccessRights = () => {
    MySwal.close();

    let isPublic = meetingInfo?.isPublic;

    if (!isPublic) {
      //PRIVATE MEETING
      if (!localStorage.getItem("firebaseLoggedIn") || localStorage.getItem("firebaseLoggedIn") === "0") {
        //Not signed in
        history.push("/auth", { isRedirect: true });
        return;
      } else {
        //Check if is set for the current meeting
        let isInMeeting = meetingInfo?.invitators?.some((invitator: any) => invitator.firebase_id === user?.firebase_id);
        if (!isInMeeting) {
          history.push("/meetings", { isNotValidMeeting: true });
          return;
        } else {
          updateMeetingInformation();
        }
      }
    } else {
      //PUBLIC MEETING
      if (!localStorage.getItem("firebaseLoggedIn") || localStorage.getItem("firebaseLoggedIn") === "0") {
        //Not signed in
        localStorage.setItem("pendingMeetingID", meetingInfo?.meetingID || "");
        history.push("/auth", { isPendingMeeting: true });
        return;
      } else {
        //Check if is set for the current meeting
        let isInMeeting = meetingInfo?.invitators?.some((invitator: any) => invitator.firebase_id === user?.firebase_id);

        if (!isInMeeting) {
          history.push("/meetings", { isNotValidMeeting: true });
        } else {
          updateMeetingInformation();
        }
      }
    }
  }

  const updateMeetingInformation = () => {
    setMeetingTitle(meetingInfo?.title);
    setCreator(meetingInfo?.creator.name || meetingInfo?.creator.email);
    setTime(`${getCurrentDateShortString(new Date(Date.parse(meetingInfo.date[0])))} - 
    ${getCurrentDateShortString(new Date(Date.parse(meetingInfo.date[1])))}`);

    dispatch(doGetMeetingImages({
      meetingID: paramMeetingID
    }))
  }

  const save = () => {
    imagesList.forEach((image: any) => {
      if (image.isNew) {
        //TODO: Create new in database

      }
    })

    removedList.forEach((imageID: string) => {
      //TODO: Remove from current database
    })
  }

  const uploadImage = () => {
    document?.getElementById('uploadImage')?.click();
  }

  const previewImage = (url: string) => {
    setImageBoxURL(url);
    setImageBoxClass("image-box image-box-show");
  }

  const hideImageBox = () => {
    setImageBoxClass("image-box image-box-hide");

    setTimeout(() => {
      setImageBoxURL("");
      setImageBoxClass("image-box image-box-none");
    }, 750)
  }

  const handleInputChange = async (e: any) => {
    //Upload images to firebase
    Array.from(e.target.files).forEach(async (file: any) => {
      let uploadPromise = upload(file).then((url: any) => {
        setImagesList([...imagesList, {
          imageURL: url.default,
          meetingID: paramMeetingID,
          creator: user,
          isNew: true
        }]);
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
      const storageRef = ref(storage, `/meeting-images/${file.name}-${Date.now()}`)
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
          switch (error.code) {
            case "storage/unauthorized":
              reject(" User doesn't have permission to access the object");
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

  const removeImage = (e: any, index: number) => {
    e.preventDefault();

    MySwal.fire({
      title: "Are you sure want to remove this image?",
      text: "",
      icon: "warning",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      showCancelButton: true,
      showConfirmButton: true
    })
      .then((willDelete) => {
        if (willDelete.isConfirmed) {
          let cloneImagesList = imagesList;
          let imageToRemove = imagesList[index];
          cloneImagesList.splice(index, 1);
          setImagesList(cloneImagesList);
          setUpdate(update + 1);

          if (!imageToRemove.isNew) {
            setRemovedList([...removedList, imageToRemove._id])
          }
        }
      });
  }

  return (
    <div className="meeting-image-upload">
      <h1 className="meeting-image-upload__title">{meetingTitle !== "" ? meetingTitle : "Meeting"}
      </h1>

      <span>
        {isBonding ? <span
          style={{ color: "var(--theme-green)", marginRight: "4px" }}
        >bonding</span> : "meeting "}

        <span style={{ color: "#999999" }}>host by {creator}{' '}</span>

        <span>at {time}</span>
      </span>

      <div className="meeting-image-upload__images">
        <div className="meeting-image-upload__upload-button"
          onClick={() => uploadImage()}
        >
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          <p>upload images</p>
        </div>

        <input style={{ display: "none" }} type='file' id="uploadImage" name="uploadImage"
          onChange={handleInputChange} />

        <div className="meeting-image-upload__images-list">
          {imagesList.map((image: any, index: number) => {
            return <img className="meeting-image-upload__images-list--item"
              src={image.imageURL}
              onClick={() => previewImage(image.imageURL)}
              onContextMenu={(e: any) => {
                if (image.creator.firebase_id === meetingInfo?.creator.firebase_id
                  || image.creator.firebase_id === user?.firebase_id) {
                  removeImage(e, index)
                }
              }}>
            </img>
          })}
        </div>
      </div>

      <button className="meeting-image-upload__finish" onClick={() => {
        save();
      }}>
        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
      </button>

      <div className={imageBoxClass} onClick={() => hideImageBox()}>
        <img src={imageBoxURL} alt=""></img>
      </div>

      <ToastContainer />
    </div >
  );
};