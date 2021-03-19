import axiosAuth, {BACKEND_URL} from './axios';

export const getSprints = (projectId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints`);
};

export const getSprint = (projectId: string, sprintId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}`);
};

export const postSprint = (projectId: string, name: string, description: string, startTime: number, endTime: number, velocity: number): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/sprints`, {
    name,
    description,
    startTime,
    endTime,
    velocity
  });
};

export const putSprint = (projectId: string, sprintId: string, name: string, description: string, startTime: number, endTime: number, velocity: number): Promise<any> => {
  return axiosAuth.put(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}`, {
    name,
    description,
    startTime,
    endTime,
    velocity
  });
};

export const deleteSprint = (projectId: string, sprintId: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}`);
};