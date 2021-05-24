import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import axios, { AxiosError } from 'axios';
import { RootState } from '../../app/store';
import { ValidationErrors } from '../promotion/promotionSlice';
import { fetchCartState } from '../cart/cartSlice';

export const REGISTER_URL = 'http://localhost:3000/users/';
export const LOGIN_URL = 'http://localhost:3000/auth/signin';
export const CART_URL = 'http://localhost:3000/cart/';

export interface AccessTokenDTO {
  accessToken: string;
}

interface AuthorizationDTO {
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

export type IUserCredentials = Omit<IUser, 'id' | 'role' | 'salt' | 'createdAt'>;

export interface UserState {
  currentUser: null | AccessTokenDTO;
  loggedIn: boolean;
  loading: boolean;
  role: UserRole;
  hash: string | null;
  users: IUser[];
  errors: Array<string> | unknown;
  email: string;
}

export type PasswordObj = {
  currentPassword: string;
  newPassword: string;
};

export type EmailObj = {
  currentEmail: string;
  newEmail: string;
};

export const registerRequest = createAsyncThunk(
  'user/register',
  async (userData: IUserCredentials, { rejectWithValue }) => {
    const { password, email } = userData;
    return axios
      .post(REGISTER_URL, { password: password, email: email })
      .then((res) => {
        // creates the cart for user
        //axios.post(CART_URL, { headers: authHeader() });
        return res.data;
      })
      .catch((err) => {
        const error: AxiosError<ValidationErrors> = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(error.response.data);
      });
  }
);

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

export const fetchRole = createAsyncThunk(
  'user/fetchRole',
  async (): Promise<UserRole> => {
    const { data } = await axios.get(REGISTER_URL + 'role', { headers: authHeader() });
    return data;
  }
);

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

export const logout = createAsyncThunk(
  'user/logout',
  async (): Promise<void> => {
    window.localStorage.clear();
    window.location.reload();
  }
);

const initialState: UserState = {
  currentUser: null,
  loggedIn: false,
  loading: false,
  role: UserRole.USER,
  hash: '',
  users: [],
  errors: [],
  email: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
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

export default userSlice.reducer;
