import { createAction, createSlice } from '@reduxjs/toolkit';
import { AccessTokenDTO } from './api';
import {
  registerRequest,
  loginRequest,
  assignRole,
  changePassword,
  changeEmail,
  removeUser,
  fetch,
  logout,
} from './thunks';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUser {
  email: string;
  password: string;
  id: string;
  role: UserRole;
  salt: string;
  createdAt: string;
}

export type IRegisterSuccess = Pick<IUser, 'email' | 'id'>;

export type OptUser = Partial<IUser>;

export type IUserCredentials = Pick<IUser, 'email' | 'password'>;

export type PasswordObj = {
  currentPassword: string;
  newPassword: string;
};

export type EmailObj = {
  currentEmail: string;
  newEmail: string;
};

export interface shippingInformation {
  address: string;
  country: string;
  city: string;
  postalcode: string;
  tax: number;
  cost: number;
  promo: number;
}

export type shippinfInfoDto = Partial<shippingInformation>;

export interface UserState {
  accessToken: AccessTokenDTO | null;
  loggedIn: boolean;
  loading: boolean;
  role: UserRole | null;
  hash: string | null;
  users: IUser[];
  errors: unknown | null;
  shippingInfo: shippingInformation | null;
  email: string | null;
}

const initialState: UserState = {
  accessToken: null,
  loggedIn: false,
  loading: false,
  role: null,
  hash: null,
  users: [],
  errors: null,
  shippingInfo: null,
  email: null,
};

export const clearErrors = createAction('user/clearErrors');

export const addShippingInformation = createAction<shippinfInfoDto>('user/addShippingInformation');

export const clearShippingInfo = createAction('user/clearShippingInfo');

export const setLoggedIn = createAction<{ loggedIn: boolean; accessToken: string }>(
  'user/setLoggedIn'
);

export const setRole = createAction<{ role: UserRole }>('user/setRole');

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    addShippingInformation: (state, { payload }) => {
      state.shippingInfo = payload;
    },
    clearErrors: (state) => {
      state.errors = null;
    },
    clearShippingInfo: (state) => {
      state.shippingInfo = null;
    },
    setLoggedIn: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.loggedIn = payload.loggedIn;
    },
    setRole: (state, { payload }) => {
      state.role = payload.role;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerRequest.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(registerRequest.fulfilled, (state) => {
        state.loading = false;
      });
    builder.addCase(registerRequest.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    }),
      builder.addCase(loginRequest.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(loginRequest.fulfilled, (state, { payload }) => {
        state.accessToken = payload;
        state.loggedIn = true;
        state.loading = false;
      }),
      builder.addCase(loginRequest.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(logout.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.loggedIn = false;
        state.accessToken = null;
      }),
      builder.addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(assignRole.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(assignRole.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload;
      }),
      builder.addCase(assignRole.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(changePassword.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(changePassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.hash = payload;
      }),
      builder.addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      }),
      builder.addCase(changeEmail.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(changeEmail.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.email = payload;
      }),
      builder.addCase(changeEmail.rejected, (state, { payload }) => {
        state.loading = false;
        state.errors = payload;
      }),
      builder.addCase(removeUser.pending, (state) => {
        state.loading = true;
      });
    builder.addCase(removeUser.fulfilled, (state) => {
      state.loading = false;
    }),
      builder.addCase(removeUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.errors = payload;
      }),
      builder.addCase(fetch.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(fetch.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload;
      }),
      builder.addCase(fetch.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      });
  },
});

export default userSlice.reducer;
