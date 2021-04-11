import axiosAuth, {BACKEND_URL} from './axios';

export const postStory = (projectId: string, sprintId: string, name: string, description: string, timeEstimate: number,
        businessValue: number, comment: string, priority: string, tests: string, status: string): Promise<any> => {
    return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories`, {
        projectId,
        sprintId, 
        name,
        description,
        timeEstimate,
        businessValue,
        comment,
        priority,
        tests,
        status
        });
    };
export const putStory = (projectId: string, sprintId: string, storyId: string, name: string, description: string, velocity: number): Promise<any> => {
    return axiosAuth.put(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}`, {
        name,
        description,
        velocity
        });
    };

    export const deleteStory = (projectId: string, sprintId: string, storyId: string): Promise<any> => {
        return axiosAuth.delete(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}`);
        };