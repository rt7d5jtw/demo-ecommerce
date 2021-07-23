import * as React from 'react';
import './promotions-preview.css';
import PromotionCard from '../promotion-card/promotion-card.component';
import { IPromotions } from '../promotionSlice';

interface IPromotionsPreview {
  img: string;
  promotions: IPromotions[];
}

function PromotionsPreview({ img, promotions }: IPromotionsPreview): JSX.Element {
  return (
    <div
      className='promotions-preview'
      style={{
        backgroundImage: ` linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url(${img})`,
      }}
    >
      <div className='promotions-preview__main'>
        {promotions
          .filter((_el, idx) => idx < 3)
          .map((promotion: IPromotions) => (
            <PromotionCard
              title={promotion.title}
              image={promotion.image}
              id={promotion.id}
              key={promotion.id}
              url={promotion.url}
            />
          ))}
      </div>
    </div>
  );
}

export default PromotionsPreview;
