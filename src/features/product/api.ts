import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { authHeader } from '../user/api';
import { CreateProductDto, Product, UpdateProductDto } from './productSlice';

export const PRODUCT_URL = 'http://localhost:3000/product';

export async function fetchProducts(): Promise<Product[]> {
  return axios
    .get(PRODUCT_URL, { headers: authHeader() })
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

export async function createProduct(data: CreateProductDto): Promise<Product> {
  return axios
    .post(PRODUCT_URL, data, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function removeProduct(id: number): Promise<void> {
  return axios
    .delete(PRODUCT_URL + `/${id}`, { headers: authHeader() })
    .then((res) => console.log(res.status))
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function updateProduct({ id, ...updateProps }: UpdateProductDto): Promise<Product> {
  return axios
    .patch(PRODUCT_URL + `/${id}`, { ...updateProps }, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function searchProducts(search: string): Promise<{ search: string; data: Product[] }> {
  return axios
    .get(PRODUCT_URL + `?search=${search}`, { headers: authHeader() })
    .then(({ data }) => {
      return { search, data };
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}
