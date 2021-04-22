import { AnyAction } from 'redux';
import { CategoryConstants } from './category.constants';

const INITIAL_STATE = {
  categories: [],
}

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
        categories: action.payload
      }

    case CategoryConstants.UPDATE_CATEGORY:
      return {
        ...state,
        categories: action.payload
      }

    default:
      return state;
  }
}
