import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { Product } from './productSlice';

export const PRODUCT_URL = 'http://localhost:3000/product';

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await axios.get(PRODUCT_URL);
  return data;
}

export async function createProduct(data: Product): Promise<Product> {
  return axios
    .post(PRODUCT_URL, data)
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return error.response.data;
    });
}

export async function removeProduct(id: number): Promise<number> {
  return axios
    .delete(PRODUCT_URL + `/${id}`)
    .then((res) => res.data.id)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return error.response.data;
    });
}

export async function updateProduct({ id, ...updateProps }: Product): Promise<Product> {
  return axios
    .patch(PRODUCT_URL + `/${id}`, { ...updateProps })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return error.response.data;
    });
}

export async function searchProducts(search: string): Promise<{ search: string; data: Product[] }> {
  const { data } = await axios.get(PRODUCT_URL + `?search=${search}`);
  return { search, data };
}
