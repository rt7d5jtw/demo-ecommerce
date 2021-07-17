import * as React from 'react';
import { useState } from 'react';
import './promotions.css';
import PromotionCard from '../promotion-card/promotion-card.component';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { selectPromotionItems } from '../selectors';

const PromotionsGallery = (): JSX.Element => {
  const promotions = useSelector(selectPromotionItems);
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
      <PromotionCard
        id={promotions[index].id}
        image={promotions[index].image}
        url={promotions[index].url}
      />
      <MdKeyboardArrowRight className='gallery-arrow right-arrow' onClick={nextSlide} />
      <MdKeyboardArrowLeft className='gallery-arrow left-arrow' onClick={prevSlide} />
    </div>
  );
};

export default PromotionsGallery;
