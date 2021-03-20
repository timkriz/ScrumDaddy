import axiosAuth, {BACKEND_URL} from './axios';

export const getTasks = (projectId: string, sprintId: string, storyId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks`);
};

export const getTask = (projectId: string, sprintId: string, storyId: string, taskId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`);
};

export const deleteTask = (projectId: string, sprintId: string, storyId: string, taskId: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`);
};

export const putTask = (projectId: string, sprintId: string, storyId: string, taskId: string, name: string, description: string,
    timeEstimate: number, suggestedUser: string, assignedUser: string, status: string): Promise<any> => {
  return axiosAuth.put(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`, {
    name,
    description,
    timeEstimate,
    suggestedUser,
    assignedUser,
    status
  });
};

