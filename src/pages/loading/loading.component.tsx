import * as React from 'react';
import './loading.css';

export function Loading(): JSX.Element {
  return (
    <div className='loading'>
      <div className='loading-spinner__wrapper'>
        <div className='spinner'>
          <div className='spinner-core' />
        </div>
      </div>
    </div>
  );
}
