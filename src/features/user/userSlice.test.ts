import { store } from '../../app/store';
import { IRegisterSuccess, IUserCredentials } from './userSlice';
import { AsyncThunkAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { registerRequest } from './thunks';

jest.mock('axios');

describe('User testing', () => {
  afterAll(() => {
    jest.unmock('axios');
  });
  describe('register', () => {
    let action: AsyncThunkAction<IRegisterSuccess, IUserCredentials, Record<string, unknown>>;
    let dispatch: Dispatch;
    let getState: () => unknown;

    let arg: IUserCredentials;
    let result: IRegisterSuccess;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();

      arg = { email: 'test@testing.com', password: 'du62VJQVn6rMMh43' };
      result = { email: 'test@testing.com', id: '' };

      action = registerRequest(arg);
    });

    it('calls the api correctly', async () => {
      await action(dispatch, getState, undefined);
      expect(axios.post).toHaveBeenCalledWith(arg);
    });
  });
});
