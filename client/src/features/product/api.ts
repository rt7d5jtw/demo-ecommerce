import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import clientApi from '../shared/api';
import { authHeader } from '../user/api';
import { IProduct, ProductDto, UpdateProductDto } from './productSlice';

const PRODUCT_URL = clientApi + '/product';

async function fetchProducts(): Promise<IProduct[]> {
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

async function createProduct(data: ProductDto): Promise<IProduct> {
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

async function removeProduct(id: number): Promise<void> {
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

async function updateProduct({
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

async function searchProducts(
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

export {
  searchProducts,
  updateProduct,
  removeProduct,
  createProduct,
  fetchProducts,
  PRODUCT_URL,
};
