import * as React from 'react';
import './user-viewer.css';

interface IUserViewer {
  email: string;
  id: string;
  date: string;
}

export const UserViewer = ({ email, id, date }: IUserViewer) => {
  return (
    <div className='user-viewer'>
      <div className='user-info-wrapper'>
        <h1 className='email'>Email: {email}</h1>
        <h1 className='user-id'>Id: {id}</h1>
        <h1 className='creation-date'>Created at: {date}</h1>
      </div>
      <div className='view-user'>
        <h1>View user</h1>
      </div>
    </div>
  );
};
