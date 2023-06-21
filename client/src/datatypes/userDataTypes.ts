// Interfaces
export interface IActions {
  FETCH_ALL_USER: string;
  REGISTER_USER: string;
  LOGIN_USER: string;
  USER_DETAIL: string;
  UPDATE_USER: string;
  UPDATE_USER_PROFILE: string;
  DELETE_USER: string;
  LOGOUT_USER: string;
}

export interface IGetAllUser {
  type: IActions["FETCH_ALL_USER"];
  payload: object;
}

export interface ILogin {
  type: IActions["LOGIN_USER"];
  payload: object;
}

export interface IRegister {
  type: IActions["REGISTER_USER"];
  payload: object;
}
export interface IUserDetail {
  type: IActions["USER_DETAIL"];
  payload: object;
}

export interface IUpdateUserData {
  type: IActions["UPDATE_USER"];
  payload: object;
}

export interface IUpdateUserProfile {
  type: IActions["UPDATE_USER_PROFILE"];
  payload: object;
}

export interface IDelete {
  type: IActions["DELETE_USER"];
  payload: object;
}

export interface ILogout {
  type: IActions["LOGOUT_USER"];
  payload: object;
}

// State data type
export interface StateDataType {
  user: StateItems;
}

type StateItems = {
  user: User | null
};

type User = {
  login: boolean;
  _id: string;
  username: string;
  email: string;
  token: string;
};
