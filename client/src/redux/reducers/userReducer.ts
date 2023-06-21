import { ActionTypes } from "../contants/action-types";

export interface ReducerTypes {
  type: string;
  payload: object;
}

/* Get user from localStorage */
let user: string | null = localStorage.getItem("user");
if (user !== null) {
  user = JSON.parse(user);
} else {
  user = null;
}

const initialState = {
  user,
};

export const userReducer = (
  state = initialState,
  { type, payload }: ReducerTypes
) => {
  switch (type) {
    case ActionTypes.REGISTER_USER:
      return { ...state, user: payload };
    case ActionTypes.LOGIN_USER:
      return { ...state, user: payload };
    case ActionTypes.FETCH_ALL_USER:
      return { ...state, user: payload };
    case ActionTypes.UPDATE_USER:
      return { ...state, user: payload };
    case ActionTypes.UPDATE_USER_PROFILE:
      return { ...state, user: payload };
    case ActionTypes.USER_DETAIL:
      return { ...state, user: payload };
    case ActionTypes.DELETE_USER:
      return { ...state, user: payload };
    case ActionTypes.LOGOUT_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};
