import axios from 'axios';
import { User } from '../redux/types.d';

export const REGISTER_URL = 'http://localhost:3000/users/'

export interface Creds {
  email: string;
  password: string;
}

export const registerUser = (payload: Creds): Promise<User> => {
  return axios.post(REGISTER_URL, payload)
}
