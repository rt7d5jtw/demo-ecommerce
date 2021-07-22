import * as React from 'react';
import './home-middle.css';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import PromotionsPreview from '../../features/promotion/promotions-preview/promotions-preview.component';
import { IPromotions } from '../../features/promotion/promotionSlice';
import { selectPromotionItems } from '../../features/promotion/selectors';
import { connect } from 'react-redux';

interface IHomemiddle {
  promotions: IPromotions[];
}

const Homemiddle = ({ promotions }: IHomemiddle): JSX.Element => {
  return (
    <div className='homemiddle'>
      <PromotionsPreview
        promotions={promotions}
        img={
          'https://images.unsplash.com/photo-1601574494033-3c8800d80864?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1'
        }
      />
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
