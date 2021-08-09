import * as React from 'react';
import './creator-overview.css';
import cofe from '../../../../../assets/cofe.jpg';

export function ControlsOverview(): JSX.Element {
  return (
    <div className='creator-overview'>
      <div
        className='info-box'
        style={{
          backgroundImage: `url(${cofe})`,
        }}
      >
        <h1 id='creator-welcome'>Welcome to Admin Controls</h1>
        <p id='creator-text'>You can create products and categories by clicking on the sidebar</p>
      </div>
    </div>
  );
}
