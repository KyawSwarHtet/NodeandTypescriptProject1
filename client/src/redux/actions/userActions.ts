import userApis from "../../apis/apidata";
import { ActionTypes } from "../contants/action-types";
import {
  IGetAllUser,
  IActions,
  IDelete,
  ILogin,
  IRegister,
  IUpdateUserData,
  IUpdateUserProfile,
  IUserDetail,
} from "../../datatypes/userDataTypes";

//for get all user data
export const fetchAllUsers =
  () => async (dispatch: (arg: IGetAllUser) => IGetAllUser) => {
    const response = await userApis.get("/alluser");
    dispatch({ type: ActionTypes.FETCH_ALL_USER, payload: response.data });
  };

//for user Login
export const loginUser =
  (data: any) => async (dispatch: (arg: ILogin) => ILogin) => {
    console.log("user data ", data);
    const response = await userApis.post(`/login`, data);
    console.log("responser data errro", response.data);

    //saving user data to localStorage
    if (response.data)
      localStorage.setItem("user", JSON.stringify(response.data));
    dispatch({ type: ActionTypes.LOGIN_USER, payload: response.data });
  };

//for user Register
export const registerUser =
  (data: any) => async (dispatch: (arg: IRegister) => IRegister) => {
    const result = Object.fromEntries(data.entries());
    console.log("data from reg is", result);
    const response = await userApis.post(`/register`, result);

    dispatch({ type: ActionTypes.REGISTER_USER, payload: response.data });
  };

//for user data update
export const updateUserData =
  (id: string, data: any) =>
  async (dispatch: (arg: IUpdateUserData) => IUpdateUserData) => {
    const response = await userApis.post(`/update/${id}`, data);
    dispatch({ type: ActionTypes.REGISTER_USER, payload: response.data });
  };

//for user profile update
export const updateUserProfile =
  (id: string, data: any) =>
  async (dispatch: (arg: IUpdateUserProfile) => IUpdateUserProfile) => {
    const response = await userApis.post(`/profileupdate`, data);
    dispatch({ type: ActionTypes.REGISTER_USER, payload: response.data });
  };

//for user Detail
export const userDetail =
  (id: string) => async (dispatch: (arg: IUserDetail) => IUserDetail) => {
    const response = await userApis.post(`/detail/${id}`);
    dispatch({ type: ActionTypes.REGISTER_USER, payload: response.data });
  };

//for user data delete
export const deleteUser =
  (id: string, data: any) => async (dispatch: (arg: IDelete) => IDelete) => {
    const response = await userApis.post(`/delete`, data);
    dispatch({ type: ActionTypes.REGISTER_USER, payload: response.data });
  };

//Logout user
export const logout = () => {
  localStorage.removeItem("user");
};
