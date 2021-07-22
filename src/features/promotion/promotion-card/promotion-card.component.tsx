import * as React from 'react';
import { useHistory } from 'react-router';
import './promotion-card.css';

interface IPromotionCard {
  image: string;
  url: string;
  id: number;
}

const PromotionCard = ({ image, url, id }: IPromotionCard): JSX.Element => {
  const { push } = useHistory();
  return (
    <div className='promotion-card' onClick={() => push(url)}>
      <div className='promotion-card__img' style={{ backgroundImage: `url(${image})` }}>
        <h2>Find chocolate you love</h2>
        <p>Know more</p>
      </div>
    </div>
  );
};

export default PromotionCard;
