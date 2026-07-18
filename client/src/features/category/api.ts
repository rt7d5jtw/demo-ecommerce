import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { authHeader } from '../user/api';
import { ICategory } from './categorySlice';
import clientApi from '../shared/api';

const CATEGORY_URL = clientApi + '/category/';

async function fetchCategories(): Promise<ICategory[]> {
  return axios
    .get(CATEGORY_URL)
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

async function createCategory(cname: string): Promise<ICategory> {
  return axios
    .post(CATEGORY_URL, { cname: cname }, { headers: authHeader() })
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

async function removeCategory(id: string): Promise<void> {
  return axios
    .delete(CATEGORY_URL + id, { headers: authHeader() })
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

async function updateCategory(data: ICategory): Promise<ICategory> {
  const { id, cname } = data;
  return axios
    .patch(CATEGORY_URL + id, { cname: cname }, { headers: authHeader() })
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

export {
  updateCategory,
  removeCategory,
  createCategory,
  fetchCategories,
  CATEGORY_URL,
};
