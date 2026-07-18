import * as React from 'react';
import './promotions-preview.css';
import PromotionCard from '../promotion-card/promotion-card.component';
import { IPromotions } from '../promotionSlice';

interface IPromotionsPreview {
  promotions: IPromotions[];
}

function PromotionsPreview({ promotions }: IPromotionsPreview): JSX.Element {
  return (
    <div className='promotions-preview'>
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
