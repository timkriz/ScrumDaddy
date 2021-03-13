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

instance.interceptors.response.use(
  response => response,
  error => {
    console.log(error.message);
    console.log(JSON.stringify(error));
    // removeToken();

    if (error.response && error.response.status === 401) {
      // window.location.href = '/'
      // OR refresh token https://github.com/axios/axios/issues/266
      // https://stackoverflow.com/questions/51646853/automating-access-token-refreshing-via-interceptors-in-axios
      // keycloak.updateToken()
    }
    else {

      return Promise.reject(error);
    }
  }
)

export const CancelToken = axios.CancelToken;
export default instance;