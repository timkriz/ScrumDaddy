import axiosAuth from './axios';
import {postUserUrl} from "./Endpoints";

export const postUser = (username: string, password: string, role: string, name: string, surname: string, email: string): Promise<any> => {
  return axiosAuth.post(postUserUrl, {
    username,
    password,
    role,
    name,
    surname,
    email
  });
};