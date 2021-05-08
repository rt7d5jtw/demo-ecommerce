import * as React from 'react';
import './creator-overview.css';

export function CreatorOverview(): JSX.Element {
  return (
    <div className='creator-overview'>
      <div
        className='info-box'
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1588736539560-7c8bbddb5efb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format')`}}
      >
        <h1 id='creator-welcome'>Welcome to Admin Creator :)</h1>
        <p id='creator-text'>You can create products and categories by clicking on the sidebar</p>
      </div>
    </div>
  );
}
