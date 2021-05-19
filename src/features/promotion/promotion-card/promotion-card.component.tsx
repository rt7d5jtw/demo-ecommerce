import * as React from 'react';
import { useHistory } from 'react-router';
import './promotion-card.css';

interface IPromotionCard {
  image: string;
  url: string;
  id: string;
}

const PromotionCard = ({ image, url }: IPromotionCard): JSX.Element => {
  const { push } = useHistory();
  return (
    <div className='promotion-card' onClick={() => push(url)}>
      <div className='img' style={{ backgroundImage: `url(${image})` }} />
    </div>
  );
};

export default PromotionCard;
