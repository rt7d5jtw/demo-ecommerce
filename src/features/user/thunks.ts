import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { emailUpdated, passwordUpdated } from '../alert/alertSlice';
import { checkIfCart } from '../cart/api';
import { fetchCartState } from '../cart/thunks';
import { ValidationErrors } from '../promotion/promotionSlice';
import { register, login, fetchRole, updatePassword, updateEmail, fetchAllUsers } from './api';
import { EmailObj, IUserCredentials, PasswordObj, UserRole } from './userSlice';

export const registerRequest = createAsyncThunk(
  'user/register',
  async (arg: IUserCredentials, { rejectWithValue }) => {
    try {
      return await register(arg);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginRequest = createAsyncThunk(
  'user/login',
  async (arg: IUserCredentials, { rejectWithValue, dispatch }) => {
    return login(arg)
      .then((res) => {
        checkIfCart();
        dispatch(fetchCartState());
        return res;
      })
      .catch((err) => {
        const error: AxiosError<ValidationErrors> = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(err.response.data);
      });
    /* checks if user has a cart and conditionally creates one */
  }
);

export const assignRole = createAsyncThunk(
  'user/assignRole',
  async (): Promise<UserRole> => {
    return fetchRole();
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwords: PasswordObj, { rejectWithValue, dispatch }) => {
    try {
      const result = await updatePassword(passwords);
      dispatch(passwordUpdated());
      return result;
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const changeEmail = createAsyncThunk(
  'user/changeEmail',
  async (emails: EmailObj, { rejectWithValue, dispatch }) => {
    try {
      const result = await updateEmail(emails);
      dispatch(emailUpdated());
      return result;
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetch = createAsyncThunk('user/fetch', async () => {
  return fetchAllUsers();
});
