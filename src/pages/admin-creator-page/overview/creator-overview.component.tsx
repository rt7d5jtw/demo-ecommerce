import * as React from 'react';
import './creator-overview.css';

export function CreatorOverview() {
  return (
    <div className='creator-overview'>
      <div
        className='info-box'
        style={{ backgroundImage: `url('https://i.imgur.com/DUGNMoU.png')` }}
      >
        <h1 id='creator-welcome'>Welcome to Admin Creator :)</h1>
        <p id='creator-text'>You can create products and categories by clicking on the sidebar</p>
      </div>
    </div>
  );
}
