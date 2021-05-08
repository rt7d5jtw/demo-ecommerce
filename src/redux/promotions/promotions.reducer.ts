import { PromotionConstants } from './promotions.constants';
import { AnyAction } from 'redux';

const INITIAL_STATE = {
  promotions: [
    { id: 1, image: 'https://i.imgur.com/2ZQ74M2.jpg', title: 'I eat ass', link: '/sale' },
    { id: 2, image: 'https://i.imgur.com/g4o8KSZ.png', title: 'I eat ass', link: '/sale' },
    { id: 3, image: 'https://i.imgur.com/q5B9dMe.png', title: 'I eat ass', link: '/sale' },
    { id: 4, image: 'https://i.imgur.com/FAHGdJD.png', title: 'I eat ass', link: '/sale' },
  ],
  loading: false,
};

export const promotionsReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case PromotionConstants.CREATE_PROMOTION_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case PromotionConstants.CREATE_PROMOTION_SUCCESS:
      return {
        ...state,
        promotions: action.payload,
        loading: false,
      };

    case PromotionConstants.CREATE_PROMOTION_FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
};
