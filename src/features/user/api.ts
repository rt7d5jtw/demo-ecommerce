import {
  IUserCredentials,
  AuthorizationDTO,
  IRegisterSuccess,
  AccessTokenDTO,
  UserRole,
  PasswordObj,
  EmailObj,
} from './userSlice';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { CART_URL, checkIfCart } from '../cart/api';

export const REGISTER_URL = 'http://localhost:3000/users/';
export const LOGIN_URL = 'http://localhost:3000/auth/signin';

export const authHeader = (): AuthorizationDTO | unknown => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
};

export function useHTTPClient(): AxiosInstance {
  return axios.create({ baseURL: REGISTER_URL, headers: authHeader() });
}

export function useAPIClientNoAuth(): AxiosInstance {
  const instance = axios.create({ baseURL: REGISTER_URL });
  instance.interceptors.response.use((res) => res);
  return instance;
}

export async function register(arg: IUserCredentials): Promise<IRegisterSuccess> {
  const client = useAPIClientNoAuth();
  const { data } = await client.post(REGISTER_URL, arg);
  const { email, id } = data;
  return { email, id };
}

export async function login(arg: IUserCredentials): Promise<AccessTokenDTO> {
  const client = useAPIClientNoAuth();
  const data = await client
    .post(LOGIN_URL, arg)
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
      return error.response.data;
    });
  return data;
}

export async function fetchRole(): Promise<UserRole> {
  const { data } = await axios.get(REGISTER_URL + 'role', { headers: authHeader() });
  return data;
}

export async function updatePassword(passwords: PasswordObj): Promise<string> {
  return axios
    .patch(REGISTER_URL + 'changepw', passwords, { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return error.response.data;
    });
}

export async function updateEmail(emails: EmailObj): Promise<string> {
  return axios
    .patch(REGISTER_URL + 'email', emails, { headers: authHeader() })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return error.response.data;
    });
}

export async function fetchUser(): Promise<{ email: string; id: string }> {
  const { data } = await axios.get(REGISTER_URL);
  return { email: data.email, id: data.id };
}
