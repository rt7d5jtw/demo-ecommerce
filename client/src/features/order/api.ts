import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import clientApi from '../shared/api';
import { authHeader, AuthorizationDTO } from '../user/api';
import {
  IOrder,
  IOrderItem,
  OrderDTO,
  PaymentIntentDTO,
  UpdateOrderDto,
} from './orderSlice';

const ORDER_URL = clientApi + '/orders/';

async function fetchOrders(): Promise<IOrder[]> {
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

async function fetchAllOrders(): Promise<IOrder[]> {
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

async function createOrder(data: OrderDTO): Promise<IOrder> {
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

async function fetchOrderItems(id: string): Promise<IOrderItem[]> {
  return axios
    .get(ORDER_URL + `items/${id}`, { headers: authHeader() })
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

async function stripeCreateIntent(req: PaymentIntentDTO): Promise<void> {
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

async function removeOrder(id: string): Promise<void> {
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

async function getInvoice(orderId: string): Promise<void> {
  const auth = authHeader();
  return axios
    .post(
      ORDER_URL + 'pdf',
      { orderId: orderId },
      {
        headers: {
          Authorization: `${(auth as AuthorizationDTO).Authorization}`,
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment',
          Accept: 'application/pdf',
        },
        responseType: 'arraybuffer',
      }
    )
    .then((res) => {
      /* creates a blob from the pdf stream, and then creates a url from the file */
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      );
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

async function updateOrder(
  orderId: string,
  updateDto: UpdateOrderDto
): Promise<IOrder> {
  return axios
    .patch(ORDER_URL + orderId, updateDto, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export {
  updateOrder,
  getInvoice,
  removeOrder,
  stripeCreateIntent,
  fetchOrderItems,
  createOrder,
  fetchAllOrders,
  fetchOrders,
  ORDER_URL,
};
