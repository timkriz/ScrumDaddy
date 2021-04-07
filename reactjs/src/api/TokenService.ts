import {IUser} from "../Components/ProjectList/IProjectList";

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const setUserId = (id: string): void => {
  localStorage.setItem("userId", id);
};

export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

export const removeUserId = (): void => {
  localStorage.removeItem("userId");
};

export const setUserRole = (role: string): void => {
  localStorage.setItem("userRole", role);
};

export const getUserRole = (): string | null => {
  return localStorage.getItem("userRole");
};

export const removeUserRole = (): void => {
  localStorage.removeItem("userRole");
};

export const setUser = (user: IUser): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): IUser | null => {
  const user = localStorage.getItem("user");
  if(user === null) {
    return null;
  }

  else {
    return JSON.parse(user) as IUser;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem("user");
};