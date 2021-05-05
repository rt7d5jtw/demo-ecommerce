import axios from 'axios';
import { User } from '../redux/types.d';
import { Creds } from './user.service';

export const LOGIN_URL = 'http://localhost:3000/auth/signin';

export const loginUser = (payload: Creds): Promise<User> => {
  return axios.post(LOGIN_URL, payload).then((res) => {
    if (res.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  });
};

export const logoutUser = () => {
  window.localStorage.clear();
  window.location.reload();
};
