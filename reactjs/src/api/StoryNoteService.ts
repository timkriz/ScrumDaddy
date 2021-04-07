import axiosAuth, {BACKEND_URL} from './axios';

export const getNotes = (projectId: string, sprintId: string, storyId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/notes`);
};

export const postNotes = (projectId: string, sprintId: string, storyId: string, userId: string, timestamp: number, text: string): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/notes`, {
    projectId,
    storyId,
    sprintId,
    userId,
    timestamp,
    text
  });
};

export const deleteNote = (projectId: string, sprintId: string, storyId: string, noteId: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/notes/${noteId}`);
};