import * as React from 'react';
import './profile-overview.css';

export const ProfileOverview = () => {
  return (
    <div className='profile-overview'>
      <div className='profile-overview-wrapper'>
        <div
          className='profile-image'
          style={{ backgroundImage: `url('https://i.imgur.com/BUl15mr.png')` }}
        >
          <h1 className='welcome-text'>Welcome to your profile</h1>
        </div>
      </div>
    </div>
  );
};
