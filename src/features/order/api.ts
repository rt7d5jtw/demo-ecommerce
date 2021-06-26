import axios from 'axios';
import { authHeader } from '../user/api';
import { Order, OrderDTO, OrderItem, PaymentIntentDTO } from './orderSlice';

export const ORDER_URL = 'http://localhost:3000/orders/';

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await axios.get(ORDER_URL, { headers: authHeader() });
  return data;
}

export async function fetchAllOrders(): Promise<Order[]> {
  const { data } = await axios.get(ORDER_URL + 'all', { headers: authHeader() });
  return data;
}

export async function createOrder(data: OrderDTO): Promise<OrderDTO> {
  const res = await axios.post(ORDER_URL, data, { headers: authHeader() });
  return res.data;
}

export async function addOrderItems(data: OrderItem[]): Promise<OrderItem[]> {
  const res = await axios.post(ORDER_URL + 'items', data, { headers: authHeader() });
  return res.data;
}

export async function stripeCreateIntent(req: PaymentIntentDTO): Promise<void> {
  return axios.post(ORDER_URL + 'create-payment-intent', req, {
    headers: authHeader(),
  });
}

export async function removeOrder(id: string): Promise<void> {
  return axios.delete(ORDER_URL + id);
}
