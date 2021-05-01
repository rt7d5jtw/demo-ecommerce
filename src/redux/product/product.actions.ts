import { ProductConstants } from './product.constants';
import { Product, ProductwithID } from '../types.d';
import { AppDispatch } from '../store';
import axios from 'axios';
import { arrayToObject, createProduct, getProducts, updateProduct } from '../../services/product.service';

export const PRODUCT_URL = 'http://localhost:3000/product'

/* side effects */

export function fetch() {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: ProductConstants.FETCH_PRODUCTS_BEGIN
    })
    axios.get(PRODUCT_URL)
      .then((res) => {
        dispatch({
          type: ProductConstants.FETCH_PRODUCTS_SUCCESS,
          payload: res.data
        })
      })
      .catch(error =>
        dispatch({
          type: ProductConstants.FETCH_PRODUCTS_FAILURE,
          payload: error
        }))
  }
}

export function remove(id: string) {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: ProductConstants.REMOVE_PRODUCT_BEGIN
    })
    axios.delete(PRODUCT_URL.concat('/' + id))
      .then((res) => {
        dispatch({
          type: ProductConstants.REMOVE_PRODUCT_SUCCESS,
          payload: res.data
        })
      })
      .catch(error =>
        dispatch({
          type: ProductConstants.REMOVE_PRODUCT_FAILURE,
          payload: error
        }))
  }
}

export async function fetchProducts() {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: ProductConstants.FETCH_PRODUCTS_BEGIN
    })
    return axios.get(PRODUCT_URL)
      .then(products => {
        dispatch({
          type: ProductConstants.FETCH_PRODUCTS_SUCCESS,
          payload: arrayToObject(products.data)
        })
      })
      .catch(error =>
        dispatch({
          type: ProductConstants.FETCH_PRODUCTS_FAILURE,
          payload: error
        }))
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

export function buildProduct(data: Product) {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: ProductConstants.CREATE_PRODUCT_BEGIN,
    })
    return createProduct(data).then(product => {
      dispatch({
        type: ProductConstants.CREATE_PRODUCT_SUCCESS,
        payload: product
      })
    })
      .catch(err =>
        dispatch({
          type: ProductConstants.CREATE_PRODUCT_FAILURE,
          payload: err
        }))
  }
}

export function editProduct(data: ProductwithID) {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: ProductConstants.UPDATE_PRODUCT_BEGIN,
    })
    return updateProduct(data).then(product => {
      dispatch({
        type: ProductConstants.UPDATE_PRODUCT_SUCCESS,
        payload: product
      })
    })
      .catch(err =>
        dispatch({
          type: ProductConstants.UPDATE_PRODUCT_FAILURE,
          payload: err
        }))
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

/* utility functions */

export const addItemToProducts = (products: Product[], new_item: Product) => {
  const existingItem = products.find(
    (item: Product) => item.id == new_item.id
  );
  if (existingItem) {
    return products.map((item: any) =>
      item.id == new_item.id
        ? { ...item }
        : item
    );
  }
  return [...products, { ...new_item }];
}
