import { ProductConstants } from './product.constants';
import { Product } from '../types.d';
import { AppDispatch } from '../store';
import axios from 'axios';

export const PRODUCT_URL = 'http://localhost:3000/product'

/* side effects */

export function fetchProducts() {
  return (dispatch: AppDispatch) => {
    dispatch(fetchProductsBegin());
    return axios.get(PRODUCT_URL.concat('?cat=dcaa9f09-0dbe-4e81-af92-e15ee487beaa'))
      .then(res => {
        dispatch(fetchProductsSuccess(res.data));
        return res.data;
      })
      .catch(error =>
        dispatch(fetchProductsFailure(error)))
  }
}

export function searchProducts(search: string) {
  return (dispatch: AppDispatch) => {
    dispatch(searchProductsBegin());
    return axios.get(PRODUCT_URL.concat('?search=').concat(search))
      .then(res => {
        dispatch(searchProductsSuccess(res.data, search));
        return res.data;
      })
      .catch(error =>
        dispatch(searchProductsFailure(error)))
  }
}

/* plain objects */

export const fetchProductsBegin = () => ({
  type: ProductConstants.FETCH_PRODUCTS_BEGIN
})

export const fetchProductsSuccess = (products: Product) => ({
  type: ProductConstants.FETCH_PRODUCTS_SUCCESS,
  payload: { products }
})

export const fetchProductsFailure = (error: Error) => ({
  type: ProductConstants.FETCH_PRODUCTS_FAILURE,
  payload: { error }
})


export const searchProductsBegin = () => ({
  type: ProductConstants.SEARCH_PRODUCTS_BEGIN
})

export const searchProductsSuccess = (products: Product, search: string) => ({
  type: ProductConstants.SEARCH_PRODUCTS_SUCCESS,
  payload: { products, search }
})

export const searchProductsFailure = (error: Error) => ({
  type: ProductConstants.SEARCH_PRODUCTS_FAILURE,
  payload: { error }
})

