import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { checkIfCart } from '../cart/api';
import { fetchCartState } from '../cart/thunks';
import { ValidationErrors } from '../promotion/promotionSlice';
import { register, login, fetchRole, updatePassword, updateEmail, fetchUser } from './api';
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
  async (passwords: PasswordObj) => {
    return updatePassword(passwords);
  }
);

export const changeEmail = createAsyncThunk('user/changeEmail', async (emails: EmailObj) => {
  return updateEmail(emails);
});

export const fetch = createAsyncThunk('user/fetch', async () => {
  return fetchUser();
});
