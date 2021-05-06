import * as React from 'react';
import { useState } from 'react';
import './new_releases.css';
import { NEW_RELEASES_DATA } from './new_releases.data';
import ProductCard from '../../components/product-card/product-card.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import { Navbar } from '../../components/navbar/navbar.component';
import { Footer } from '../../components/footer/footer.component';
import Main from '../main/main.component';

interface INewReleases {
  title: string;
  image: string;
  price: number;
  id: number;
}

export const NewReleases = ({ title, price, image, id }: INewReleases) => {
  const [products, setProducts] = useState(NEW_RELEASES_DATA);

  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <h1 className='category__title'>New Releases</h1>
        <div className='products'>
          {products.map(({ id, ...props }) => (
            <ProductCard key={id} id={id} {...props} />
          ))}
        </div>
      </Main>
      <Footer />
    </div>
  );
};
