import {ProjectRoles} from "../../data/Roles";

export interface IProject {
  _id: string;
  name: string;
  description: string;
}

export interface IUser {
  _id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export interface IProjectUser {
  _id: string;
  projectId: string;
  userId: string;
  userRole: ProjectRoles;
}

export interface IProjectDialogAssign {
  userId: string;
  roleId: string;
}

export interface ISprint {
  _id: string,
  name: string,
  description: string,
  startTime: number,
  endTime: number,
  velocity: number,
  projectId: string,
}

export interface ITask {
  _id: string,
  name: string,
  description: string,
  timeEstimate: number,
  suggestedUser: string,
  assignedUser: string,
  status: string,
  projectId: string,
  sprintId: string,
  storyId: string,
}

export interface IStory {
  _id: string,
  name: string,
  timeEstimate: number,
  businessValue: number,
  comment: string,
  priority: string,
  tests: string,
  status: string,
  projectId: string,
  sprintId: string,
}

export interface IPost {
  _id: string;
  projectId: string;
  userId: string;
  timestamp: number;
  text: string;
}

export interface IComment {
  _id: string;
  postId: string;
  userId: string;
  timestamp: number;
  text: string;
}