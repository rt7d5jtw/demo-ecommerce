import { AnyAction } from 'redux';
import { CategoryState } from '../types';
import { CategoryConstants } from './category.constants';

const INITIAL_STATE: CategoryState = {
  categories: [],
};

export const categoryReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case CategoryConstants.FETCH_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      }

    case CategoryConstants.DELETE_CATEGORY:
      return {
        ...state
      }

    case CategoryConstants.CREATE_CATEGORY:
      return {
        ...state,
      }

    case CategoryConstants.UPDATE_CATEGORY:
      return {
        ...state,
      }

    default:
      return state;
  }
}

/*
const INITIAL_STATE: CategoryState = {
  categories: [
    {
      title: 'outlet',
      image: 'https://i.ibb.co/cvpntL1/hats.png',
      id: 1,
      url: '/outlet'
    },
    {
      title: 'fiction',
      image: 'https://i.ibb.co/cvpntL1/hats.png',
      id: 2,
      url: '/fiction'
    }
  ]
}
*/
