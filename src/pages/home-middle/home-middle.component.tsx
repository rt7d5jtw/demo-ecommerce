import * as React from 'react';
import './home-middle.css';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import Promotions from '../../features/promotion/promotions/promotions.component';
import { IPromotions } from '../../features/promotion/promotionSlice';
import { selectPromotionItems } from '../../features/promotion/selectors';
import { connect } from 'react-redux';

interface IHomemiddle {
  promotions: IPromotions[];
}

const Homemiddle = ({ promotions }: IHomemiddle): JSX.Element => {
  return (
    <div className='homemiddle'>
      <Promotions promotions={promotions} />
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
