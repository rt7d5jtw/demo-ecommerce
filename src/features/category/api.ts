import axios, { AxiosInstance } from 'axios';
import { authHeader } from '../user/userSlice';
import { Category } from './categorySlice';

export const CATEGORY_URL = 'http://localhost:3000/category/';

export function useHTTPClient(): AxiosInstance {
  return axios.create({ baseURL: CATEGORY_URL, headers: authHeader() });
}

export function useAPIClientNoAuth(): AxiosInstance {
  const instance = axios.create({ baseURL: CATEGORY_URL });
  instance.interceptors.response.use((res) => res);
  return instance;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await axios.get(CATEGORY_URL);
  return data;
}

export async function createCategory(cname: string): Promise<Category> {
  const { data } = await axios.post(CATEGORY_URL, { cname: cname });
  return data;
}

export async function removeCategory(id: string): Promise<void> {
  return axios.delete(CATEGORY_URL + id);
}

export async function updateCategory(data: Category): Promise<Category> {
  const { id, cname } = data;
  const res = await axios.patch(CATEGORY_URL + id, cname);
  return res.data;
}
