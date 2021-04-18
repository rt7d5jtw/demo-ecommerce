import * as React from 'react';
import { Navbar } from '../../components/navbar/navbar.component';
import { Preview } from '../../components/preview/preview.component';
import { Footer } from '../../components/footer/footer.component';
import { Sidebar } from '../../components/sidebar/sidebar.component';
import Alert from '../../components/alert/alert.component';

export const Homepage = () => (
  <div className='homepage'>
    <Navbar />
    <Sidebar />
    <Alert />
    <Preview />
    <Footer />
  </div>
);
