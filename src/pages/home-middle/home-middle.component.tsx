import * as React from 'react';
import './home-middle.css';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import PromotionsPreview from '../../features/promotion/promotions-preview/promotions-preview.component';
import { IPromotions } from '../../features/promotion/promotionSlice';
import { selectPromotionItems } from '../../features/promotion/selectors';
import { connect } from 'react-redux';
import background from '../../assets/homemiddle.jpg';

interface IHomemiddle {
  promotions: IPromotions[];
}

const Homemiddle = ({ promotions }: IHomemiddle): JSX.Element => {
  return (
    <div
      className='homemiddle'
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className='homemiddle__text__wrapper'>
        <p id='homemiddle__text2'>Find what you like from our selections</p>
      </div>
      <PromotionsPreview promotions={promotions} />
      <div className='homemiddle__text__wrapper2'>
        <p id='homemiddle__text'>
          Discover chocolate you like with rich flavors and delicious taste
        </p>
      </div>
    </div>
  );
};

interface IMapStateToProps {
  promotions: IPromotions[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  promotions: selectPromotionItems,
});

export default connect(mapStateToProps)(Homemiddle);
