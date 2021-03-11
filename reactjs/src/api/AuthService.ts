import axiosAuth, {BACKEND_URL} from './axios';

export const userLogin = (username: string, password: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/login`, {
    username,
    password
  });
};