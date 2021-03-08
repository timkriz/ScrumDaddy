import axiosAuth from './axios';
import {postProjectUrl, postProjectUserUrl} from "./Endpoints";

export const postProject = (projectName: string, projectDescription: string): Promise<any> => {
  return axiosAuth.post(postProjectUrl, {
    projectName,
    projectDescription
  });
};

export const postProjectUser = (projectId: string, userId: string, userRole: string): Promise<any> => {
  return axiosAuth.post(postProjectUserUrl, {
    projectId,
    userId,
    userRole
  });
};