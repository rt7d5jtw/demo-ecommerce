import * as React from 'react';
import './view-users.css';
import { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectUsers } from '../../../../redux/user/user.selectors';
import { UserViewer } from '../../../../components/user-viewer/user-viewer.component';
import { AdminHeader } from '../../../../components/admin/admin-header/admin-header.component';
import AdminNav from '../../../../components/admin/admin-nav/admin-nav.component';
import { AdminMain } from '../../../../components/admin/admin-main/admin-main.component';
import { fetch } from '../../../../redux/user/userSlice';

export const ViewUsers = () => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  return (
    <div className='admin-overview'>
      <div className='admin-myusers-wrapper'>
        <h1 id='browse-users'>Browse users</h1>
        <div className='user-wrapper'>
          {users.map(({ id, createdAt, ...props }) => (
            <UserViewer key={id} id={id} date={createdAt} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
};
