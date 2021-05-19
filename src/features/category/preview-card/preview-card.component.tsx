import * as React from 'react';
import './preview-card.css';
import { useHistory, useRouteMatch } from 'react-router-dom';

export interface IPreviewCard {
  title: string;
  image: string;
  id: number;
  linkUrl: string;
}

export const PreviewCard = ({ title, image, linkUrl }: IPreviewCard): JSX.Element => {
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <div className='preview-card' onClick={() => history.push(`${match.url}${linkUrl}`)}>
      <div className='category-img' style={{ backgroundImage: `url(${image})` }} />
      <div className='category-content'>
        <h1>{title}</h1>
      </div>
    </div>
  );
};
