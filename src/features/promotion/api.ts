import axios, { AxiosError } from 'axios';
import { authHeader } from '../user/api';
import { ValidationErrors, IPromotions, CreatePromotionDto } from './promotionSlice';

export const PROMOTION_URL = 'http://localhost:3000/promotions';

export async function fetchPromotions(): Promise<IPromotions[]> {
  return axios
    .get(PROMOTION_URL)
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

export async function createPromotion(data: CreatePromotionDto): Promise<IPromotions> {
  return axios
    .post(PROMOTION_URL, data, { headers: authHeader() })
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

export async function removePromotion(id: number): Promise<void> {
  return axios
    .delete(PROMOTION_URL + `/${id}`, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function updatePromotion({ id, ...updateProps }: IPromotions): Promise<IPromotions> {
  return axios
    .patch(PROMOTION_URL + `/${id}`, { ...updateProps }, { headers: authHeader() })
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

export async function fetchPicture(filename: string): Promise<void> {
  return axios
    .get(PROMOTION_URL + `/stream?filename=${filename}`)
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'image/jpeg' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
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
