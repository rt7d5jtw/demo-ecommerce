import { UserConstants } from './user.constants';
import { User } from '../types.d';
import { registerUser } from '../../services/user.service';
import { loginUser, logoutUser } from '../../services/auth.service';
import { AppDispatch } from '../store';

export const registerRequest = (userData: User) =>
  (dispatch: AppDispatch) => {
    return registerUser(userData)
      .then((response) => {
        dispatch({
          type: UserConstants.REGISTER_SUCCESS,
        });

        dispatch({
          type: UserConstants.SET_MESSAGE,
          payload: response,
        })

        return Promise.resolve();
      },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          dispatch({
            type: UserConstants.REGISTER_FAILURE,
          })

          dispatch({
            type: UserConstants.SET_MESSAGE,
            payload: message,
          })

          return Promise.reject();
        }
      );
  };

export const loginRequest = (userData: User) =>
  (dispatch: AppDispatch) => {
    return loginUser(userData)
      .then((user) => {
        dispatch({
          type: UserConstants.LOGIN_SUCCESS,
          payload: { userData: user }
        });
        return Promise.resolve();
      },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message || error.toString();

          dispatch({
            type: UserConstants.LOGIN_FAILURE,
          });

          dispatch({
            type: UserConstants.SET_MESSAGE,
            payload: message
          });

          return Promise.reject();
        }
      );
  };

export const logoutRequest = () => {
  logoutUser()
  return { type: UserConstants.LOGOUT }
};
