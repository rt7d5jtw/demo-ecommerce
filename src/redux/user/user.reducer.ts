import { UserConstants } from './user.constants';
import { AnyAction } from 'redux';
import { UserRole, UserState } from '../types.d';

const INITIAL_STATE = {
  currentUser: null,
  loggedIn: false,
  role: UserRole.USER,
  hash: '',
  users: [],
  requesting: false,
  succesful: false,
  messages: [],
  errors: [],
};

export const userReducer = (state: UserState = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case UserConstants.REGISTER_REQUEST:
      return {
        ...state,
        requesting: true,
        messages: [{ body: 'Registration request for the user made', time: new Date() }],
        errors: [],
      };
    case UserConstants.LOGIN_REQUEST:
      return {
        ...state,
        currentUser: action.payload,
        requesting: true,
        messages: [{ body: 'Request to authenticate the user made', time: new Date() }],
        errors: [],
      };

    case UserConstants.LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        loggedIn: true,
        requesting: true,
        succesful: true,
        messages: [{ body: 'User logged in', time: new Date() }],
      };

    case UserConstants.REGISTER_SUCCESS:
      return {
        ...state,
        requesting: true,
        succesful: true,
        messages: [{ body: 'User registered', time: new Date() }],
      };

    case UserConstants.LOGIN_FAILURE:
    case UserConstants.REGISTER_FAILURE:
      return {
        ...state,
        succesful: false,
        errors: [],
      };

    case UserConstants.LOGOUT:
      return {
        ...state,
        currentUser: null,
        loggedIn: false,
        messages: [{ body: 'User logged out', time: new Date() }],
      };

    case UserConstants.ROLE:
      return {
        ...state,
        role: action.payload,
      };

    case UserConstants.CHANGE_PASSWORD:
      return {
        ...state,
        hash: action.payload,
      };

    case UserConstants.VIEW_USERS:
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};
