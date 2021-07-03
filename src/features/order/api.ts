import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { authHeader } from '../user/api';
import { Order, OrderDTO, OrderItem, OrderItemDto, PaymentIntentDTO } from './orderSlice';

export const ORDER_URL = 'http://localhost:3000/orders/';

export async function fetchOrders(): Promise<Order[]> {
  return axios
    .get(ORDER_URL, { headers: authHeader() })
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

export async function fetchAllOrders(): Promise<Order[]> {
  return axios
    .get(ORDER_URL + 'all', { headers: authHeader() })
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

export async function createOrder(data: OrderDTO): Promise<Order> {
  return axios
    .post(ORDER_URL, data, { headers: authHeader() })
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

export async function addOrderItems(id: string): Promise<[OrderItemDto]> {
  return axios
    .post(ORDER_URL + `items/${id}`, {}, { headers: authHeader() })
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

export async function stripeCreateIntent(req: PaymentIntentDTO): Promise<void> {
  return axios
    .post(ORDER_URL + 'create-payment-intent', req, {
      headers: authHeader(),
    })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function removeOrder(id: string): Promise<void> {
  return axios
    .delete(ORDER_URL + id, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}
