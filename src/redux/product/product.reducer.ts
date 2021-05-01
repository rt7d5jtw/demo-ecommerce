import { ProductConstants } from './product.constants';
import { AnyAction } from 'redux';
import { addItemToProducts } from './product.actions';

const INITIAL_STATE = {
  items: [],
  searchItems: [],
  search: '',
  loading: false,
  error: null
};

export const productReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {

    case ProductConstants.CREATE_PRODUCT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case ProductConstants.CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    case ProductConstants.CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: addItemToProducts(state.items, action.payload),
      }

    case ProductConstants.UPDATE_PRODUCT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case ProductConstants.UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case ProductConstants.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
      }

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
        items: [],
        loading: true,
        error: null
      };

    case ProductConstants.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
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

    case ProductConstants.REMOVE_PRODUCT_BEGIN:
      return {
        ...state,
        loading: true,
      }

    case ProductConstants.REMOVE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
      }

    case ProductConstants.REMOVE_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload.error
      }

    default:
      return state;
  }
}
