import * as React from 'react';
import './admin-creator.css';
import CreatorHeader from './creator-header/creator-header.component';
import CreatorSidebar from './creator-sidebar/creator-sidebar.component';
import CreatorMain from './creator-main/creator-main.component';

function AdminCreator(): JSX.Element {
  return (
    <div className='admin-creator'>
      <CreatorHeader />
      <CreatorSidebar />
      <CreatorMain>
      </CreatorMain>
    </div>
  );
}

export default AdminCreator;
