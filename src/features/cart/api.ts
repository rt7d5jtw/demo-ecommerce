import axios, { AxiosError, AxiosInstance } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { authHeader } from '../user/api';
import { CartItem } from './cartSlice';

export const CART_URL = 'http://localhost:3000/cart/';

export function useHTTPClient(): AxiosInstance {
  return axios.create({ baseURL: CART_URL, headers: authHeader() });
}

export function useAPIClientNoAuth(): AxiosInstance {
  const instance = axios.create({ baseURL: CART_URL });
  instance.interceptors.response.use((res) => res);
  return instance;
}

export async function checkIfCart(): Promise<void> {
  const client = useHTTPClient();
  await client
    .get(CART_URL, { headers: authHeader() })
    .then((res) => {
      res.data.length === 0 ? client.post(CART_URL, {}, { headers: authHeader() }) : null;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return error.response.data;
    });
}

/* fetches cart state */
export async function fetchCartInfo(): Promise<CartItem[]> {
  const { data } = await axios.get(CART_URL + 'cartInfo', { headers: authHeader() });
  return data;
}

export async function addItemToCartDB(id: number): Promise<CartItem> {
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
      return error.response.data;
    });
}

export async function removeItemFromCartDB(id: number): Promise<void> {
  return axios
    .delete(CART_URL + id, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return error.response.data;
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
    });
}
