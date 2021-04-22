import { createCategory, deleteCategory, editCategory, getCategories } from '../../services/category.service';
import { AppDispatch } from '../store';
import { CategoryConstants } from './category.constants';

export function fetchCategories() {
  return async (dispatch: AppDispatch) => {
    return getCategories().then(categories => {
      dispatch({
        type: CategoryConstants.FETCH_CATEGORIES,
        payload: categories.data
      })
    })
  }
}

export function removeCategory(id: string) {
  return async (dispatch: AppDispatch) => {
    return deleteCategory(id).then(() => {
      dispatch({
        type: CategoryConstants.DELETE_CATEGORY
      })
    })
  }
}

export function buildCategory(cname: string) {
  return async (dispatch: AppDispatch) => {
    return createCategory(cname).then(category => {
      dispatch({
        type: CategoryConstants.CREATE_CATEGORY,
        payload: category
      })
    })
  }
}

export function updateCategory(id: string, cname: string) {
  return async (dispatch: AppDispatch) => {
    return editCategory(id, cname).then(category => {
      dispatch({
        type: CategoryConstants.UPDATE_CATEGORY,
        payload: category.data
      })
    })
  }
}
