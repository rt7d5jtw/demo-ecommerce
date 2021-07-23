import * as React from 'react';
import { useHistory } from 'react-router';
import './promotion-card.css';

interface IPromotionCard {
  image: string;
  title: string;
  url: string;
  id: number;
}

/*
function importAll(r: any) {
  r.keys().forEach((key: any) => (cache[key] = r(key)));
}
 */
//      <div
//        className='promotion-card__img'
//        style={{ backgroundImage: `url('./../../../assets/bar.jpg')` }}
//      >

//importAll(require.context('../', true, /\.ts$/));
//      <h2>{title}</h2>
// <p>Know more</p>

/* currently only way i know how to make images dynamically work */
//<img className='promotion-card__img' src={require(`./../../../assets/${image}`)} />

const PromotionCard = ({ image, url, title }: IPromotionCard): JSX.Element => {
  const { push } = useHistory();
  return (
    <div className='promotion-card' onClick={() => push(url)}>
      <img className='promotion-card__img' src={require(`../../../assets/${image}`)} />
      <h2 className='promotion-card__h2'>{title}</h2>
      <p className='promotion-card__p'>Know more</p>
    </div>
  );
};

export default PromotionCard;
