import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { authHeader } from '../user/api';
import { IProduct, ProductDto, UpdateProductDto } from './productSlice';

export const PRODUCT_URL = 'http://localhost:3000/product';

export async function fetchProducts(): Promise<IProduct[]> {
  return axios
    .get(PRODUCT_URL)
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

export async function createProduct(data: ProductDto): Promise<IProduct> {
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
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function updateProduct({
  id,
  ...updateProps
}: UpdateProductDto): Promise<IProduct> {
  return axios
    .patch(
      PRODUCT_URL + `/${id}`,
      { ...updateProps },
      { headers: authHeader() }
    )
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function searchProducts(
  search: string
): Promise<{ search: string; data: IProduct[] }> {
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
