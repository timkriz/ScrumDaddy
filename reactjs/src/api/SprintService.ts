import axiosAuth from './axios';
import {postSprintUrl} from "./Endpoints";

export const postSprint = (sprintName: string, sprintDescription: string, sprintStartTime: number, sprintEndTime: number, sprintVelocity: number, sprintProjectId: string): Promise<any> => {
  return axiosAuth.post(postSprintUrl, {
    sprintName,
    sprintDescription,
    sprintStartTime,
    sprintEndTime,
    sprintVelocity,
    sprintProjectId
  });
};