import axios from 'axios';
import { Category } from '../redux/types';
import { authHeader } from './auth-header';

export const CATEGORY_URL = 'http://localhost:3000/category/';

export const getCategories = (): Promise<any> => {
  return axios.get(CATEGORY_URL);
}

export const deleteCategory = (id: string): Promise<Category> => {
  return axios.delete(CATEGORY_URL.concat(id));
}

export const createCategory = (cname: string): Promise<Category> => {
  return axios.post(CATEGORY_URL, { cname: cname });
}

export const editCategory = (id: string, cname: any): Promise<any> => {
  return axios.patch(CATEGORY_URL.concat(id), cname);
}
