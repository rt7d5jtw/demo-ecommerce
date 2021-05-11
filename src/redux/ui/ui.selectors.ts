import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { UIState } from '../types';

const selectUI = (state: RootState) => state.ui;

export const checkIfLoading = createSelector([selectUI], (ui: UIState) => ui.loader.actions);

export const checkIfRefreshing = createSelector([selectUI], (ui: UIState) => ui.loader.refreshing);
