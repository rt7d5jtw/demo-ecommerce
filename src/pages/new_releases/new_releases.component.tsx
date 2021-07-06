import * as React from 'react';
import { useState } from 'react';
import './new_releases.css';
import { NEW_RELEASES_DATA } from './new_releases.data';
import ProductCard from '../../features/product/product-card/product-card.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import Main from '../../features/homepage-components/main/main.component';

export const NewReleases = (): JSX.Element => {
  const [products] = useState(NEW_RELEASES_DATA);

  return (
    <div className='new-releases'>
      <h1 className='category__title'>New Releases</h1>
      <div className='products'>
        {products.map(({ id, ...props }) => (
          <ProductCard key={id} id={id} {...props} />
        ))}
      </div>
    </div>
  );
};
