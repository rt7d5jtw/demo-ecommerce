import axios from 'axios';
import { IUser, User } from '../redux/types.d';
import { authHeader } from './auth-header';

export const REGISTER_URL = 'http://localhost:3000/users/';

export interface Creds {
  email: string;
  password: string;
}

export type PasswordObj = {
  currentPassword: string;
  newPassword: string;
};

export type EmailObj = {
  currentEmail: string;
  newEmail: string;
};

export const registerUser = (payload: Creds): Promise<User> => {
  return axios.post(REGISTER_URL, payload);
};

export const fetchRole = (): Promise<any> => {
  return axios.get(REGISTER_URL.concat('role'), { headers: authHeader() });
};

export const changePassword = (passwords: PasswordObj): Promise<User> => {
  return axios.patch(REGISTER_URL.concat('changepw'), passwords, { headers: authHeader() });
};

export function fetchUsers(): Promise<IUser[]> {
  return axios.get(REGISTER_URL);
}
