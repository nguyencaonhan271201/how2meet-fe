import { 
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage"
import {storage} from "../../configs/firebase.ts"

export class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          const storageRef = ref(storage, `/minutes/${file.name}-${Date.now()}`)
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
    );
  }
}