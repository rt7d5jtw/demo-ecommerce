import { AnyAction } from 'redux';
import { IStopAction } from './ui.actions';
import { UIConstants } from './ui.constants';

const INITIAL_STATE = {
  loader: {
    actions: [],
    refreshing: [],
  },
};

export const uiReducer = (state = INITIAL_STATE, { type, payload }: any) => {
  const { loader } = state;
  const { actions, refreshing } = loader;
  switch (type) {
    case UIConstants.START_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: [...actions, payload.action],
        },
      };
    case UIConstants.STOP_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: actions.filter((action: IStopAction) => action.name !== payload.name),
        },
      };
    case UIConstants.REFRESH_ACTION_START:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: [...refreshing, payload.refreshAction],
        },
      };
    case UIConstants.REFRESH_ACTION_STOP:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: refreshing.filter((refresh) => refresh !== payload.refreshAction),
        },
      };
    default:
      return state;
  }
};
