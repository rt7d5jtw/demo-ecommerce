import * as React from 'react';
import './creator-overview.css';
import bear from '../../../assets/bear.jpg';

export function CreatorOverview(): JSX.Element {
  return (
    <div className='creator-overview'>
      <div
        className='info-box'
        style={{
          backgroundImage: `url(${bear})`,
        }}
      >
        <h1 id='creator-welcome'>Welcome to Admin Creator :)</h1>
        <p id='creator-text'>You can create products and categories by clicking on the sidebar</p>
      </div>
    </div>
  );
}
