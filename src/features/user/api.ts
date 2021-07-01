import {
  IUserCredentials,
  AuthorizationDTO,
  IRegisterSuccess,
  AccessTokenDTO,
  UserRole,
  PasswordObj,
  EmailObj,
  IUser,
} from './userSlice';
import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';

export const USERS_URL = 'http://localhost:3000/users/';
export const AUTH_URL = 'http://localhost:3000/auth/signin';

export const authHeader = (): AuthorizationDTO | unknown => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
};

export async function register(arg: IUserCredentials): Promise<IRegisterSuccess> {
  return axios
    .post(USERS_URL, arg, { headers: authHeader() })
    .then((res) => {
      const { email, id } = res.data;
      return { email, id };
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function login(arg: IUserCredentials): Promise<AccessTokenDTO> {
  return axios
    .post(AUTH_URL, arg)
    .then((res) => {
      if (res.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function fetchRole(): Promise<UserRole> {
  return axios
    .get(USERS_URL + 'role', { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function updatePassword(passwords: PasswordObj): Promise<string> {
  return axios
    .patch(USERS_URL + 'changepw', passwords, { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}

export async function updateEmail(emails: EmailObj): Promise<string> {
  return axios
    .patch(USERS_URL + 'email', emails, { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      //return Promise.reject([err.response.data.message, err]);
      return Promise.reject(err);
    });
}

export async function fetchAllUsers(): Promise<IUser[]> {
  return axios
    .get(USERS_URL, { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return Promise.reject(err);
    });
}
