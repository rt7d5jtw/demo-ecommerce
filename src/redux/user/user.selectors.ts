import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { UserState } from '../types';

const selectUser = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user: UserState) => user.currentUser
);

export const selectLoggedIn = createSelector(
  [selectUser],
  (user: UserState) => user.loggedIn
)
