import * as React from 'react';
import './admin-overview.css';
import img from '../../../../../assets/admin.jpg';

export const AdminOverview = (): JSX.Element => {
  return (
    <div className='admin-overview'>
      <div className='admin-overview-wrapper'>
        <div className='admin-image' style={{ backgroundImage: `url(${img})` }}>
          <div className='text-overlay'>
            <h1 className='welcome-text'>Welcome to Administration</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
