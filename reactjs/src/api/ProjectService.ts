import axiosAuth, {BACKEND_URL} from './axios';

export const getProjects = (): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects`);
};

export const getProject = (id: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${id}`);
};

export const deleteProject = (id: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${id}`);
};

export const postProject = (name: string, description: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects`, {
    name,
    description
  });
};

export const putProject = (id: string, name: string, description: string): Promise<any> => {
  return axiosAuth.put(`${BACKEND_URL}/projects/${id}`, {
    name,
    description
  });
};

export const getProjectUsers = (id: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${id}/users`);
};

export const postProjectUser = (projectId: string, userId: string, userRole: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/users`, {
    userId,
    userRole
  });
};

export const deleteProjectUsers = (id: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${id}/users`);
};