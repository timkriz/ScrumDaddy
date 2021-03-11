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

export const postProject = (projectName: string, projectDescription: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects`, {
    projectName,
    projectDescription
  });
};

export const putProject = (id: string, projectName: string, projectDescription: string): Promise<any> => {
  return axiosAuth.put(`${BACKEND_URL}/projects/${id}`, {
    projectName,
    projectDescription
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