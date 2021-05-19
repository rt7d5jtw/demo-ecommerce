import * as React from 'react';
import { Link } from 'react-router-dom';
import './creator-header.css';

function CreatorHeader(): JSX.Element {
  return (
    <div className='creator-header'>
      <div className='back-to'>
        <Link to='/admin-page' className='header-link'>
          {' '}
          &larr; Back to Admin
        </Link>
      </div>
      <div className='go-to'>
        <Link to='/' className='header-link'>
          Go to Store &rarr;
        </Link>
      </div>
    </div>
  );
}

export default CreatorHeader;
