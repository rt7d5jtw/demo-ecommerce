import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { UserState } from './userSlice';

const selectUser = (state: RootState) => state.user;

export const selectAccessToken = createSelector(
  [selectUser],
  (user: UserState) => user.accessToken
);

export const selectLoggedIn = createSelector([selectUser], (user: UserState) => user.loggedIn);

export const selectRole = createSelector([selectUser], (user: UserState) => user.role);

export const selectUsers = createSelector([selectUser], (user: UserState) => user.users);

export const selectShippingInfo = createSelector(
  [selectUser],
  (user: UserState) => user.shippingInfo
);

export const selectUserEmail = createSelector([selectUser], (user: UserState) => user.email);

export const selectUserErrors = createSelector([selectUser], (user: UserState) => user.errors);
