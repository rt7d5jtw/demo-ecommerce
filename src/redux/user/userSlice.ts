/*
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import axios, { AxiosError } from 'axios';
import { RootState } from '../root-reducer';
import { User, UserRole, UserState } from '../types.d';
import { ValidationErrors } from '../promotions/promotionsSlice';
import { authHeader } from '../../services/auth-header';

export const REGISTER_URL = 'http://localhost:3000/users/';
export const LOGIN_URL = 'http://localhost:3000/auth/signin';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface registerCredentials {
  email: string;
  password: string;
  confirm_password: string;
}

export type PasswordObj = {
  currentPassword: string;
  newPassword: string;
};

export type EmailObj = {
  currentEmail: string;
  newEmail: string;
};

export const register = createAsyncThunk(
  'user/register',
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await axios.post(REGISTER_URL);
      return response.data;
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (payload: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_URL, payload);
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRole = createAsyncThunk('user/fetchRole', async () => {
  const response = axios.get(REGISTER_URL + 'role', { headers: authHeader() });
  return response;
});

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwords: PasswordObj, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(REGISTER_URL + 'changepw', passwords, {
        headers: authHeader(),
      });
      return data;
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
  async (emails: EmailObj, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(REGISTER_URL + 'email', emails, { headers: authHeader() });
      return data;
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
  const { data } = await axios.get(REGISTER_URL);
  return data;
});

export const logout = createAsyncThunk('user/logout', async () => logoutUser());

export const logoutUser = () => {
  window.localStorage.clear();
  window.location.reload();
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    loggedIn: false,
    loading: false,
    role: UserRole.USER,
    hash: '',
    users: [],
    errors: [],
    email: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(register.fulfilled, (state, action) => {
        state.loading = false;
      });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    }),
      builder.addCase(login.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.currentUser = action.payload;
      }),
      builder.addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(logout.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.loggedIn = false;
        state.currentUser = null;
      }),
      builder.addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(fetchRole.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(fetchRole.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload;
      }),
      builder.addCase(fetchRole.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(changePassword.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.hash = action.payload;
      }),
      builder.addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(changeEmail.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(changeEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload;
      }),
      builder.addCase(changeEmail.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(fetch.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(fetch.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      }),
      builder.addCase(fetch.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      });
  },
});

const selectUser = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user: UserState) => user.currentUser
);

export const selectLoggedIn = createSelector([selectUser], (user: UserState) => user.loggedIn);

export const selectRole = createSelector([selectUser], (user: UserState) => user.role);

export const selectUsers = createSelector([selectUser], (user: UserState) => user.users);
*/
