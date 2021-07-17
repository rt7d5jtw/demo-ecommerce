import * as React from 'react';
import './home-middle.css';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import PromotionsGallery from '../../features/promotion/promotions/promotions.component';
import { IPromotions } from '../../features/promotion/promotionSlice';
import { selectPromotionItems } from '../../features/promotion/selectors';
import { connect } from 'react-redux';

const Homemiddle = (): JSX.Element => {
  return (
    <div className='homemiddle'>
      <PromotionsGallery />
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
