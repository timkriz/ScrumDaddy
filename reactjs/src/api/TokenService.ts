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