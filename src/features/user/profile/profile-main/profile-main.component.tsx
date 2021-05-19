import * as React from 'react';
import './profile-main.css';

function ProfileMain(props: JSX.ElementChildrenAttribute): JSX.Element {
  return <div className='profile-main'>{props.children}</div>;
}

export default ProfileMain;
