import { PromotionConstants } from './promotions.constants';
import { AnyAction } from 'redux';

const INITIAL_STATE = {
  promotions: [
    { id: 1, image: 'https://i.imgur.com/2ZQ74M2.jpg', title: 'I eat ass', link: '/sale' },
    { id: 2, image: 'https://i.imgur.com/g4o8KSZ.png', title: 'I eat ass', link: '/sale' },
    { id: 3, image: 'https://i.imgur.com/q5B9dMe.png', title: 'I eat ass', link: '/sale' },
    { id: 4, image: 'https://i.imgur.com/FAHGdJD.png', title: 'I eat ass', link: '/sale' },
  ],
  test: [],
  loading: true,
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
        promotions: [action.payload],
        loading: false,
      };

    case PromotionConstants.CREATE_PROMOTION_FAILURE:
      return {
        ...state,
        loading: false,
        errors: ['Promotion could not be created', action.payload],
      };

    case PromotionConstants.REMOVE_PROMOTION_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case PromotionConstants.REMOVE_PROMOTION_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case PromotionConstants.REMOVE_PROMOTION_FAILURE:
      return {
        ...state,
        errors: ['Promotion could not be removed', action.payload],
      };

    case PromotionConstants.FETCH_PROMOTION_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case PromotionConstants.FETCH_PROMOTION_SUCCESS:
      return {
        ...state,
        test: action.payload,
        loading: false,
      };

    case PromotionConstants.FETCH_PROMOTION_FAILURE:
      return {
        ...state,
        loading: false,
        errors: ['Promotions could not be fetched', action.payload],
      };

    default:
      return {
        ...state,
      };
  }
};
