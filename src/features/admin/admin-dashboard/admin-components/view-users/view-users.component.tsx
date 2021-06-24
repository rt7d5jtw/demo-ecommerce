import * as React from 'react';
import './view-users.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch } from '../../../../user/thunks';
import { selectUsers } from '../../../../user/selectors';
import { UserViewer } from '../user-viewer/user-viewer.component';

export const ViewUsers = (): JSX.Element => {
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
