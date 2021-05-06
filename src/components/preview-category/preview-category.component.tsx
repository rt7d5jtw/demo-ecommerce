import * as React from 'react';
import './preview-category.css';
import { useHistory, useRouteMatch } from 'react-router-dom';

export interface IPreviewCategory {
  title: string;
  image: string;
  id: number;
  linkUrl: string;
}

export const PreviewCategory = ({ title, image, linkUrl }: IPreviewCategory) => {
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <div className='preview-category' onClick={() => history.push(`${match.url}${linkUrl}`)}>
      <div
        className='category-img'
        style={{ backgroundImage: `url(${'https://i.imgur.com/FbZAhhu.jpeg'})` }}
      />
      <div className='category-content'>
        <h1>{title}</h1>
      </div>
    </div>
  );
};
