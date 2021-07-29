import { createAction, createSlice } from '@reduxjs/toolkit';
import { AccessTokenDTO } from './api';
import {
  registerRequest,
  loginRequest,
  assignRole,
  changePassword,
  changeEmail,
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

export type IUserCredentials = Omit<IUser, 'id' | 'role' | 'salt' | 'createdAt'>;

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
  currentUser: null | AccessTokenDTO;
  loggedIn: boolean;
  loading: boolean;
  role: UserRole;
  hash: string | null;
  users: IUser[];
  errors: null | any;
  shippingInfo: shippingInformation | null;
  email: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loggedIn: false,
  loading: false,
  role: UserRole.USER,
  hash: null,
  users: [],
  errors: null,
  shippingInfo: null,
  email: null,
};

export const clearErrors = createAction('user/clearErrors');
export const addShippingInformation = createAction<shippinfInfoDto>('user/addShippingInformation');
export const clearShippingInfo = createAction('user/clearShippingInfo');

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
  },
  extraReducers: (builder) => {
    builder.addCase(registerRequest.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(registerRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        //state.users = [...state.users, payload];
      });
    builder.addCase(registerRequest.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    }),
      builder.addCase(loginRequest.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(loginRequest.fulfilled, (state, { payload }) => {
        state.currentUser = payload;
        state.loading = false;
        state.loggedIn = true;
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
        state.currentUser = null;
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
