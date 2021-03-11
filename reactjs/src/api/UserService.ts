import axiosAuth, {BACKEND_URL} from './axios';

export const getUsers = (): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/users`);
};

export const postUser = (username: string, password: string, role: string, name: string, surname: string, email: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/users`, {
    username,
    password,
    role,
    name,
    surname,
    email
  });
};

export const patchUser = (id: string, username: string, password: string, role: string, name: string, surname: string, email: string): Promise<any> => {
  return axiosAuth.patch(`${BACKEND_URL}/users/${id}`, {
    username,
    password,
    role,
    name,
    surname,
    email
  });
};

export const deleteUser = (id: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/users/${id}`);
};