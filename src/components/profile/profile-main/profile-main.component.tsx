import * as React from 'react';
import './profile-main.css';

function ProfileMain(props: any) {
  return (
    <div className='profile-main'>
      {props.children}
    </div>
  );
}

export default ProfileMain;
