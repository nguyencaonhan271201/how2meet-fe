import './MeetingMinute.scss';
import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadAdapter } from "./UploadAdapter";

export const MeetingMinute: React.FC<IMeetingMinute> = ({ }) => {
  document.title = "How2Meet? | Meeting Minute";

  const [minuteData, setMinuteData] = useState<string>("");

  const performSave = () => {
    //TODO: Call API to save to database
    //BE integrated later
  }

  return (
    <div className="meeting-minutes">
      <h2 className="meeting-minutes__title">Meeting Minute</h2>

      <CKEditor
        editor={ClassicEditor}
        data=""
        onReady={(editor: any) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
            return new UploadAdapter(loader);
          };
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          setMinuteData(data);
        }}
        onBlur={(event: any, editor: any) => {
        }}
        onFocus={(event: any, editor: any) => {
        }}
      />

      <button
        className="meeting-minutes__save"
        onClick={() => performSave()}
      >
        Save
      </button>
    </div>
  );
};