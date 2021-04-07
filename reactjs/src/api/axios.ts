import axios from 'axios';
import {getToken, removeToken} from "./TokenService";

export const BACKEND_URL = "http://localhost:8080/api";

const instance = axios.create();

instance.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export const CancelToken = axios.CancelToken;
export default instance;