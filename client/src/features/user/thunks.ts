import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  emailUpdated,
  passwordUpdated,
  userLogged,
  registered,
} from '../alert/alertSlice';
import { fetchCart } from '../cart/thunks';
import { ValidationErrors } from '../promotion/promotionSlice';
import {
  register,
  login,
  fetchRole,
  updatePassword,
  updateEmail,
  fetchAllUsers,
  deleteUser,
} from './api';
import { EmailObj, IUserCredentials, PasswordObj, UserRole } from './userSlice';

export const registerRequest = createAsyncThunk(
  'user/register',
  async (arg: IUserCredentials, { rejectWithValue, dispatch }) => {
    try {
      return register(arg).then((res) => {
        setTimeout(() => dispatch(registered()), 500);
        return res;
      });
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
  async (arg: IUserCredentials, thunkAPI) => {
    const res = await login(arg).catch((err) => {
      if (!err.response) {
        throw err;
      }
      return thunkAPI.rejectWithValue(err.response.data);
    });
    return res;
  }
);

export const handleSignIn = createAsyncThunk(
  'user/handleSignIn',
  async (arg: IUserCredentials, thunkAPI) => {
    const res = await thunkAPI.dispatch(loginRequest(arg));
    if (res.meta.requestStatus === 'fulfilled') {
      thunkAPI.dispatch(userLogged());
      /* hacky patch to fix for later */
      setTimeout(() => thunkAPI.dispatch(fetchCart()), 1000);
      setTimeout(() => thunkAPI.dispatch(assignRole()), 1000);
    } else if (res.meta.requestStatus === 'rejected') {
      return thunkAPI.rejectWithValue(res.payload);
    }
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

export const removeUser = createAsyncThunk(
  'user/removeUser',
  async (id: string, { rejectWithValue }) => {
    try {
      return deleteUser(id);
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

export const logout = createAsyncThunk(
  'user/logout',
  async (): Promise<void> => {
    window.localStorage.clear();
    window.location.reload();
  }
);
