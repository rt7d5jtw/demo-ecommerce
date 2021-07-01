import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  registerRequest,
  loginRequest,
  assignRole,
  changePassword,
  changeEmail,
  fetch,
} from './thunks';

export interface AccessTokenDTO {
  accessToken: string;
}

export interface AuthorizationDTO {
  Authorization: string;
}

export const authHeader = (): AuthorizationDTO | unknown => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
};

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

/*
export const loginRequest = createAsyncThunk(
  'user/login',
  async (userData: IUserCredentials, thunkAPI) => {
    return axios
      .post(LOGIN_URL, userData)
      .then((res) => {
        if (res.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
        axios.get(CART_URL, { headers: authHeader() }).then((res) => {
          res.data.length === 0
            ? axios.post(CART_URL, {}, { headers: authHeader() })
            : console.log('Cart already exists');
        });
        thunkAPI.dispatch(fetchCartState());
        return res.data;
      })
      .catch((err) => {
        const error: AxiosError<ValidationErrors> = err;
        if (!error.response) {
          throw err;
        }
        return thunkAPI.rejectWithValue(error.response.data);
      });
  }
);
*/

export const logout = createAsyncThunk(
  'user/logout',
  async (): Promise<void> => {
    window.localStorage.clear();
    window.location.reload();
  }
);

export interface shippingInformation {
  address: string;
  country: string;
  city: string;
  postalcode: number | null;
}

export const addShippingInformation = createAction<shippingInformation>(
  'user/addShippingInformation'
);

export interface UserState {
  currentUser: null | AccessTokenDTO;
  loggedIn: boolean;
  loading: boolean;
  role: UserRole;
  hash: string | null;
  users: IUser[];
  errors: null | any;
  shippingInfo: shippingInformation;
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
  shippingInfo: {
    address: '',
    country: '',
    city: '',
    postalcode: null,
  },
  email: null,
};

export const clearErrors = createAction('user/clearErrors');

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
