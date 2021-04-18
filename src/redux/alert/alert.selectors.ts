import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { AlertState } from '../types';

const selectAlert = (state: RootState) => state.alert;

export const selectMessage = createSelector(
  [selectAlert],
  (alert: AlertState) => alert.message
)

export const selectAlertType = createSelector(
  [selectAlert],
  (alert: AlertState) => alert.atype
)

export const selectTimeout = createSelector(
  [selectAlert],
  (alert: AlertState) => alert.timeout
)
