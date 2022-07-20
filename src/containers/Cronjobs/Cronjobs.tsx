import React, { useEffect, useState } from 'react';
import { doRemindParticipants, useAppDispatch } from '../../redux';

export const Cronjobs: React.FC = ({ }) => {
  document.title = "How2Meet? | Cronjobs"
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(doRemindParticipants());
  }, []);

  return (
    <></>
  );
};
