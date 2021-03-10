import axiosAuth from './axios';
import {projectsUrl} from "./Endpoints";

export const getProjects = (): Promise<any> => {
  return axiosAuth.get(projectsUrl);
};

export const getProject = (id: string): Promise<any> => {
  return axiosAuth.get(`${projectsUrl}/${id}`);
};

export const deleteProject = (id: string): Promise<any> => {
  return axiosAuth.delete(`${projectsUrl}/${id}`);
};

export const postProject = (projectName: string, projectDescription: string): Promise<any> => {
  return axiosAuth.post(projectsUrl, {
    projectName,
    projectDescription
  });
};

export const putProject = (id: string, projectName: string, projectDescription: string): Promise<any> => {
  return axiosAuth.put(`${projectsUrl}/${id}`, {
    projectName,
    projectDescription
  });
};

export const getProjectUsers = (id: string): Promise<any> => {
  return axiosAuth.post(`${projectsUrl}/${id}/users`);
};

export const postProjectUser = (projectId: string, userId: string, userRole: string): Promise<any> => {
  return axiosAuth.post(`${projectsUrl}/${projectId}/users`, {
    userId,
    userRole
  });
};

export const deleteProjectUsers = (id: string): Promise<any> => {
  return axiosAuth.delete(`${projectsUrl}/${id}/users`);
};