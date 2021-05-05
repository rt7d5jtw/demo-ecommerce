import * as React from 'react';
import './promotion-card.css';

interface IPromotionCard {
  title: string;
  image: string;
}

const PromotionCard = ({ title, image }: IPromotionCard) => {
  return (
    <div className='promotion-card' onClick={() => alert('yeet')}>
      <div className='img' style={{ backgroundImage: `url(${image})` }} />
      <div className='content'>
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default PromotionCard;
