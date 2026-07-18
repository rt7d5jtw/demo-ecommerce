import * as React from 'react';
import './profile-overview.css';
import image from '../../../../../assets/hot-cofe.jpg';

const ProfileOverview = (): JSX.Element => {
  return (
    <div className='profile-overview'>
      <div
        className='profile-overview__image'
        style={{ backgroundImage: `url(${image})` }}
      >
        <h1 className='profile-overview__welcome-text'>
          Welcome to your profile
        </h1>
      </div>
    </div>
  );
};

export default ProfileOverview;
