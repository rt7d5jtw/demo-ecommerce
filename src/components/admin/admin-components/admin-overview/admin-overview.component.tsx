import * as React from 'react';
import './admin-overview.css';
import Admin from '../../admin.component';

export const AdminOverview = () => {
  return (
    <div className='admin-overview'>
      <div className='admin-overview-wrapper'>
        <div
          className='admin-image'
          style={{ backgroundImage: `url('https://i.imgur.com/m6D6BSl.png')` }}
        >
          <div className='text-overlay'>
            <h1 className='welcome-text'>Welcome to Administration</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
