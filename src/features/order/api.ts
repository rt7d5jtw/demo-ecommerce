import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { authHeader } from '../user/api';
import { IOrder, OrderDTO, OrderItem, OrderItemDto, PaymentIntentDTO } from './orderSlice';

export const ORDER_URL = 'http://localhost:3000/orders/';

export async function fetchOrders(): Promise<IOrder[]> {
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

export async function fetchAllOrders(): Promise<IOrder[]> {
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

export async function createOrder(data: OrderDTO): Promise<IOrder> {
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

export async function getInvoice(orderId: string): Promise<void> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return axios
    .post(ORDER_URL + 'pdf', orderId, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment',
        Accept: 'application/pdf',
      },
      responseType: 'arraybuffer',
    })
    .then((res) => {
      /* creates a blob from the pdf stream, and then creates a url from the file */
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      /* creates a link and sets the file url */
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf');
      document.body.append(link);
      link.click();
      link.remove();
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}
