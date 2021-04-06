import axiosAuth, {BACKEND_URL} from './axios';

export const getTaskUsers = (projectId: string, sprintId: string, storyId: string, taskId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}/taskUsers`);
};

export const getTaskUser = (projectId: string, sprintId: string, storyId: string, taskId: string, taskUserId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}/taskUsers/${taskUserId}`);
};

export const deleteTaskUser = (projectId: string, sprintId: string, storyId: string, taskId: string, taskUserId: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}/taskUsers/${taskUserId}`);
};

export const putTaskUser = (projectId: string, sprintId: string, storyId: string, taskId: string, taskUserId: string,
    userId: string, timestamp: number, timeLog: number, timeRemaining: number): Promise<any> => {
  return axiosAuth.put(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}/taskUsers/${taskUserId}`, {
    userId,
    timestamp,
    timeLog,
    timeRemaining
  });
};

export const postTaskUser = (projectId: string, sprintId: string, storyId: string, taskId: string,
    userId: string, timestamp: number, timeLog: number, timeRemaining: number): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}/taskUsers`, {
    userId,
    timestamp,
    timeLog,
    timeRemaining
  });
};

