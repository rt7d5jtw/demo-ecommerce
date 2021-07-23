import * as React from 'react';
import './profile-overview.css';
import image from '../../../../../assets/hot-cofe.jpg';

export const ProfileOverview = (): JSX.Element => {
  return (
    <div className='profile-overview'>
      <div className='profile-overview__wrapper'>
        <div
          className='profile-overview__wrapper__image'
          style={{ backgroundImage: `url(${image})` }}
        >
          <h1 className='profile-overview__wrapper__welcome-text'>Welcome to your profile</h1>
        </div>
      </div>
    </div>
  );
};
