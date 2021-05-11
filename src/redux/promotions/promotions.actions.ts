import { PromotionConstants } from './promotions.constants';
import axios from 'axios';
import { AppDispatch } from '../store';
import { _Promotions } from '../types';

const PROMOTION_URL = 'http://localhost:3000/promotions';

/* side effects */

export function fetch() {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: PromotionConstants.FETCH_PROMOTION_BEGIN,
    });
    axios
      .get(PROMOTION_URL)
      .then((res) => {
        dispatch({
          type: PromotionConstants.FETCH_PROMOTION_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) =>
        dispatch({
          type: PromotionConstants.FETCH_PROMOTION_FAILURE,
          payload: error,
        })
      );
  };
}

export function add(data: _Promotions) {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: PromotionConstants.CREATE_PROMOTION_BEGIN,
    });
    axios
      .post(PROMOTION_URL, data)
      .then((res) => {
        dispatch({
          type: PromotionConstants.CREATE_PROMOTION_SUCCESS,
          payload: data,
        });
      })
      .catch((error) =>
        dispatch({
          type: PromotionConstants.CREATE_PROMOTION_FAILURE,
          payload: error,
        })
      );
  };
}

export function remove(id: string) {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: PromotionConstants.REMOVE_PROMOTION_BEGIN,
    });
    axios
      .delete(PROMOTION_URL.concat('/' + id))
      .then((res) => {
        dispatch({
          type: PromotionConstants.REMOVE_PROMOTION_SUCCESS,
        });
      })
      .catch((error) =>
        dispatch({
          type: PromotionConstants.REMOVE_PROMOTION_FAILURE,
          payload: error,
        })
      );
  };
}
