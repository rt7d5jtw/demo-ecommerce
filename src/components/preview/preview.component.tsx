import * as React from 'react';
import './preview.css';
import { PreviewCategory } from '../preview-category/preview-category.component';

interface IFrontItems {
  title: string;
  image: string;
  id: number;
  linkUrl: string;
}

export const Preview = () => {

  const front_items: IFrontItems[] = [
    {
      title: 'Outlet',
      image: 'https://i.imgur.com/1TKUQ3f.jpg',
      id: 1,
      linkUrl: 'Outlet'
    },
    {
      title: 'Classics',
      image: 'https://i.imgur.com/2Zy1MXO.png',
      id: 2,
      linkUrl: 'Classics'
    },
    {
      title: 'Fiction',
      image: 'https://i.imgur.com/jRT9KzI.png',
      id: 3,
      linkUrl: 'Fiction'
    },
    {
      title: 'Bestsellers',
      image: 'https://i.imgur.com/NHLdqlz.jpg',
      id: 4,
      linkUrl: 'Bestsellers'
    },
    {
      title: 'New releases',
      image: 'https://i.imgur.com/jF6qezF.png',
      id: 5,
      linkUrl: 'New'
    },
  ];

  return (
    <div className='preview-category__container'>
      {front_items.filter((item, index) => index < 5)
        .map(({ id, ...other }) => {
      return <PreviewCategory key={id} id={id} {...other} />
    })}
    </div>
  )
}
