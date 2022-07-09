import * as React from 'react';
import { useHistory } from 'react-router';
import './promotion-card.css';

interface IPromotionCard {
  image: string;
  title: string;
  url: string;
  id: number;
}

const PromotionCard = ({ image, url, title }: IPromotionCard): JSX.Element => {
  const { push } = useHistory();
  return (
    <div className='promotion-card' onClick={() => push(url)}>
      <img
        className='promotion-card__img'
        src={require(`../../../assets/${image}`)}
      />
      <h2 className='promotion-card__h2'></h2>
      <p className='promotion-card__p'>{title}</p>
    </div>
  );
};

export default PromotionCard;
