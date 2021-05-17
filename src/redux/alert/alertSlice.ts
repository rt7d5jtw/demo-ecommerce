import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import axios, { AxiosError } from 'axios';
import { RootState } from '../root-reducer';
import { AlertState } from '../types';

export enum alert_type {
  success = 'success',
  warning = 'warning',
  error = 'error',
  nostate = '',
}

export const userLogged = createAction('alert/userLogged');

export const registered = createAction('alert/registered');

export const hideout = createAction('alert/hideout');

export const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    message: '',
    atype: alert_type.nostate,
    timeout: 5000,
  },
  reducers: {
    userLogged: (state) => {
      state.message = 'Login succesful';
      state.atype = alert_type.success;
    },
    registered: (state) => {
      state.message = 'User registered succesfully';
      state.atype = alert_type.success;
    },
    hideout: (state) => {
      (state.message = ''), (state.atype = alert_type.nostate);
    },
  },
});

const selectAlert = (state: RootState) => state.alert;

export const selectMessage = createSelector([selectAlert], (alert: AlertState) => alert.message);

export const selectAlertType = createSelector([selectAlert], (alert: AlertState) => alert.atype);

export const selectTimeout = createSelector([selectAlert], (alert: AlertState) => alert.timeout);

export default alertSlice.reducer;
