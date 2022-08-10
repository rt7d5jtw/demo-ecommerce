import axios, { AxiosError } from 'axios';
import clientApi from '../shared/api';
import { authHeader } from '../user/api';
import {
  ValidationErrors,
  IPromotions,
  CreatePromotionDto,
  UpdatePromotionDto,
} from './promotionSlice';

const PROMOTION_URL = clientApi + '/promotions';

async function fetchPromotions(): Promise<IPromotions[]> {
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

async function createPromotion(data: CreatePromotionDto): Promise<IPromotions> {
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

async function removePromotion(id: number): Promise<void> {
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

async function updatePromotion({
  id,
  ...updateProps
}: UpdatePromotionDto): Promise<IPromotions> {
  return axios
    .patch(
      PROMOTION_URL + `/${id}`,
      { ...updateProps },
      { headers: authHeader() }
    )
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

async function fetchPicture(filename: string): Promise<void> {
  return axios
    .get(PROMOTION_URL + `/stream?filename=${filename}`)
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'image/jpeg' })
      );
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

export {
  fetchPicture,
  updatePromotion,
  removePromotion,
  createPromotion,
  fetchPromotions,
  PROMOTION_URL,
};
