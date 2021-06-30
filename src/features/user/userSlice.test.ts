import { store } from '../../app/store';
import { IRegisterSuccess, IUserCredentials, IUser } from './userSlice';
import { AsyncThunkAction, Dispatch } from '@reduxjs/toolkit';
import { registerRequest } from './thunks';
import * as selectorModule from './selectors';

describe('User testing', () => {
  let selectors: jest.Mocked<typeof selectorModule>;

  beforeAll(() => {
    selectors = selectorModule as any;
  });

  afterAll(() => {
    jest.unmock('./api');
    jest.unmock('./selectors');
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

      //api.register.mockClear();
      //api.register.mockResolvedValue(result);

      arg = { email: 'test@testing.com', password: 'du62VJQVn6rMMh43' };
      result = { email: 'test@testing.com', id: '0238527d-94b4-4a64-8278-7e16fa286a65' };

      action = registerRequest(arg);
    });

    it('calls the api correctly', async () => {
      //await action(dispatch, getState, undefined);
      //expect(api.register).toHaveBeenCalledWith(arg);
    });
  });
});
