import axios from 'axios';
import { authHeader } from './auth-header';

export const ORDER_URL = 'http://localhost:3000/orders/';

export const getOrders = (): Promise<any> => {
  return axios.get(ORDER_URL, { headers: authHeader() });
};

export const getAllOrders = (): Promise<any> => {
  return axios.get(ORDER_URL + 'all', { headers: authHeader() });
};
