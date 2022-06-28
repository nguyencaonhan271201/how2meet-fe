import './MeetingImageUpload.scss';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
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

export const MeetingImageUpload: React.FC<IMeetingImageUpload> = ({ }) => {
  document.title = "How2Meet? | Meeting Image";
  let { id: meetingID } = useParams() as any;

  const [imageBoxClass, setImageBoxClass] = useState<string>("");
  const [imageBoxURL, setImageBoxURL] = useState<string>("");
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [isBonding, setIsBonding] = useState<boolean>(true);
  const [creator, setCreator] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [imagesList, setImagesList] = useState<Array<any>>([]);
  const MySwal = withReactContent(Swal);
  const [update, setUpdate] = useState<number>(0);

  //Hooks
  useEffect(() => {
    getMeetingBasicInfo();
  }, []);

  useEffect(() => {
    console.log(imagesList);
  }, [imagesList]);

  //Helper functions
  const getMeetingBasicInfo = () => {
    //TODO: Call API to get basic information
    setMeetingTitle("My meeting");
    setCreator("Nguyen Cao Nhan");
    setTime("12pm-6pm 12/06/2022")
  }

  const save = () => {

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
      setImageBoxClass("image-box image-box-hide");
      setImageBoxURL("");

      setTimeout(() => {
        setImageBoxClass("image-box image-box-none");
      }, 500);
    }, 750)
  }

  const handleInputChange = async (e: any) => {
    //Upload images to firebase
    Array.from(e.target.files).forEach(async (file: any) => {
      let uploadPromise = upload(file).then((url: any) => {
        setImagesList([...imagesList, url.default]);
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
          cloneImagesList.splice(index, 1);
          setImagesList(cloneImagesList);
          setUpdate(update + 1);
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
          {imagesList.map((image: string, index: number) => {
            return <img className="meeting-image-upload__images-list--item"
              src={image}
              onClick={() => previewImage(image)}
              onContextMenu={(e: any) => { removeImage(e, index) }}>
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