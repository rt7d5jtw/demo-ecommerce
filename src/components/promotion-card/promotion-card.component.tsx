import * as React from 'react';
import './promotion-card.css';

interface IPromotionCard {
  title: string;
  image: string;
  link: string;
  id: number;
}

const PromotionCard = ({ title, image }: IPromotionCard) => {
  return (
    <div className='promotion-card' onClick={() => alert('yeet')}>
      <div className='img' style={{ backgroundImage: `url(${image})` }} />
    </div>
  );
};

export default PromotionCard;
