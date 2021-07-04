import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { authHeader } from '../user/api';
import { ICart, ICartItem, AddItemSuccess } from './cartSlice';

export const CART_URL = 'http://localhost:3000/cart/';

export async function fetchCart(): Promise<ICart> {
  return axios
    .get(CART_URL, { headers: authHeader() })
    .then((res) => {
      if (res.data.length === 0) {
        console.info('User has no cart');
      }
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function createCart(): Promise<ICart> {
  return axios
    .post(CART_URL, {}, { headers: authHeader() })
    .then((res) => {
      console.info('User cart created');
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

/* checks if user has a cart, if not creates one */
export async function checkIfCart(): Promise<void> {
  return axios
    .get(CART_URL, { headers: authHeader() })
    .then((res) => {
      res.data.length === 0 ? createCart() : null;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function fetchCartState(): Promise<ICartItem[]> {
  return axios
    .get(CART_URL + 'state', { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

/* doesnt mutate client state, only affects db */
export async function addItemToCartDB(id: number): Promise<AddItemSuccess> {
  return axios
    .post(CART_URL + id, { quantity: 1 }, { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

/* doesnt mutate client state, only affects db */
export async function removeItemFromCartDB(productId: number): Promise<void> {
  return axios
    .delete(CART_URL + productId, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function clearCartState(): Promise<void> {
  return axios
    .delete(CART_URL, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}
