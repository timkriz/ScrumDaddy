import axiosAuth, {BACKEND_URL} from './axios';

export const getPosts = (projectId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/posts`);
};

export const postPost = (projectId: string, userId: string, timestamp: number, text: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/posts`, {
    projectId,
    userId,
    timestamp,
    text
  });
};

export const getComments = (projectId: string, postId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/posts/${postId}/comments`);
};

export const postComment = (projectId: string, postId: string, userId: string, timestamp: number, text: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/posts/${postId}/comments`, {
    postId,
    userId,
    timestamp,
    text
  });
};