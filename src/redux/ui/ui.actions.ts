import { UIConstants } from './ui.constants';

export interface IStopAction {
  name: string;
}

export const startAction = (name: string, params: any) => ({
  type: UIConstants.START_ACTION,
  payload: { name, params },
});

export const stopAction = (name: string) => ({
  type: UIConstants.STOP_ACTION,
  payload: { name },
});

export const refreshActionStart = (refreshAction: any) => ({
  type: UIConstants.REFRESH_ACTION_START,
  payload: { refreshAction },
});

export const refreshActionStop = (refreshAction: any) => ({
  type: UIConstants.REFRESH_ACTION_STOP,
  payload: { refreshAction },
});
