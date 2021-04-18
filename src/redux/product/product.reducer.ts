import { ProductConstants } from './product.constants';
import { AnyAction } from 'redux';

const INITIAL_STATE = {
  items: [],
  searchItems: [],
  search: '',
  loading: false,
  error: null
};

export const productReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {

    case ProductConstants.SEARCH_PRODUCTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }

    case ProductConstants.SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        searchItems: action.payload.products,
        search: action.payload.search,
        loading: false
      }

    case ProductConstants.SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        search: '',
        loading: false,
        error: action.payload.error,
        items: []
      }

    case ProductConstants.FETCH_PRODUCTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ProductConstants.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.products,
        searchItems: [],
        search: ''
      };

    case ProductConstants.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };

    default:
      return state;
  }
}
