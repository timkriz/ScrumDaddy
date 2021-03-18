import axiosAuth, {BACKEND_URL} from './axios';

export const getTasks = (projectId: string, sprintId: string, storyId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks`);
};

export const getTask = (projectId: string, sprintId: string, storyId: string, taskId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`);
};

