import axiosAuth, {BACKEND_URL} from './axios';

export const getPosts = (): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/posts`);
};

export const getComments = (postId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/posts/${postId}/comments`);
};