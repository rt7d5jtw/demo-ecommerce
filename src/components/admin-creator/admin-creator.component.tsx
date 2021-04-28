import * as React from 'react';
import './admin-creator.css';
import CreatorHeader from './creator-header/creator-header.component';
import CreatorSidebar from './creator-sidebar/creator-sidebar.component';
import SecondHeader from './second-header/second-header.component';
import CreatorMain from './creator-main/creator-main.component';

function AdminCreator() {
  return (
    <div className='admin-creator'>
      <CreatorHeader />
      <CreatorSidebar />
      <SecondHeader />
      <CreatorMain>
      </CreatorMain>
    </div>
  )
}

export default AdminCreator;
