import axiosAuth from './axios';
import {loginUrl} from "./Endpoints";

export const userLogin = (username: string, password: string): Promise<any> => {
  return axiosAuth.post(loginUrl, {
    username,
    password
  });
};