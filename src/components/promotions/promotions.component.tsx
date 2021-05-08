import * as React from 'react';
import { useState } from 'react';
import './promotions.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectPromotions } from '../../redux/promotions/promotions.selectors';
import PromotionCard from '../promotion-card/promotion-card.component';
import { _Promotions } from '../../redux/types';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Promotions = (): JSX.Element => {
  const dispatch = useDispatch();
  const promotions = useSelector(selectPromotions);
  const [index, setIndex] = useState(0);

  function nextSlide() {
    if (index === promotions.length - 1) setIndex(0);
    else setIndex(index + 1);
  }

  function prevSlide() {
    if (index === 0) setIndex(promotions.length - 1);
    else setIndex(index - 1);
  }

  return (
    <div className='promotions'>
      <MdKeyboardArrowLeft className='gallery-arrow left-arrow' onClick={prevSlide} />
      <PromotionCard
        id={promotions[index].id}
        image={promotions[index].image}
        title={promotions[index].title}
        link={promotions[index].link}
      />
      <MdKeyboardArrowRight className='gallery-arrow right-arrow' onClick={nextSlide} />
    </div>
  );
};

export default Promotions;
