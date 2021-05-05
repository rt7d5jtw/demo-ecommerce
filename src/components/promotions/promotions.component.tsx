import * as React from 'react';
import './promotions.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectPromotions } from '../../redux/promotions/promotions.selectors';
import PromotionCard from '../promotion-card/promotion-card.component';

const Promotions = () => {
  const dispatch = useDispatch();
  const promotions = useSelector(selectPromotions);
  return (
    <div className='promotions'>
      {promotions.map(({ id, ...props }: any) => {
        return <PromotionCard key={id} id={id} {...props} />;
      })}
    </div>
  );
};

export default Promotions;
