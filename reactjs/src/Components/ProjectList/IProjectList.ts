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
  projectId: string;
  userId: string;
  userRole: string;
}

export interface IProjectDialogAssign {
  userId: string;
  roleId: string;
}

export interface ISprint {
  _id: string,
  sprintName: string,
  sprintDescription: string,
  sprintStartTime: number,
  sprintEndTime: number,
  sprintVelocity: number,
  sprintProjectId: string,
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