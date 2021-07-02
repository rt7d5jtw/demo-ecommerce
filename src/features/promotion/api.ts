import axios, { AxiosError } from 'axios';
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
    .post(PROMOTION_URL, data)
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
    .delete(PROMOTION_URL + `/${id}`)
    .then((res) => console.log(res.status))
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
    .patch(PROMOTION_URL + `/${id}`, { updateProps })
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
